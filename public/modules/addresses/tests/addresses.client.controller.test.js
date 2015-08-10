'use strict';

(function() {
	// Addresses Controller Spec
	describe('Addresses Controller Tests', function() {
		// Initialize global variables
		var AddressesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Addresses controller.
			AddressesController = $controller('AddressesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Address object fetched from XHR', inject(function(Addresses) {
			// Create sample Address using the Addresses service
			var sampleAddress = new Addresses({
				name: 'New Address'
			});

			// Create a sample Addresses array that includes the new Address
			var sampleAddresses = [sampleAddress];

			// Set GET response
			$httpBackend.expectGET('addresses').respond(sampleAddresses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.addresses).toEqualData(sampleAddresses);
		}));

		it('$scope.findOne() should create an array with one Address object fetched from XHR using a addressId URL parameter', inject(function(Addresses) {
			// Define a sample Address object
			var sampleAddress = new Addresses({
				name: 'New Address'
			});

			// Set the URL parameter
			$stateParams.addressId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/addresses\/([0-9a-fA-F]{24})$/).respond(sampleAddress);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.address).toEqualData(sampleAddress);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Addresses) {
			// Create a sample Address object
			var sampleAddressPostData = new Addresses({
				name: 'New Address'
			});

			// Create a sample Address response
			var sampleAddressResponse = new Addresses({
				_id: '525cf20451979dea2c000001',
				name: 'New Address'
			});

			// Fixture mock form input values
			scope.name = 'New Address';

			// Set POST response
			$httpBackend.expectPOST('addresses', sampleAddressPostData).respond(sampleAddressResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Address was created
			expect($location.path()).toBe('/addresses/' + sampleAddressResponse._id);
		}));

		it('$scope.update() should update a valid Address', inject(function(Addresses) {
			// Define a sample Address put data
			var sampleAddressPutData = new Addresses({
				_id: '525cf20451979dea2c000001',
				name: 'New Address'
			});

			// Mock Address in scope
			scope.address = sampleAddressPutData;

			// Set PUT response
			$httpBackend.expectPUT(/addresses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/addresses/' + sampleAddressPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid addressId and remove the Address from the scope', inject(function(Addresses) {
			// Create new Address object
			var sampleAddress = new Addresses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Addresses array and include the Address
			scope.addresses = [sampleAddress];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/addresses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAddress);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.addresses.length).toBe(0);
		}));
	});
}());