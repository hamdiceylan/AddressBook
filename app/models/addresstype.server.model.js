'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Addresstype Schema
 */
var AddresstypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Addresstype name',
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

mongoose.model('Addresstype', AddresstypeSchema);