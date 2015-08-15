'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Addresstype = mongoose.model('Addresstype'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, addresstype;

/**
 * Addresstype routes tests
 */
describe('Addresstype CRUD tests', function() {
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

		// Save a user to the test db and create new Addresstype
		user.save(function() {
			addresstype = {
				name: 'Addresstype Name'
			};

			done();
		});
	});

	it('should be able to save Addresstype instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Addresstype
				agent.post('/addresstypes')
					.send(addresstype)
					.expect(200)
					.end(function(addresstypeSaveErr, addresstypeSaveRes) {
						// Handle Addresstype save error
						if (addresstypeSaveErr) done(addresstypeSaveErr);

						// Get a list of Addresstypes
						agent.get('/addresstypes')
							.end(function(addresstypesGetErr, addresstypesGetRes) {
								// Handle Addresstype save error
								if (addresstypesGetErr) done(addresstypesGetErr);

								// Get Addresstypes list
								var addresstypes = addresstypesGetRes.body;

								// Set assertions
								(addresstypes[0].user._id).should.equal(userId);
								(addresstypes[0].name).should.match('Addresstype Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Addresstype instance if not logged in', function(done) {
		agent.post('/addresstypes')
			.send(addresstype)
			.expect(401)
			.end(function(addresstypeSaveErr, addresstypeSaveRes) {
				// Call the assertion callback
				done(addresstypeSaveErr);
			});
	});

	it('should not be able to save Addresstype instance if no name is provided', function(done) {
		// Invalidate name field
		addresstype.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Addresstype
				agent.post('/addresstypes')
					.send(addresstype)
					.expect(400)
					.end(function(addresstypeSaveErr, addresstypeSaveRes) {
						// Set message assertion
						(addresstypeSaveRes.body.message).should.match('Please fill Addresstype name');
						
						// Handle Addresstype save error
						done(addresstypeSaveErr);
					});
			});
	});

	it('should be able to update Addresstype instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Addresstype
				agent.post('/addresstypes')
					.send(addresstype)
					.expect(200)
					.end(function(addresstypeSaveErr, addresstypeSaveRes) {
						// Handle Addresstype save error
						if (addresstypeSaveErr) done(addresstypeSaveErr);

						// Update Addresstype name
						addresstype.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Addresstype
						agent.put('/addresstypes/' + addresstypeSaveRes.body._id)
							.send(addresstype)
							.expect(200)
							.end(function(addresstypeUpdateErr, addresstypeUpdateRes) {
								// Handle Addresstype update error
								if (addresstypeUpdateErr) done(addresstypeUpdateErr);

								// Set assertions
								(addresstypeUpdateRes.body._id).should.equal(addresstypeSaveRes.body._id);
								(addresstypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Addresstypes if not signed in', function(done) {
		// Create new Addresstype model instance
		var addresstypeObj = new Addresstype(addresstype);

		// Save the Addresstype
		addresstypeObj.save(function() {
			// Request Addresstypes
			request(app).get('/addresstypes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Addresstype if not signed in', function(done) {
		// Create new Addresstype model instance
		var addresstypeObj = new Addresstype(addresstype);

		// Save the Addresstype
		addresstypeObj.save(function() {
			request(app).get('/addresstypes/' + addresstypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', addresstype.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Addresstype instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Addresstype
				agent.post('/addresstypes')
					.send(addresstype)
					.expect(200)
					.end(function(addresstypeSaveErr, addresstypeSaveRes) {
						// Handle Addresstype save error
						if (addresstypeSaveErr) done(addresstypeSaveErr);

						// Delete existing Addresstype
						agent.delete('/addresstypes/' + addresstypeSaveRes.body._id)
							.send(addresstype)
							.expect(200)
							.end(function(addresstypeDeleteErr, addresstypeDeleteRes) {
								// Handle Addresstype error error
								if (addresstypeDeleteErr) done(addresstypeDeleteErr);

								// Set assertions
								(addresstypeDeleteRes.body._id).should.equal(addresstypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Addresstype instance if not signed in', function(done) {
		// Set Addresstype user 
		addresstype.user = user;

		// Create new Addresstype model instance
		var addresstypeObj = new Addresstype(addresstype);

		// Save the Addresstype
		addresstypeObj.save(function() {
			// Try deleting Addresstype
			request(app).delete('/addresstypes/' + addresstypeObj._id)
			.expect(401)
			.end(function(addresstypeDeleteErr, addresstypeDeleteRes) {
				// Set message assertion
				(addresstypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Addresstype error error
				done(addresstypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Addresstype.remove().exec();
		done();
	});
});