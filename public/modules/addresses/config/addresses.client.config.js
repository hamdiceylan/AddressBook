'use strict';

// Configuring the Articles module
angular.module('addresses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Addresses', 'addresses', 'dropdown', '/addresses(/create)?');
		Menus.addSubMenuItem('topbar', 'addresses', 'List Addresses', 'addresses');
		Menus.addSubMenuItem('topbar', 'addresses', 'New Address', 'addresses/create');
	}
]);