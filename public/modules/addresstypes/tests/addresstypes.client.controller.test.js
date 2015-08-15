'use strict';

(function() {
	// Addresstypes Controller Spec
	describe('Addresstypes Controller Tests', function() {
		// Initialize global variables
		var AddresstypesController,
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

			// Initialize the Addresstypes controller.
			AddresstypesController = $controller('AddresstypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Addresstype object fetched from XHR', inject(function(Addresstypes) {
			// Create sample Addresstype using the Addresstypes service
			var sampleAddresstype = new Addresstypes({
				name: 'New Addresstype'
			});

			// Create a sample Addresstypes array that includes the new Addresstype
			var sampleAddresstypes = [sampleAddresstype];

			// Set GET response
			$httpBackend.expectGET('addresstypes').respond(sampleAddresstypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.addresstypes).toEqualData(sampleAddresstypes);
		}));

		it('$scope.findOne() should create an array with one Addresstype object fetched from XHR using a addresstypeId URL parameter', inject(function(Addresstypes) {
			// Define a sample Addresstype object
			var sampleAddresstype = new Addresstypes({
				name: 'New Addresstype'
			});

			// Set the URL parameter
			$stateParams.addresstypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/addresstypes\/([0-9a-fA-F]{24})$/).respond(sampleAddresstype);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.addresstype).toEqualData(sampleAddresstype);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Addresstypes) {
			// Create a sample Addresstype object
			var sampleAddresstypePostData = new Addresstypes({
				name: 'New Addresstype'
			});

			// Create a sample Addresstype response
			var sampleAddresstypeResponse = new Addresstypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Addresstype'
			});

			// Fixture mock form input values
			scope.name = 'New Addresstype';

			// Set POST response
			$httpBackend.expectPOST('addresstypes', sampleAddresstypePostData).respond(sampleAddresstypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Addresstype was created
			expect($location.path()).toBe('/addresstypes/' + sampleAddresstypeResponse._id);
		}));

		it('$scope.update() should update a valid Addresstype', inject(function(Addresstypes) {
			// Define a sample Addresstype put data
			var sampleAddresstypePutData = new Addresstypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Addresstype'
			});

			// Mock Addresstype in scope
			scope.addresstype = sampleAddresstypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/addresstypes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/addresstypes/' + sampleAddresstypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid addresstypeId and remove the Addresstype from the scope', inject(function(Addresstypes) {
			// Create new Addresstype object
			var sampleAddresstype = new Addresstypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Addresstypes array and include the Addresstype
			scope.addresstypes = [sampleAddresstype];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/addresstypes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAddresstype);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.addresstypes.length).toBe(0);
		}));
	});
}());