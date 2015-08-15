'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Addresstype = mongoose.model('Addresstype'),
	_ = require('lodash');

/**
 * Create a Addresstype
 */
exports.create = function(req, res) {
	var addresstype = new Addresstype(req.body);
	addresstype.user = req.user;

	addresstype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(addresstype);
		}
	});
};

/**
 * Show the current Addresstype
 */
exports.read = function(req, res) {
	res.jsonp(req.addresstype);
};

/**
 * Update a Addresstype
 */
exports.update = function(req, res) {
	var addresstype = req.addresstype ;

	addresstype = _.extend(addresstype , req.body);

	addresstype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(addresstype);
		}
	});
};

/**
 * Delete an Addresstype
 */
exports.delete = function(req, res) {
	var addresstype = req.addresstype ;

	addresstype.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(addresstype);
		}
	});
};

/**
 * List of Addresstypes
 */
exports.list = function(req, res) { 
	Addresstype.find().sort('-created').populate('user', 'displayName').exec(function(err, addresstypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(addresstypes);
		}
	});
};

/**
 * Addresstype middleware
 */
exports.addresstypeByID = function(req, res, next, id) { 
	Addresstype.findById(id).populate('user', 'displayName').exec(function(err, addresstype) {
		if (err) return next(err);
		if (! addresstype) return next(new Error('Failed to load Addresstype ' + id));
		req.addresstype = addresstype ;
		next();
	});
};

/**
 * Addresstype authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.addresstype.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
