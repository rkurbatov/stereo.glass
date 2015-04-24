(function($) {
    'use strict';

    $.fn.selectpicker.defaults = {
        noneSelectedText: 'Ничего не выбрано',
        noneResultsText: 'Совпадений не найдено {0}',
        countSelectedText: 'Выбрано {0} из {1}',
        maxOptionsText: ['Достигнут предел ({n} {var} максимум)', 'Достигнут предел в группе ({n} {var} максимум)', ['items', 'item']],
        multipleSeparator: ', '
    };


    $(window).load(function() {

        var $observableLayouts = $('#admin-layouts .sg-observable');

        $('#reset-layout').on('click', resetCurrentLayout);
        $('#save-layout').on('click', saveCurrentLayout);
        $observableLayouts.on('change fileclear input', checkCurrentLayout);

        resetCurrentLayout();

        function resetCurrentLayout() {
            $observableLayouts.each(function(i, el) {
                $(el).parents('.form-group.sg-validable').addClass('has-error');
            });


            $('#upload-2d').fileinput('reset');
            $('#upload-3d').fileinput('reset');
            $('#upload-layout').fileinput('reset');

            $('#colors-selector').selectpicker('deselectAll');
            $('#plots-selector').selectpicker('deselectAll');
            $('#assortment-selector').selectpicker('deselectAll');
            $('#countries-selector').selectpicker('deselectAll')
                .selectpicker('val', 'international')
                .selectpicker('refresh')
                .parents('.form-group.sg-validable').removeClass('has-error');

            $('#designer-layout-name').val('');
            $('#designer-layout-comment').val('');
            layoutsMessage('Заполните поля формы', true);
            $('#reset-layout').addClass('disabled');
        }

        function saveCurrentLayout() {
            layoutsMessage('Сохраняю макет');
            $('#save-layout').addClass('disabled');
            $('#upload-2d').fileinput('upload').one('fileuploaded', l2dUploadedHandler);

            var layoutData = {};

            function l2dUploadedHandler(e, data) {
                layoutData = {
                    name: $('#designer-layout-name').val(),
                    urlDir: data.response.dir,
                    url2d: data.response.filename,
                    url3d: '',
                    urlLayout: '',
                    createdBy: '',
                    catColors: oblArray($('#colors-selector').val()),
                    catPlots: oblArray($('#plots-selector').val()),
                    catAssortment: oblArray($('#assortment-selector').val()),
                    catCountries: oblArray($('#countries-selector').val()),
                    designerComment: $('#designer-layout-comment').val()
                };

                $.ajax({
                    url: '/api/layout',
                    type: 'POST',
                    data: {
                        data: JSON.stringify(layoutData)
                    },
                    success: function(data) {
                        layoutsMessage('Макет успешно сохранён');
                    },
                    error: function(data) {
                        layoutsMessage('При сохранении возникли ошибки', true);
                    }
                });
            }

            function oblArray(obj) {
                if (Array.isArray(obj)) return obj;
                else return [obj];
            }

        }

        function checkCurrentLayout() {
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
                $('#countries-selector').val() &&
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

    });
}(jQuery));
