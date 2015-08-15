'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var addresstypes = require('../../app/controllers/addresstypes.server.controller');

	// Addresstypes Routes
	app.route('/addresstypes')
		.get(addresstypes.list)
		.post(users.requiresLogin, addresstypes.create);

	app.route('/addresstypes/:addresstypeId')
		.get(addresstypes.read)
		.put(users.requiresLogin, addresstypes.hasAuthorization, addresstypes.update)
		.delete(users.requiresLogin, addresstypes.hasAuthorization, addresstypes.delete);

	// Finish by binding the Addresstype middleware
	app.param('addresstypeId', addresstypes.addresstypeByID);
};
