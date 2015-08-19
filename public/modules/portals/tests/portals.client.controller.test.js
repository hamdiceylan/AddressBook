'use strict';

(function() {
	// Portals Controller Spec
	describe('Portals Controller Tests', function() {
		// Initialize global variables
		var PortalsController,
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

			// Initialize the Portals controller.
			PortalsController = $controller('PortalsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portal object fetched from XHR', inject(function(Portals) {
			// Create sample Portal using the Portals service
			var samplePortal = new Portals({
				name: 'New Portal'
			});

			// Create a sample Portals array that includes the new Portal
			var samplePortals = [samplePortal];

			// Set GET response
			$httpBackend.expectGET('portals').respond(samplePortals);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portals).toEqualData(samplePortals);
		}));

		it('$scope.findOne() should create an array with one Portal object fetched from XHR using a portalId URL parameter', inject(function(Portals) {
			// Define a sample Portal object
			var samplePortal = new Portals({
				name: 'New Portal'
			});

			// Set the URL parameter
			$stateParams.portalId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portals\/([0-9a-fA-F]{24})$/).respond(samplePortal);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portal).toEqualData(samplePortal);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Portals) {
			// Create a sample Portal object
			var samplePortalPostData = new Portals({
				name: 'New Portal'
			});

			// Create a sample Portal response
			var samplePortalResponse = new Portals({
				_id: '525cf20451979dea2c000001',
				name: 'New Portal'
			});

			// Fixture mock form input values
			scope.name = 'New Portal';

			// Set POST response
			$httpBackend.expectPOST('portals', samplePortalPostData).respond(samplePortalResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portal was created
			expect($location.path()).toBe('/portals/' + samplePortalResponse._id);
		}));

		it('$scope.update() should update a valid Portal', inject(function(Portals) {
			// Define a sample Portal put data
			var samplePortalPutData = new Portals({
				_id: '525cf20451979dea2c000001',
				name: 'New Portal'
			});

			// Mock Portal in scope
			scope.portal = samplePortalPutData;

			// Set PUT response
			$httpBackend.expectPUT(/portals\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portals/' + samplePortalPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portalId and remove the Portal from the scope', inject(function(Portals) {
			// Create new Portal object
			var samplePortal = new Portals({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portals array and include the Portal
			scope.portals = [samplePortal];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portals\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortal);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portals.length).toBe(0);
		}));
	});
}());