'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Portal = mongoose.model('Portal'),
	_ = require('lodash');

/**
 * Create a Portal
 */
exports.create = function(req, res) {
	var portal = new Portal(req.body);
	portal.user = req.user;
	portal.website = req.website;

	portal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portal);
		}
	});
};

/**
 * Show the current Portal
 */
exports.read = function(req, res) {
	res.jsonp(req.portal);
};

/**
 * Update a Portal
 */
exports.update = function(req, res) {
	var portal = req.portal ;

	portal = _.extend(portal , req.body);

	portal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portal);
		}
	});
};

/**
 * Delete an Portal
 */
exports.delete = function(req, res) {
	var portal = req.portal ;

	portal.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portal);
		}
	});
};

/**
 * List of Portals
 */
exports.list = function(req, res) { 
	Portal.find().sort('-created').populate('user', 'displayName').exec(function(err, portals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(portals);
		}
	});
};

/**
 * Portal middleware
 */
exports.portalByID = function(req, res, next, id) { 
	Portal.findById(id).populate('user', 'displayName').exec(function(err, portal) {
		if (err) return next(err);
		if (! portal) return next(new Error('Failed to load Portal ' + id));
		req.portal = portal ;
		next();
	});
};

/**
 * Portal authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.portal.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
