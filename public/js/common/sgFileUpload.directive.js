(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgFileUpload', sgFileUpload);

    sgFileUpload.$inject = ['Upload'];

    function sgFileUpload(Upload) {
        var ddo = {
            restrict: 'E',
            scope: {
                layout: '='
            },
            templateUrl: '/partials/directive-sgFileUpload',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {

            scope.accept = attrs.accept;

            scope.$watch('file', loadFileHandler);

            function loadFileHandler(newVal) {
                if (newVal) {
                    var upload = Upload.upload({
                        url: '/api/files',
                        fields: {
                            uploadDir: (scope.layout.status
                                ? 'ready/'
                                : 'pictures/') + scope.layout.urlDir
                        },
                        file: scope.file
                    }).progress(function (evt) {
                        scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                    }).then(function (result) {
                        console.log('result ', result);
                        scope.ready = true;
                    });
                }
            }
        }
    }
})();