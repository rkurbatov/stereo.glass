(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgFileUpload', sgFileUpload);

    sgFileUpload.$inject = ['Upload', 'sgLayouts'];

    function sgFileUpload(Upload, sgLayouts) {

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
                    let url = '/api/files';

                    if (scope.process === 'firstframe') {
                        url += `/${scope.process}`;
                    }

                    Upload
                        .upload({
                            url,
                            fields: {
                                uploadDir: (scope.layout.status
                                    ? 'ready/'
                                    : 'pictures/') + scope.layout.urlDir
                            },
                            file: scope.file
                        })
                        .progress((evt)=> {
                            scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                        })
                        .then((result)=> {
                            console.log('file uploaded: ', result);
                            /** @namespace attrs.field */
                            if (attrs.field && result && result.data && result.data.filenames
                                && result.data.filenames.length > 0) {
                                var setObject = {};
                                fileName = result.data.filenames[0];
                                setObject[attrs.field] = fileName;
                                return sgLayouts.update(scope.layout._id, setObject);
                            } else {
                                return null;
                            }
                        })
                        .then((result)=>{
                            if (attrs.field && result && fileName) {
                                scope.layout[attrs.field] = fileName;
                            }
                        });
                }
            }
        }
    }
})(window, window.angular);