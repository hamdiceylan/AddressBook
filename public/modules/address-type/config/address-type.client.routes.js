'use strict';

//Setting up route
angular.module('address-type').config(['$stateProvider',
	function($stateProvider) {
		// Address type state routing
		$stateProvider.
		state('address-type', {
			url: '/address-type',
			templateUrl: 'modules/address-type/views/address-type.client.view.html'
		});
	}
]);