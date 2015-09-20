(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('ContactsPage', ContactsPage);

    ContactsPage.$inject = ['uiGmapGoogleMapApi', '$modal'];

    function ContactsPage(uiGmapGoogleMapApi, $modal) {
        var vm = this;
        vm.openMap = openMap;
        vm.ukraineMap = {
            center: {
                latitude: 48.4553585,
                longitude: 35.043647
            },
            zoom: 18
        };

        initController();

        // IMPLEMENTATION

        function initController() {
            uiGmapGoogleMapApi
                .then((maps)=> {

                });
        }

        function openMap(map) {
            var ddo = {
                controller: MapCtrl,
                controllerAs: 'modal',
                resolve: {
                    map: ()=> {
                        return map;
                    }
                },
                size: 'lg',
                template: `
                <div class="modal-header">
                    <button class="close" aria-hidden="true" ng-click="modal.close()"><i class="fa fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <ui-gmap-google-map center='modal.map.center' zoom='modal.map.zoom'></ui-gmap-google-map>
                    <ui-gmap-marker idKey="UkraineOffice" coords="modal.map.center"></ui-gmap-marker>
                </div>
                `
            };

            $modal.open(ddo);

            MapCtrl.$inject = ['$modalInstance', 'map'];

            function MapCtrl($modalInstance, map) {
                var modal = this;
                modal.map = map;
                modal.close = function () {
                    $modalInstance.close();
                }
            }
        }

    }

})(window, window.angular);
