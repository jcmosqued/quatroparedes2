'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Usuario = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Usuario
 */
exports.create = function(req, res) {
	var usuario = new Usuario(req.body);
	usuario.user = req.user;

	usuario.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usuario);
		}
	});
};

/**
 * Show the current Usuario
 */
exports.read = function(req, res) {
	res.jsonp(req.usuario);
};

/**
 * Update a Usuario
 */
exports.update = function(req, res) {
	var usuario = req.usuario ;

	usuario = _.extend(usuario , req.body);

	usuario.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usuario);
		}
	});
};

/**
 * Delete an Usuario
 */
exports.delete = function(req, res) {
	var usuario = req.usuario ;

	usuario.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usuario);
		}
	});
};

/**
 * List of Usuarios
 */
exports.list = function(req, res) { 
	Usuario.find().sort('-created').select('displayName username roles tipo logo telefono paginaweb facebook twitter colorEncabezadoPie colorFondo colorLetra colorMarco anunciosP anunciosD estatus').exec(function(err, usuarios) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usuarios);
		}
	});
};

/**
 * Usuario middleware
 */
exports.usuarioByID = function(req, res, next, id) { 
	Usuario.findById(id).select('displayName username roles tipo logo telefono paginaweb facebook twitter colorEncabezadoPie colorFondo colorLetra colorMarco anunciosP anunciosD estatus').exec(function(err, usuario) {
		if (err) return next(err);
		if (! usuario) return next(new Error('Failed to load Usuario ' + id));
		req.usuario = usuario ;
		next();
	});
};

/**
 * Usuario authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.usuario.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
