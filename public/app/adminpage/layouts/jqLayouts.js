//TODO: rewrite and remove completely
(function ($) {
    'use strict';

    $.fn.selectpicker.defaults = {
        noneSelectedText: 'Ничего не выбрано',
        noneResultsText: 'Совпадений не найдено {0}',
        countSelectedText: 'Выбрано {0} из {1}',
        maxOptionsText: ['Достигнут предел ({n} {var} максимум)', 'Достигнут предел в группе ({n} {var} максимум)', ['items', 'item']],
        multipleSeparator: ', '
    };


    $(window).load(function () {

        var $observableLayouts = $('#admin-layouts .sg-observable');

        $('#reset-layout').on('click', resetCurrentLayout);
        $('#save-layout').on('click', checkForExistenceAndSave);

        // check all changes of observable form fileds
        $observableLayouts.on('change fileclear input', checkCurrentLayout);
        $('#upload-2d').on('fileloaded', function (e, file) {
            $('#designer-layout-name').val(file.name.replace(/\.[^/.]+$/, "")).change();
            $('body').css('cursor', 'wait');
            detectImportantColors(file);
            $('#colors-selector').parents('.form-group.sg-validable').removeClass('has-error');
            $('body').css('cursor', 'auto');
        });

        initiateUploaders();
        resetCurrentLayout();

        function resetCurrentLayout() {
            $observableLayouts.each(function (i, el) {
                $(el).parents('.form-group.sg-validable').addClass('has-error');
            });


            $('#upload-2d').fileinput('reset');

            $('#colors-selector').selectpicker('deselectAll');
            $('#plots-selector').selectpicker('deselectAll');
            $('#assortment-selector').selectpicker('deselectAll');
            $('#countries-selector').selectpicker('deselectAll');

            $('#designer-layout-name').val('');
            $('#designer-layout-comment').val('');
            layoutsMessage('Заполните поля формы', true);
            $('#reset-layout').addClass('disabled');
        }

        function checkForExistenceAndSave() {
            $.ajax({
                url: '/api/layouts/search/name/' + encodeURIComponent($('#designer-layout-name').val()),
                type: 'POST',
                success: function (data, textStatus, xhr) {
                    if (xhr.status === 204) {
                        saveCurrentLayout();
                    } else {
                        layoutsMessage('Шаблон с таким именем уже существует', true);
                    }
                },
                error: function (data, status) {
                    layoutsMessage('При сохранении возникли ошибки', true);
                }
            });
        }

        function saveCurrentLayout() {
            // set name of layout upload subdirectory
            var dir = moment().format('YYYY-MM-DD');

            // deferreds for upload 2d, upload 3d and layout files
            var $u2d = $('#upload-2d'),
                u2dDef = $.Deferred();

            var layoutData = {
                name: $('#designer-layout-name').val(),
                urlDir: dir,
                catColors: oblArray($('#colors-selector').val()),
                catPlots: oblArray($('#plots-selector').val()),
                catAssortment: oblArray($('#assortment-selector').val()),
                catCountries: oblArray($('#countries-selector').val()),
                designerComment: $('#designer-layout-comment').val()
            };

            layoutsMessage('Сохраняю макет');
            $('#save-layout').addClass('disabled');
            $u2d.fileinput('setPrependData', 'uploadDir', 'pictures/' + dir);
            $u2d.fileinput('upload').one('fileuploaded', l2dUploadedHandler);

            function l2dUploadedHandler(e, data) {
                layoutData.url2d = data.response.url2d;
                layoutData.urlThumb = data.response.urlThumb;
                $u2d.fileinput('clear');
                u2dDef.resolve();
            }

            $.when(u2dDef).done(function resolveUploads() {
                var errMsg;

                $.ajax({
                    url: '/api/layouts',
                    type: 'POST',
                    data: {
                        data: JSON.stringify(layoutData)
                    },
                    success: function (data) {
                        if (data === 'Created') {
                            layoutsMessage('Макет успешно сохранён');
                        } else {
                            layoutsMessage('Ошибка сохранения', true);
                        }
                    },
                    error: function () {
                        layoutsMessage('При сохранении возникли ошибки', true);
                    }
                });
            });

            function oblArray(obj) {
                if (Array.isArray(obj)) {
                    return obj;
                }
                else {
                    return [obj];
                }
            }

        }

        function checkCurrentLayout() {
            /*jshint validthis:true */
            var $this = $(this);

            $('#reset-layout').removeClass('disabled');

            if (!$this.val()) {
                $this.parents('.form-group.sg-validable').addClass('has-error');
            } else {
                $this.parents('.form-group.sg-validable').removeClass('has-error');
            }

            if ($('#colors-selector').val() &&
                $('#plots-selector').val() &&
                $('#assortment-selector').val() &&
                $('#upload-2d').val() &&
                $('#designer-layout-name').val()) {
                $('#save-layout').removeClass('disabled');
                layoutsMessage('Сохраните макет');
            } else {
                $('#save-layout').addClass('disabled');
                layoutsMessage('Заполните поля формы', true);
            }
        }

        function layoutsMessage(msg, error) {
            var sign = '<span class="glyphicon glyphicon-exclamation-sign" role="alert"></span> ',
                el = $('#layouts-info');

            el.html(sign + msg);
            if (error) {
                el.removeClass('alert-info');
                el.addClass('alert-danger');
            } else {
                el.addClass('alert-info');
                el.removeClass('alert-danger');
            }
        }

        function initiateUploaders() {
            $('#upload-2d').fileinput({
                showUpload: false,
                allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif'],
                uploadUrl: '/api/files/picture',
                dropZoneEnabled: false
            });
        }
    });

    function detectImportantColors(file) {
        if (!window.FileReader) {
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                getAverageColor(this);
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    function getAverageColor(imgEl) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            data, width, height, length,
            hs, hue,                                // temp hue-saturation array and hue value
            hueArray = [0, 0, 0, 0, 0, 0, 0, 0],    // zero filled array of seven colors
            avgSat = 0,                             // average saturation
            clrArr = [];

        if (!context) {
            return null;
        }

        width = canvas.width = imgEl.width;
        height = canvas.height = imgEl.height;

        context.drawImage(imgEl, 0, 0);
        data = context.getImageData(0, 0, width, height).data;

        length = data.length;
        for (var i = 0; i < length; i += 4) {
            hs = rgb2hsl([data[i], data[i + 1], data[i + 2]]);
            hue = hs[0];
            if (hue > 345 || hue < 12) {
                if (hs[2] <= 5 || hs[1] <= 5) {
                    hueArray[7] += 1;
                }                                               // blacks and grays
                else if (hs[2] > 15) {
                    hueArray[0] += 1;
                }                                               // reds
                else {
                    hueArray[6] += 1;
                }                                               // dark reds are brown
            }
            else if (hue >= 12 && hue < 40) {
                if (hs[2] <= 5 || hs[1] <= 5) {
                    hueArray[7] += 1;
                }                                               // shades of gray (all colors darker than 5)
                else if (hs[2] > 45) {
                    hueArray[1] += 1;
                }                                               // oranges
                else {
                    hueArray[6] += 1;
                }                                               // dark oranges are brown
            }
            else if (hue >= 40 && hue < 70) {
                if (hs[2] <= 7 || hs[1] <= 5) {
                    hueArray[7] += 1;
                }                                               // blacks and grays
                else if (hs[2] > 40) {
                    hueArray[2] += 1;
                }                                               // yellows
                else {
                    hueArray[3] += 1;
                }                                               // dark yellows seem green
            }
            else if (hue >= 70 && hue < 150) {
                if (hs[2] <= 5 || hs[1] <= 5) {
                    hueArray[7] += 1;
                }                                               // blacks
                else {
                    hueArray[3] += 1;
                }                                               // greens
            }
            else if (hue >= 150 && hue < 250) {
                hueArray[4] += 1;                               // blues
            }
            else {
                hueArray[5] += 1;
            }                                                   // violets
            avgSat += hs[1];                                    // sum of saturations
        }

        hueArray = hueArray.map(function (x) {
            return x / ( length / 4) * 100;
        });
        avgSat = avgSat / (length / 4);

        var cs = $('#colors-selector');

        if (avgSat < 10 || hueArray[7] > 80) {                  // b&w
            clrArr.push('black');
        }
        else if (hueArray[0] > 20 || hueArray[1] > 20 || hueArray[2] > 20 || hueArray[3] > 20 ||
            hueArray[4] > 20 || hueArray[5] > 20 || hueArray[6] > 20) {
            var blackPart = (100 - hueArray[7]) / 100;      // part of black in image
            if (hueArray[0] / blackPart > 20) {
                clrArr.push('red');
            }
            if (hueArray[1] / blackPart > 20) {
                clrArr.push('orange');
            }
            if (hueArray[2] / blackPart > 20) {
                clrArr.push('yellow');
            }
            if (hueArray[3] / blackPart > 20) {
                clrArr.push('green');
            }
            if (hueArray[4] / blackPart > 20) {
                clrArr.push('blue');
            }
            if (hueArray[5] / blackPart > 20) {
                clrArr.push('violet');
            }
            if (hueArray[6] / blackPart > 20) {
                clrArr.push('brown');
            }
        }
        else {
            clrArr.push('multicolor');
        }
        cs.selectpicker('val', clrArr).selectpicker('refresh');

    }

    function rgb2hsl(rgbArr) {
        var r1 = rgbArr[0] / 255;
        var g1 = rgbArr[1] / 255;
        var b1 = rgbArr[2] / 255;

        var maxColor = Math.max(r1, g1, b1);
        var minColor = Math.min(r1, g1, b1);
        //Calculate L:
        var L = (maxColor + minColor) / 2;
        var S = 0;
        var H = 0;
        if (maxColor !== minColor) {
            //Calculate S:
            if (L < 0.5) {
                S = (maxColor - minColor) / (maxColor + minColor);
            } else {
                S = (maxColor - minColor) / (2.0 - maxColor - minColor);
            }
            //Calculate H:
            if (r1 === maxColor) {
                H = (g1 - b1) / (maxColor - minColor);
            } else if (g1 === maxColor) {
                H = 2.0 + (b1 - r1) / (maxColor - minColor);
            } else {
                H = 4.0 + (r1 - g1) / (maxColor - minColor);
            }
        }

        L = L * 100;
        S = S * 100;
        H = H * 60;
        if (H < 0) {
            H += 360;
        }
        return [H, S, L];
    }

}(jQuery));
