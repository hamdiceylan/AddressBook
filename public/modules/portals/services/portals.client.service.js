'use strict';

//Portals service used to communicate Portals REST endpoints
angular.module('portals').factory('Portals', ['$resource',
	function($resource) {
		return $resource('portals/:portalId', { portalId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);