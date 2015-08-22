'use strict';

// Portals controller
angular.module('portals').controller('PortalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Portals',
	function($scope, $stateParams, $location, Authentication, Portals) {
		$scope.authentication = Authentication;

		// Create new Portal
		$scope.create = function() {
			debugger;
			// Create new Portal object
			var portal = new Object ({
				name: this.name,
				site : this.site
			});
			console.log(portal);
			// Redirect after save
			portal.$save(function(response) {
				$location.path('portals/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.site = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Portal
		$scope.remove = function(portal) {
			if ( portal ) { 
				portal.$remove();

				for (var i in $scope.portals) {
					if ($scope.portals [i] === portal) {
						$scope.portals.splice(i, 1);
					}
				}
			} else {
				$scope.portal.$remove(function() {
					$location.path('portals');
				});
			}
		};

		// Update existing Portal
		$scope.update = function() {
			var portal = $scope.portal;
			console.log("update" + portal);
			portal.$update(function() {
				$location.path('portals/' + portal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Portals
		$scope.find = function() {
			$scope.portals = Portals.query();
		};

		// Find existing Portal
		$scope.findOne = function() {
			$scope.portal = Portals.get({ 
				portalId: $stateParams.portalId
			});
		};
	}
]);