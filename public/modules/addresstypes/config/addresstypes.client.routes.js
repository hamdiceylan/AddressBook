'use strict';

//Setting up route
angular.module('addresstypes').config(['$stateProvider',
	function($stateProvider) {
		// Addresstypes state routing
		$stateProvider.
		state('listAddresstypes', {
			url: '/addresstypes',
			templateUrl: 'modules/addresstypes/views/list-addresstypes.client.view.html'
		}).
		state('createAddresstype', {
			url: '/addresstypes/create',
			templateUrl: 'modules/addresstypes/views/create-addresstype.client.view.html'
		}).
		state('viewAddresstype', {
			url: '/addresstypes/:addresstypeId',
			templateUrl: 'modules/addresstypes/views/view-addresstype.client.view.html'
		}).
		state('editAddresstype', {
			url: '/addresstypes/:addresstypeId/edit',
			templateUrl: 'modules/addresstypes/views/edit-addresstype.client.view.html'
		});
	}
]);