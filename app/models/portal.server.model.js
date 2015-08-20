'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Portal Schema
 */
var PortalSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Portal name',
		trim: true
	},
	website: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Portal', PortalSchema);