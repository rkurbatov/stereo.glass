(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('ContactsPage', ContactsPage);

    ContactsPage.$inject = ['uiGmapGoogleMapApi', '$modal', 'sgIntSvc'];

    function ContactsPage(uiGmapGoogleMapApi, $modal, sgIntSvc) {
        var vm = this;

        _.extend(vm, {
            openMap,
            check
        });

        vm.latvia = {
            map: {
                markId: 'RigaOffice', zoom: 18,
                center: {latitude: 55.692384, longitude: 21.1515192},
            },
            isOpen: true, title: ''
        };

        vm.ukraine = {
            map: {
                markId: 'DneprOffice', zoom: 18,
                center: {latitude: 48.4553585, longitude: 35.043647}
            },
            isOpen: true, title: ''
        };

        vm.russia = {
            isOpen: true, title: ''
        };

        vm.china = {
            isOpen: true, title: ''
        };

        initController();

        // IMPLEMENTATION

        function initController() {
            uiGmapGoogleMapApi
                .then((maps)=> {

                });
        }

        function check(office) {
            // return function as a handler
            return function (time) {
                var day = time.day();
                var hour = time.hour();

                // set day of week
                vm[office].dow = time.locale(sgIntSvc.currentLang).format('ddd');
                vm[office].date = time.locale(sgIntSvc.currentLang).format('DD MMM YYYY');

                // check for working day
                if (!(vm[office].isOpen = day > 0 && day < 6)) {
                    vm[office].title = _INT("К сожалению сегодня - выходной день. Попробуйте позвонить к нам в понедельник или отправить запрос по электронной почте.");
                    return;
                }

                if (!(vm[office].isOpen = hour >= 9 && hour <= 17)) {
                    if (hour > 17) {
                        vm[office].title = _INT("Рабочий день завершён и мы не cможем принять ваш звонок. Отправьте свой запрос письмом по электронной почте.");
                    } else if (hour < 9) {
                        vm[office].title = _INT("Рабочий день еще не начался и мы не сможем принять ваш звонок. Позвоните попозже или отправьте свой запрос письмом по электронной почте.");
                    }
                    return;
                }

                vm[office].title = _INT("Мы готовы принять ваш звонок!");
            }
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
