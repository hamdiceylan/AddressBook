'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portals = require('../../app/controllers/portals.server.controller');

	// Portals Routes
	app.route('/portals')
		.get(portals.list)
		.post(users.requiresLogin, portals.create);

	app.route('/portals/:portalId')
		.get(portals.read)
		.put(users.requiresLogin, portals.hasAuthorization, portals.update)
		.delete(users.requiresLogin, portals.hasAuthorization, portals.delete);

	// Finish by binding the Portal middleware
	app.param('portalId', portals.portalByID);
};
