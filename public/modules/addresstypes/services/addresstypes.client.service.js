'use strict';

//Addresstypes service used to communicate Addresstypes REST endpoints
angular.module('addresstypes').factory('Addresstypes', ['$resource',
	function($resource) {
		return $resource('addresstypes/:addresstypeId', { addresstypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);