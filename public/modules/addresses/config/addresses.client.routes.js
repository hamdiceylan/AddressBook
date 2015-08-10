'use strict';

//Setting up route
angular.module('addresses').config(['$stateProvider',
	function($stateProvider) {
		// Addresses state routing
		$stateProvider.
		state('listAddresses', {
			url: '/addresses',
			templateUrl: 'modules/addresses/views/list-addresses.client.view.html'
		}).
		state('createAddress', {
			url: '/addresses/create',
			templateUrl: 'modules/addresses/views/create-address.client.view.html'
		}).
		state('viewAddress', {
			url: '/addresses/:addressId',
			templateUrl: 'modules/addresses/views/view-address.client.view.html'
		}).
		state('editAddress', {
			url: '/addresses/:addressId/edit',
			templateUrl: 'modules/addresses/views/edit-address.client.view.html'
		});
	}
]);