(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgFileUpload', sgFileUpload);

    sgFileUpload.$inject = ['$httpParamSerializer', 'Upload', 'toastr'];

    function sgFileUpload($httpParamSerializer, Upload, toastr) {

        return {
            restrict: 'E',
            scope: {
                layout: '=',        // layout to work with
                process: '@'        // file processing during upload
            },
            templateUrl: '/templates/directive/sgFileUpload',
            link
        };

        function link(scope, elm, attrs) {
            var queryString = $httpParamSerializer({
                accept: attrs.accept,
                field: attrs.field,
                process: attrs.process
            });

            scope.accept = attrs.accept;
            scope.$watch('file', loadFileHandler);

            function loadFileHandler(file) {
                if (file) {
                    // checking if file type corresponds to given
                    if (file.length && attrs.accept) {
                        var ext = file[0].name.substr((~-file[0].name.lastIndexOf(".") >>> 0) + 2);
                        if (!_.contains(attrs.accept, ext) || !ext) {
                            scope.barType = 'danger';
                            toastr.error('Данный тип файла не поддерживается!');
                            return;
                        }
                    }

                    let url = `/api/files/layout/${_.padLeft(scope.layout.reference, 5, "0")}?${queryString}`;
                    scope.barType = 'success';

                    Upload
                        .upload({
                            url,
                            file: scope.file
                        })
                        .progress((evt)=> {
                            scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                        })
                        .then((result)=> {
                            toastr.success('Файл загружен');
                        })
                        .catch((err)=> {
                            scope.barType = 'danger';
                            toastr.error('Ошибка при загрузке файла: ', err.data.message);
                        });
                }
            }
        }
    }
})(window, window.angular);