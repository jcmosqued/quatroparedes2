'use strict';


angular.module('core').controller('HomeController', ['$scope', 'categorias', 'transacciones', 'Authentication',
	function($scope, categorias, transacciones, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		$scope.setCategoria =function(categoria){
			categorias.categoriaActual=categoria;
		}

		$scope.setTransaccion =function(transaccion){
			transacciones.transaccionActual=transaccion;
		}

	}
	]);