;(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgFileUpload', sgFileUpload);

    sgFileUpload.$inject = ['Upload', 'sgLayouts'];

    function sgFileUpload(Upload, sgLayouts) {

        return {
            restrict: 'E',
            scope: {
                layout: '='
            },
            templateUrl: '/templates/directive/sgFileUpload',
            link: link
        };

        function link(scope, elm, attrs) {

            scope.accept = attrs.accept;
            scope.$watch('file', loadFileHandler);

            function loadFileHandler(newVal) {
                if (newVal) {
                    Upload.upload({
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
                        /** @namespace attrs.field */
                        if (attrs.field && result && result.data && result.data.filenames
                            && result.data.filenames.length > 0) {
                            var setObject = {};
                            setObject[attrs.field] = result.data.filenames[0];
                            sgLayouts.update(scope.layout._id, setObject)
                                .then(function(){
                                    scope.layout[attrs.field] = result.data.filenames[0];
                                });
                        }
                    });
                }
            }
        }
    }
})(window, window.angular);