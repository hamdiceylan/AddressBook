'use strict';

// Addresstypes controller
angular.module('addresstypes').controller('AddresstypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Addresstypes',
	function($scope, $stateParams, $location, Authentication, Addresstypes) {
		$scope.authentication = Authentication;

		// Create new Addresstype
		$scope.create = function() {
			// Create new Addresstype object
			var addresstype = new Addresstypes ({
				name: this.name
			});

			// Redirect after save
			addresstype.$save(function(response) {
				$location.path('addresstypes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Addresstype
		$scope.remove = function(addresstype) {
			if ( addresstype ) { 
				addresstype.$remove();

				for (var i in $scope.addresstypes) {
					if ($scope.addresstypes [i] === addresstype) {
						$scope.addresstypes.splice(i, 1);
					}
				}
			} else {
				$scope.addresstype.$remove(function() {
					$location.path('addresstypes');
				});
			}
		};

		// Update existing Addresstype
		$scope.update = function() {
			var addresstype = $scope.addresstype;

			addresstype.$update(function() {
				$location.path('addresstypes/' + addresstype._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Addresstypes
		$scope.find = function() {
			$scope.addresstypes = Addresstypes.query();
		};

		// Find existing Addresstype
		$scope.findOne = function() {
			$scope.addresstype = Addresstypes.get({ 
				addresstypeId: $stateParams.addresstypeId
			});
		};
	}
]);