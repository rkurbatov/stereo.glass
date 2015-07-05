(function (){
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgUserControls', sgUserControls);

    sgUserControls.$inject = ['$modal'];

    function sgUserControls($modal) {
    	var vm = this;
    	vm.modalEditUser = modalEditUser;

    	function modalEditUser(user) {
    		var modalDO = {
    			templateUrl: '/partials/modal-EditUser',
                controller: ['$modalInstance', 'user', editUserCtrl],
                controllerAs: 'vm',
                resolve: {
                    user: function () {
                        return user
                    }
                },
                size: 'sm'
            }
            
            return $modal.open(modalDO).result;  
    	}

    	function editUserCtrl($modalInstance, user) {
    		var vm = this;
    		vm.user = user;
    		vm.roles = ['user', 'designer', 'founder', 'admin'];

    		vm.ok = function() {
                if (vm.newPassword) {
                    vm.user.password = vm.newPassword;
                }    
    			$modalInstance.close(vm.user);
    		}

    		vm.cancel = function() {
    			$modalInstance.dismiss('cancel');
    		}
    	}

    }

})();