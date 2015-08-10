'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Address = mongoose.model('Address'),
	_ = require('lodash');

/**
 * Create a Address
 */
exports.create = function(req, res) {
	var address = new Address(req.body);
	address.user = req.user;

	address.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(address);
		}
	});
};

/**
 * Show the current Address
 */
exports.read = function(req, res) {
	res.jsonp(req.address);
};

/**
 * Update a Address
 */
exports.update = function(req, res) {
	var address = req.address ;

	address = _.extend(address , req.body);

	address.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(address);
		}
	});
};

/**
 * Delete an Address
 */
exports.delete = function(req, res) {
	var address = req.address ;

	address.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(address);
		}
	});
};

/**
 * List of Addresses
 */
exports.list = function(req, res) { 
	Address.find().sort('-created').populate('user', 'displayName').exec(function(err, addresses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(addresses);
		}
	});
};

/**
 * Address middleware
 */
exports.addressByID = function(req, res, next, id) { 
	Address.findById(id).populate('user', 'displayName').exec(function(err, address) {
		if (err) return next(err);
		if (! address) return next(new Error('Failed to load Address ' + id));
		req.address = address ;
		next();
	});
};

/**
 * Address authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.address.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
