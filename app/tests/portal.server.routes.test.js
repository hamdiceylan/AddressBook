'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Portal = mongoose.model('Portal'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portal;

/**
 * Portal routes tests
 */
describe('Portal CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Portal
		user.save(function() {
			portal = {
				name: 'Portal Name',
				website : 'Site Name'
			};

			done();
		});
	});

	it('should be able to save Portal instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portal
				agent.post('/portals')
					.send(portal)
					.expect(200)
					.end(function(portalSaveErr, portalSaveRes) {
						// Handle Portal save error
						if (portalSaveErr) done(portalSaveErr);

						// Get a list of Portals
						agent.get('/portals')
							.end(function(portalsGetErr, portalsGetRes) {
								// Handle Portal save error
								if (portalsGetErr) done(portalsGetErr);

								// Get Portals list
								var portals = portalsGetRes.body;

								// Set assertions
								(portals[0].user._id).should.equal(userId);
								(portals[0].name).should.match('Portal Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portal instance if not logged in', function(done) {
		agent.post('/portals')
			.send(portal)
			.expect(401)
			.end(function(portalSaveErr, portalSaveRes) {
				// Call the assertion callback
				done(portalSaveErr);
			});
	});

	it('should not be able to save Portal instance if no name is provided', function(done) {
		// Invalidate name field
		portal.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portal
				agent.post('/portals')
					.send(portal)
					.expect(400)
					.end(function(portalSaveErr, portalSaveRes) {
						// Set message assertion
						(portalSaveRes.body.message).should.match('Please fill Portal name');
						
						// Handle Portal save error
						done(portalSaveErr);
					});
			});
	});

	it('should be able to update Portal instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portal
				agent.post('/portals')
					.send(portal)
					.expect(200)
					.end(function(portalSaveErr, portalSaveRes) {
						// Handle Portal save error
						if (portalSaveErr) done(portalSaveErr);

						// Update Portal name
						portal.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portal
						agent.put('/portals/' + portalSaveRes.body._id)
							.send(portal)
							.expect(200)
							.end(function(portalUpdateErr, portalUpdateRes) {
								// Handle Portal update error
								if (portalUpdateErr) done(portalUpdateErr);

								// Set assertions
								(portalUpdateRes.body._id).should.equal(portalSaveRes.body._id);
								(portalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portals if not signed in', function(done) {
		// Create new Portal model instance
		var portalObj = new Portal(portal);

		// Save the Portal
		portalObj.save(function() {
			// Request Portals
			request(app).get('/portals')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portal if not signed in', function(done) {
		// Create new Portal model instance
		var portalObj = new Portal(portal);

		// Save the Portal
		portalObj.save(function() {
			request(app).get('/portals/' + portalObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portal.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portal instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portal
				agent.post('/portals')
					.send(portal)
					.expect(200)
					.end(function(portalSaveErr, portalSaveRes) {
						// Handle Portal save error
						if (portalSaveErr) done(portalSaveErr);

						// Delete existing Portal
						agent.delete('/portals/' + portalSaveRes.body._id)
							.send(portal)
							.expect(200)
							.end(function(portalDeleteErr, portalDeleteRes) {
								// Handle Portal error error
								if (portalDeleteErr) done(portalDeleteErr);

								// Set assertions
								(portalDeleteRes.body._id).should.equal(portalSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portal instance if not signed in', function(done) {
		// Set Portal user 
		portal.user = user;

		// Create new Portal model instance
		var portalObj = new Portal(portal);

		// Save the Portal
		portalObj.save(function() {
			// Try deleting Portal
			request(app).delete('/portals/' + portalObj._id)
			.expect(401)
			.end(function(portalDeleteErr, portalDeleteRes) {
				// Set message assertion
				(portalDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portal error error
				done(portalDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Portal.remove().exec();
		done();
	});
});