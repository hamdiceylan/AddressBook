'use strict';

// Configuring the Articles module
angular.module('portals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Portals', 'portals', 'dropdown', '/portals(/create)?');
		Menus.addSubMenuItem('topbar', 'portals', 'List Portals', 'portals');
		Menus.addSubMenuItem('topbar', 'portals', 'New Portal', 'portals/create');
	}
]);