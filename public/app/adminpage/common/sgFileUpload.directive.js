(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgFileUpload', sgFileUpload);

    sgFileUpload.$inject = ['Upload', 'toastr'];

    function sgFileUpload(Upload, toastr) {

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

            scope.accept = attrs.accept;
            scope.$watch('file', loadFileHandler);

            function loadFileHandler(newVal) {
                if (newVal) {
                    let fileName;
                    let url = '/api/files/layout/';
                    url += _.padLeft(scope.layout.reference, 5, "0");
                    url += '?field=' + attrs.field;
                    if (attrs.process) {
                        url += '&process=' + attrs.process;
                    }
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
                            console.log(err);
                            scope.barType = 'danger';
                            toastr.error('Ошибка при загрузке файла: ', err);
                        });
                }
            }
        }
    }
})(window, window.angular);