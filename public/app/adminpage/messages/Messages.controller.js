(function(){
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Messages', Messages);

    Messages.$inject = ['sgMessages', 'sgUsers'];

    function Messages(sgMessages, sgUsers){

    	var vm = this;
    	vm.refreshList = refreshList;

    	initController();

    	function initController() {
    		vm.refreshList();
    	}

    	function refreshList() {
    		sgMessages.getList(sgUsers.currentUser.name, ['admin'])
    			.then(function(messages){
                    vm.list = messages;
    			});
    	}

    }

})();