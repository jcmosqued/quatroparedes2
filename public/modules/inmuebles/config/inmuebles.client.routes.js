'use strict';

//Setting up route
angular.module('inmuebles').config(['$stateProvider',
	function($stateProvider) {
		// Inmuebles state routing
		$stateProvider.
		state('listInmuebles', {
			url: '/inmuebles',
			templateUrl: 'modules/inmuebles/views/list-inmuebles.client.view.html'
		}).
		state('listInmueblesMe', {
			url: '/inmueblesMe',
			templateUrl: 'modules/inmuebles/views/list-inmueblesMe.client.view.html'
		}).
		state('listDestacados', {
			url: '/inmueblesDestacados',
			templateUrl: 'modules/inmuebles/views/list-destacados.client.view.html'
		}).
		state('createInmueble', {
			url: '/inmuebles/create',
			templateUrl: 'modules/inmuebles/views/create-inmueble.client.view.html'
		}).
		state('viewInmueble', {
			url: '/inmuebles/:inmuebleId',
			templateUrl: 'modules/inmuebles/views/sitio-inmueble.client.view.html'
		}).
		state('editDestacado', {
			url: '/inmuebles/:inmuebleId/editDestacado',
			templateUrl: 'modules/inmuebles/views/edit-destacado.client.view.html'
		}).
		state('editInmueble', {
			url: '/inmuebles/:inmuebleId/edit',
			templateUrl: 'modules/inmuebles/views/edit-inmueble.client.view.html'
		});
	}
]);