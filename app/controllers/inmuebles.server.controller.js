'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Inmueble = mongoose.model('Inmueble'),
	fs = require('fs'),
	_ = require('lodash');


/**
 * Create a Inmueble
 */
exports.create = function(req, res) {
	var inmueble = new Inmueble(req.body);
	inmueble.user = req.user;
		console.log('server');
		console.log(inmueble);

	inmueble.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inmueble);
		}
	});
};

/**
 * Show the current Inmueble
 */
exports.read = function(req, res) {
	res.jsonp(req.inmueble);
};

/**
 * Update a Inmueble
 */
exports.update = function(req, res) {
	var inmueble = req.inmueble ;

	inmueble = _.extend(inmueble , req.body);

	inmueble.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inmueble);
		}
	});
};

/**
 * Delete an Inmueble
 */
exports.delete = function(req, res) {
	var inmueble = req.inmueble ;

	inmueble.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inmueble);
		}
	});
};

/**
 * List of Inmuebles
 */
/*exports.list = function(req, res) { 
	Inmueble.find().sort('-tipoDestacado').populate('user').exec(function(err, inmuebles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inmuebles);
		}
	});
};*/

exports.list = function(req, res){
	var count = req.query.count || 5;
	var page = req.query.page || 1;

	var filter ={
		filters:{
			mandatory:{
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	var sort = {
		sort: {
			desc: 'tipoDestacado'
		}
	};

	Inmueble
		.find()
		.populate('user')
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, inmuebles){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inmuebles);
		}
		});
};


/**
 * Inmueble middleware
 */
exports.inmuebleByID = function(req, res, next, id) { 
	Inmueble.findById(id).populate('user').exec(function(err, inmueble) {
		if (err) return next(err);
		if (! inmueble) return next(new Error('Failed to load Inmueble ' + id));
		req.inmueble = inmueble ;
		next();
	});
};

/**
 * Inmueble authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.inmueble.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
