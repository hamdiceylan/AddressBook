'use strict';

//Addresses service used to communicate Addresses REST endpoints
angular.module('addresses').factory('Addresses', ['$resource',
	function($resource) {
		return $resource('addresses/:addressId', { addressId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);