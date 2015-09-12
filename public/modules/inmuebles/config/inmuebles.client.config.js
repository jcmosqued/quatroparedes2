'use strict';

// Configuring the Articles module
angular.module('inmuebles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Inmuebles', 'inmuebles', 'dropdown', '/inmuebles(/create)?');
		Menus.addSubMenuItem('topbar', 'inmuebles', 'Ver Inmuebles', 'inmuebles');
		Menus.addSubMenuItem('topbar', 'inmuebles', 'Nuevo Inmueble', 'inmuebles/create');
		Menus.addSubMenuItem('topbar', 'inmuebles', 'Editar Inmuebles', 'inmueblesMe');
	}
]);