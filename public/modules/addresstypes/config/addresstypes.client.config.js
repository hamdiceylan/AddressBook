'use strict';

// Configuring the Articles module
angular.module('addresstypes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Addresstypes', 'addresstypes', 'dropdown', '/addresstypes(/create)?');
		Menus.addSubMenuItem('topbar', 'addresstypes', 'List Addresstypes', 'addresstypes');
		Menus.addSubMenuItem('topbar', 'addresstypes', 'New Addresstype', 'addresstypes/create');
	}
]);