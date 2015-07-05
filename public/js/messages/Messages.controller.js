(function(){
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Messages', Messages);

    Messages.$inject = ['sgMessages', 'sgUsers'];

    function Messages(sgMessages, sgUsers){

    	var vm = this;
    	vm.refresh = refresh;

    	initController();

    	function initController() {
    		refresh();
    	}

    	function refresh() {
    		sgMessages.getList(sgUsers.currentUser.name, ['admin'])
    			.then(function(messages){

    			});
    	}

    }

})();