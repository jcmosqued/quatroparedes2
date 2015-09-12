'use strict';

//Inmuebles service used to communicate Inmuebles REST endpoints
angular.module('inmuebles').factory('Inmuebles', ['$resource',
	function($resource) {
		return $resource('inmuebles/:inmuebleId', { inmuebleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

/*permite que se pase el valor de la categoria seleccionada en la 
pagina principal hacia la lista de inmuebles*/
angular.module('inmuebles').service('categorias', function(){
	var _categoriaActual = '';
	this.categoriaActual = _categoriaActual;
});

/*permite que se pase el valor de la transacción seleccionada en la 
pagina principal hacia la lista de inmuebles*/
angular.module('inmuebles').service('transacciones', function(){
	var _transaccionActual = '';
	this.transaccionActual = _transaccionActual;
});

/*este service permite que a traves de la variable $rootScope 
se tenga acceso a los datos para una ventana modal*/
angular.module('inmuebles').service('item', function(){
	var _inmuebleActual = {};
	this.inmuebleActual=_inmuebleActual;
});