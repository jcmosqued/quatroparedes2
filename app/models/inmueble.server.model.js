'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Inmueble Schema
 */
var InmuebleSchema = new Schema({
	titulo: { type: String, default: '', required: 'Ingresa un título para tu anuncio', trim: true },
	tipo_inmueble: { type: String, default: '', required: 'Ingresa la categoria de tu inmueble', trim: true },
	tipo_trans: { type: String, default: '', required: 'Ingresa el tipo de transacción', trim: true },
	estado: { type: String, default: '', trim: true },
	ciudad: { type: String, default: '', trim: true },
	zona: { type: String, default: '', trim: true },
	colonia: { type: String, default: '', trim: true },
	direccion: { type: String, default: '', required: 'Ingresa la calle y numero del inmueble', trim: true },
	precio: { type: Number, default: 0 },
	no_plantas: { type: Number, default: 1 },
	no_habitaciones: { type: Number, default: 1 },
	no_banos: { type: Number, default: 1 },
	no_carros: { type: Number, default: 0 },
	m2terreno: { type: Number, default: 0 },
	m2construccion: { type: Number, default: 0 },
	nombreContacto:{ type: String, default: '' },
	telContacto:{ type: String, default: '' },
	mailContacto:{ type: String, default: '' },
	image:{ type: Object },
	imagenes:{type: Object},
	tipoDestacado:{type: Number},
	created: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User'}
});

mongoose.model('Inmueble', InmuebleSchema);