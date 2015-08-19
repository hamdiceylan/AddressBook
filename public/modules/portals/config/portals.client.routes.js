'use strict';

//Setting up route
angular.module('portals').config(['$stateProvider',
	function($stateProvider) {
		// Portals state routing
		$stateProvider.
		state('listPortals', {
			url: '/portals',
			templateUrl: 'modules/portals/views/list-portals.client.view.html'
		}).
		state('createPortal', {
			url: '/portals/create',
			templateUrl: 'modules/portals/views/create-portal.client.view.html'
		}).
		state('viewPortal', {
			url: '/portals/:portalId',
			templateUrl: 'modules/portals/views/view-portal.client.view.html'
		}).
		state('editPortal', {
			url: '/portals/:portalId/edit',
			templateUrl: 'modules/portals/views/edit-portal.client.view.html'
		});
	}
]);