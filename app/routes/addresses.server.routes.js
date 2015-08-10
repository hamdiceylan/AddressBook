'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var addresses = require('../../app/controllers/addresses.server.controller');

	// Addresses Routes
	app.route('/addresses')
		.get(addresses.list)
		.post(users.requiresLogin, addresses.create);

	app.route('/addresses/:addressId')
		.get(addresses.read)
		.put(users.requiresLogin, addresses.hasAuthorization, addresses.update)
		.delete(users.requiresLogin, addresses.hasAuthorization, addresses.delete);

	// Finish by binding the Address middleware
	app.param('addressId', addresses.addressByID);
};
