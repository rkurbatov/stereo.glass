(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('ContactsPage', ContactsPage);

    ContactsPage.$inject = ['uiGmapGoogleMapApi', '$modal'];

    function ContactsPage(uiGmapGoogleMapApi, $modal) {
        var vm = this;
        vm.openMap = openMap;

        vm.latviaMap = {
            markId: 'RigaOffice',
            center: {
                latitude: 55.692384,
                longitude: 21.1515192
            },
            zoom: 18
        };

        vm.ukraineMap = {
            markId: 'DneprOffice',
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
                templateUrl: '/templates/modal/openMap'
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
