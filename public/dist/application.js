'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'Quatroparedes';
	var applicationModuleVendorDependencies = ['ngResource', 'ui.router', 'ui.bootstrap', 'ui.utils','naif.base64'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('inmuebles');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('usuarios');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('politicas', {
			url: '/politicas',
			templateUrl: 'modules/core/views/Polticas.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
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
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('El menu no existe');
				}
			} else {
				throw new Error('Id de menu no proporcionado');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

// Inmuebles controller
angular.module('inmuebles').controller('InmueblesController', ['$scope', '$rootScope', '$modal', 'categorias', 'transacciones', 'item', '$timeout', '$stateParams', '$location', 'Authentication', 'Inmuebles',
	function($scope, $rootScope, $modal, categorias, transacciones, item, $timeout, $stateParams, $location, Authentication, Inmuebles) {
		$scope.authentication = Authentication;
		$scope.categoriaActual=categorias.categoriaActual;
		$scope.transaccionActual=transacciones.transaccionActual;

            $scope.setCategoria =function(categoria){
			$scope.categoriaActual=categoria;
		}

		$scope.setTransaccion =function(transaccion){
			$scope.transaccionActual=transaccion;
		}

		$scope.estados = [
	   		{"valor": "Aguascalientes", 
	   		 "ciudades": [{"nombre":"Aguascalientes"}, {"nombre":"Asientos"}, {"nombre":"Calvillo"}, {"nombre":"Cosío"}, {"nombre":"El Llano"}, {"nombre":"Jesús María"}, {"nombre":"Pabellón de Arteaga"}, {"nombre":"Rincón de Romos"}, {"nombre":"San Francisco de los Romo"}, {"nombre":"San José de Gracia"}, {"nombre":"Tepezalá"}
	   		]},
            	{"valor": "Baja California",
            	 "ciudades": [{"nombre":"Ensenada"}, {"nombre":"Mexicali"}, {"nombre":"Playas de Rosarito"}, {"nombre":"Tecate"}, {"nombre":"Tijuana"}
            	]},
            	{"valor":"Baja California Sur",
            	 "ciudades": [{"nombre":"Comondú"}, {"nombre":"La Paz"}, {"nombre":"Loreto"}, {"nombre":"Los Cabos"}, {"nombre":"Mulegé"}
            	]}, 
            	{"valor": "Campeche",
            	 "ciudades": [{"nombre":"Calakmul"}, {"nombre":"Calkiní"}, {"nombre":"Campeche"}, {"nombre":"Candelaria"}, {"nombre":"Carmen"}, {"nombre":"Champotón"}, {"nombre":"Escárcega"}, {"nombre":"Hecelchakán"}, {"nombre":"Hopelchén"}, {"nombre":"Palizada"}, {"nombre":"Tenabo"}
            	]},

            	{"valor": "Coahuila",
            	 "ciudades": [{"nombre":"Abasolo"}, {"nombre":"Acuña"}, {"nombre":"Allende"}, {"nombre":"Arteaga"}, {"nombre":"Candela"}, {"nombre":"Castaños"}, {"nombre":"Cuatrociénegas"}, {"nombre":"Escobedo"}, {"nombre":"Francisco I. Madero"}, {"nombre":"Frontera"}, {"nombre":"General Cepeda"}, {"nombre":"Guerrero"}, {"nombre":"Hidalgo"}, {"nombre":"Jiménez"}, {"nombre":"Juárez"}, {"nombre":"Lamadrid"}, {"nombre":"Matamoros"}, {"nombre":"Monclova"}, {"nombre":"Morelos"}, {"nombre":"Múzquiz"}
            	 	, {"nombre":"Nadadores"}, {"nombre":"Nava"}, {"nombre":"Ocampo"}, {"nombre":"Parras"}, {"nombre":"Piedras Negras"}, {"nombre":"Progreso"}, {"nombre":"Ramos Arizpe"}, {"nombre":"Sabinas"}, {"nombre":"Sacramento"}, {"nombre":"Saltillo"}, {"nombre":"San Buenaventura"}, {"nombre":"San Juan de Sabinas"}, {"nombre":"San Pedro"}, {"nombre":"Sierra Mojada"}, {"nombre":"Torreón"}, {"nombre":"Viesca"}, {"nombre":"Villa Unión"}, {"nombre":"Zaragoza"}
            		]},
            	{"valor": "Colima",
            	 "ciudades": [{"nombre":"Armería"}, {"nombre":"Colima"}, {"nombre":"Comala"}, {"nombre":"Coquimatlán"}, {"nombre":"Cuauhtémoc"}, {"nombre":"Ixtlahuacán"}, {"nombre":"Manzanillo"}, {"nombre":"Minatitlán"}, {"nombre":"Tecomán"}, {"nombre":"Villa de Alvarez"}
            		]},
            	{"valor": "Chiapas",
            	 "ciudades": [{"nombre":"Acacoyagua"}, {"nombre":"Acala"}, {"nombre":"Acapetahua"}, {"nombre":"Aldama"}, {"nombre":"Altamirano"}, {"nombre":"Amatán"}, {"nombre":"Amatenango de la Frontera"}, {"nombre":"Amatenango del Valle"}, {"nombre":"Angel Albino Corzo"}, {"nombre":"Arriaga"}, {"nombre":"Bejucal de Ocampo"}, {"nombre":"Bella Vista"}, {"nombre":"Benemérito de las Américas"}, {"nombre":"Berriozábal"}, {"nombre":"Bochil"}, {"nombre":"Cacahoatán"}, {"nombre":"Catazajá"}, {"nombre":"Chalchihuitán"}, {"nombre":"Chamula"}, {"nombre":"Chanal"}
            	 	, {"nombre":"Chapultenango"}, {"nombre":"Chenalhó"}, {"nombre":"Chiapa de Corzo"}, {"nombre":"Chiapilla"}, {"nombre":"Chicoasén"}, {"nombre":"Chicomuselo"}, {"nombre":"Chilón"}, {"nombre":"Cintalapa"}, {"nombre":"Coapilla"}, {"nombre":"Comitán de Domínguez"}, {"nombre":"Copainalá"}, {"nombre":"El Bosque"}, {"nombre":"El Porvenir"}, {"nombre":"Escuintla"}, {"nombre":"Francisco León"}, {"nombre":"Frontera Comalapa"}, {"nombre":"Frontera Hidalgo"}, {"nombre":"Huehuetán"}, {"nombre":"Huitiupán"}, {"nombre":"Huixtán"}
            	 	, {"nombre":"Huixtla"}, {"nombre":"Ixhuatán"}, {"nombre":"Ixtacomitán"}, {"nombre":"Ixtapa"}, {"nombre":"Ixtapangajoya"}, {"nombre":"Jiquipilas"}, {"nombre":"Jitotol"}, {"nombre":"Juárez"}, {"nombre":"La Concordia"}, {"nombre":"La Grandeza"}, {"nombre":"La Independencia"}, {"nombre":"La Libertad"}, {"nombre":"La Trinitaria"}, {"nombre":"Larráinzar"}, {"nombre":"Las Margaritas"}, {"nombre":"Las Rosas"}, {"nombre":"Mapastepec"}, {"nombre":"Maravilla Tenejapa"}, {"nombre":"Marqués de Comillas"}, {"nombre":"Mazapa de Madero"}
            	 	, {"nombre":"Mazatán"}, {"nombre":"Metapa"}, {"nombre":"Mitontic"}, {"nombre":"Montecristo de Guerrero"}, {"nombre":"Motozintla"}, {"nombre":"Nicolás Ruíz"}, {"nombre":"Ocosingo"}, {"nombre":"Ocotepec"}, {"nombre":"Ocozocoautla de Espinosa"}, {"nombre":"Ostuacán"}, {"nombre":"Osumacinta"}, {"nombre":"Oxchuc"}, {"nombre":"Palenque"}, {"nombre":"Pantelhó"}, {"nombre":"Pantepec"}, {"nombre":"Pichucalco"}, {"nombre":"Pijijiapan"}, {"nombre":"Pueblo Nuevo Solistahuacán"}, {"nombre":"Rayón"}, {"nombre":"Reforma"}
            	 	, {"nombre":"Sabanilla"}, {"nombre":"Salto de Agua"}, {"nombre":"San Andrés Duraznal"}, {"nombre":"San Cristóbal de las Casas"}, {"nombre":"San Fernando"}, {"nombre":"San Juan Cancuc"}, {"nombre":"San Lucas"}, {"nombre":"Santiago el Pinar"}, {"nombre":"Siltepec"}, {"nombre":"Simojovel"}, {"nombre":"Sitalá"}, {"nombre":"Socoltenango"}, {"nombre":"Solosuchiapa"}, {"nombre":"Soyaló"}, {"nombre":"Suchiapa"}, {"nombre":"Suchiate"}, {"nombre":"Sunuapa"}, {"nombre":"Tapachula"}, {"nombre":"Tapalapa"}, {"nombre":"Tapilula"}
            	 	, {"nombre":"Tecpatán"}, {"nombre":"Tenejapa"}, {"nombre":"Teopisca"}, {"nombre":"Tila"}, {"nombre":"Tonalá"}, {"nombre":"Totolapa"}, {"nombre":"Tumbalá"}, {"nombre":"Tuxtla Chico"}, {"nombre":"Tuxtla Gutiérrez"}, {"nombre":"Tuzantán"}, {"nombre":"Tzimol"}, {"nombre":"Unión Juárez"}, {"nombre":"Venustiano Carranza"}, {"nombre":"Villa Comaltitlán"}, {"nombre":"Villa Corzo"}, {"nombre":"Villaflores"}, {"nombre":"Yajalón"}, {"nombre":"Zinacantán"}
            		]},
            	{"valor": "Chihuahua",
            	 "ciudades": [{"nombre":"Ahumada"}, {"nombre":"Aldama"}, {"nombre":"Allende"}, {"nombre":"Aquiles Serdán"}, {"nombre":"Ascensión"}, {"nombre":"Bachíniva"}, {"nombre":"Balleza"}, {"nombre":"Batopilas"}, {"nombre":"Bocoyna"}, {"nombre":"Buenaventura"}, {"nombre":"Camargo"}, {"nombre":"Carichí"}, {"nombre":"Casas Grandes"}, {"nombre":"Chihuahua"}, {"nombre":"Chínipas"}, {"nombre":"Coronado"}, {"nombre":"Coyame del Sotol"}, {"nombre":"Cuauhtémoc"}, {"nombre":"Cusihuiriachi"}, {"nombre":"Delicias"}
            	 	, {"nombre":"Dr. Belisario Domínguez"}, {"nombre":"El Tule"}, {"nombre":"Galeana"}, {"nombre":"Gómez Farías"}, {"nombre":"Gran Morelos"}, {"nombre":"Guachochi"}, {"nombre":"Guadalupe"}, {"nombre":"Guadalupe y Calvo"}, {"nombre":"Guazapares"}, {"nombre":"Guerrero"}, {"nombre":"Hidalgo del Parral"}, {"nombre":"Huejotitán"}, {"nombre":"Ignacio Zaragoza"}, {"nombre":"Janos"}, {"nombre":"Jiménez"}, {"nombre":"Juárez"}, {"nombre":"Julimes"}, {"nombre":"La Cruz"}, {"nombre":"López"}, {"nombre":"Madera"}
            	 	, {"nombre":"Maguarichi"}, {"nombre":"Manuel Benavides"}, {"nombre":"Matachí"}, {"nombre":"Matamoros"}, {"nombre":"Meoqui"}, {"nombre":"Morelos"}, {"nombre":"Moris"}, {"nombre":"Namiquipa"}, {"nombre":"Nonoava"}, {"nombre":"Nuevo Casas Grandes"}, {"nombre":"Ocampo"}, {"nombre":"Ojinaga"}, {"nombre":"Praxedis G. Guerrero"}, {"nombre":"Riva Palacio"}, {"nombre":"Rosales"}, {"nombre":"Rosario"}, {"nombre":"San Francisco de Borja"}, {"nombre":"San Francisco de Conchos"}, {"nombre":"San Francisco del Oro"}, {"nombre":"Santa Bárbara"}
            	 	, {"nombre":"Santa Isabel"}, {"nombre":"Satevó"}, {"nombre":"Saucillo"}, {"nombre":"Temósachi"}, {"nombre":"Urique"}, {"nombre":"Uruachi"}, {"nombre":"Valle de Zaragoza"}
	            	]},
          	      {"valor": "Distrito Federal",
          	       "ciudades": [{"nombre":"Alvaro Obregón"}, {"nombre":"Azcapotzalco"}, {"nombre":"Benito Juárez"}, {"nombre":"Coyoacán"}, {"nombre":"Cuajimalpa de Morelos"}, {"nombre":"Cuauhtémoc",}, {"nombre":"Gustavo A. Madero"}, {"nombre":"Iztacalco"}, {"nombre":"Iztapalapa"}, {"nombre":"La Magdalena Contreras"}, {"nombre":"Miguel Hidalgo"}, {"nombre":"Milpa Alta"}, {"nombre":"Tláhuac"}, {"nombre":"Tlalpan"}, {"nombre":"Venustiano Carranza"}, {"nombre":"Xochimilco"}
          	        	]},
            	{"valor": "Durango", 
            	 "ciudades": [{"nombre":"Canatlán"}, {"nombre":"Canelas"}, {"nombre":"Coneto de Comonfort"}, {"nombre":"Cuencamé"}, {"nombre":"Durango"}, {"nombre":"El Oro"}, {"nombre":"Gómez Palacio"}, {"nombre":"Gral. Simón Bolívar"}, {"nombre":"Guadalupe Victoria"}, {"nombre":"Guanaceví"}, {"nombre":"Hidalgo"}, {"nombre":"Indé"}, {"nombre":"Lerdo"}, {"nombre":"Mapimí"}, {"nombre":"Mezquital"}, {"nombre":"Nazas"}, {"nombre":"Nombre de Dios"}, {"nombre":"Nuevo Ideal"}, {"nombre":"Ocampo"}, {"nombre":"Otáez"}
            	 	, {"nombre":"Pánuco de Coronado"}, {"nombre":"Peñón Blanco"}, {"nombre":"Poanas"}, {"nombre":"Pueblo Nuevo"}, {"nombre":"Rodeo"}, {"nombre":"San Bernardo"}, {"nombre":"San Dimas"}, {"nombre":"San Juan de Guadalupe"}, {"nombre":"San Juan del Río"}, {"nombre":"San Luis del Cordero"}, {"nombre":"San Pedro del Gallo"}, {"nombre":"Santa Clara"}, {"nombre":"Santiago Papasquiaro"}, {"nombre":"Súchil"}, {"nombre":"Tamazula"}, {"nombre":"Tepehuanes"}, {"nombre":"Tlahualilo"}, {"nombre":"Topia"}, {"nombre":"Vicente Guerrero"}
            		]},
            	{"valor": "Guanajuato",
            	 "ciudades":[{"nombre":"Abasolo"}, {"nombre":"Acámbaro"}, {"nombre":"Apaseo el Alto"}, {"nombre":"Apaseo el Grande"}, {"nombre":"Atarjea"}, {"nombre":"Celaya"}, {"nombre":"Comonfort"}, {"nombre":"Coroneo"}, {"nombre":"Cortazar"}, {"nombre":"Cuerámaro"}, {"nombre":"Doctor Mora"}, {"nombre":"Dolores Hidalgo"}, {"nombre":"Guanajuato"}, {"nombre":"Huanímaro"}, {"nombre":"Irapuato"}, {"nombre":"Jaral del Progreso"}, {"nombre":"Jerécuaro"}, {"nombre":"Juventino Rosas"}, {"nombre":"León"}, {"nombre":"Manuel Doblado"}
            	 	, {"nombre":"Moroleón"}, {"nombre":"Ocampo"}, {"nombre":"Pénjamo"}, {"nombre":"Pueblo Nuevo"}, {"nombre":"Purísima del Rincón"}, {"nombre":"Romita"}, {"nombre":"Salamanca"}, {"nombre":"Salvatierra"}, {"nombre":"San Diego de la Unión"}, {"nombre":"San Felipe"}, {"nombre":"San Francisco del Rincón"}, {"nombre":"San José Iturbide"}, {"nombre":"San Luis de la Paz"}, {"nombre":"San Miguel de Allende"}, {"nombre":"Santa Catarina"}, {"nombre":"Santiago Maravatío"}, {"nombre":"Silao"}, {"nombre":"Tarandacuao"}, {"nombre":"Tarimoro"}, {"nombre":"Tierra Blanca"}
            	 	, {"nombre":"Uriangato"}, {"nombre":"Valle de Santiago"}, {"nombre":"Victoria"}, {"nombre":"Villagrán"}, {"nombre":"Xichú"}, {"nombre":"Yuriria"}
            		]},
            	{"valor": "Guerrero",
            	 "ciudades":[{"nombre":"Acapulco"}, {"nombre":"Acatepec"}, {"nombre":"Ahuacuotzingo"}, {"nombre":"Ajuchitlán"}, {"nombre":"Alcozauca"}, {"nombre":"Alpoyeca"}, {"nombre":"Apaxtla"}, {"nombre":"Arcelia"}, {"nombre":"Atenango del Río"}, {"nombre":"Atlamajalcingo"}, {"nombre":"Atlixtac"}, {"nombre":"Atoyac"}, {"nombre":"Ayutla"}, {"nombre":"Azoyú"}, {"nombre":"Benito Juárez"}, {"nombre":"Buenavista"}, {"nombre":"Chilapa"}, {"nombre":"Chilpancingo"}, {"nombre":"Coahuayutla"}, {"nombre":"Cochoapa"}
            	 	, {"nombre":"Cocula"}, {"nombre":"Copala"}, {"nombre":"Copalillo"}, {"nombre":"Copanatoyac"}, {"nombre":"Coyuca de Benítez"}, {"nombre":"Coyuca de Catalán"}, {"nombre":"Cuajinicuilapa"}, {"nombre":"Cualác"}, {"nombre":"Cuautepec"}, {"nombre":"Cuetzala del Progreso"}, {"nombre":"Cutzamala de Pinzón"}, {"nombre":"Eduardo Neri"}, {"nombre":"Florencio Villarreal"}, {"nombre":"General Canuto A. Neri"}, {"nombre":"General Heliodoro Castillo"}, {"nombre":"Huamuxtitlán"}, {"nombre":"Huitzuco"}, {"nombre":"Iguala"}, {"nombre":"Igualapa"}, {"nombre":"Ixcateopan"}
            	 	, {"nombre":"José Azueta"}, {"nombre":"José Joaquin de Herrera"}, {"nombre":"Juan R. Escudero"}, {"nombre":"La Unión"}, {"nombre":"Leonardo Bravo"}, {"nombre":"Malinaltepec"}, {"nombre":"Marquelia"}, {"nombre":"Mártir de Cuilapan"}, {"nombre":"Metlatónoc"}, {"nombre":"Mochitlán"}, {"nombre":"Olinalá"}, {"nombre":"Ometepec"}, {"nombre":"Pedro Ascencio Alquisiras"}, {"nombre":"Petatlán"}, {"nombre":"Pilcaya"}, {"nombre":"Pungarabato"}, {"nombre":"Quechultenango"}, {"nombre":"San Luis Acatlán"}, {"nombre":"San Marcos"}, {"nombre":"San Miguel Totolapan"}
            	 	, {"nombre":"Taxco"}, {"nombre":"Tecoanapa"}, {"nombre":"Técpan"}, {"nombre":"Teloloapan"}, {"nombre":"Tepecoacuilco"}, {"nombre":"Tetipac"}, {"nombre":"Tixtla"}, {"nombre":"Tlacoachistlahuaca"}, {"nombre":"Tlacoapa"}, {"nombre":"Tlalchapa"}, {"nombre":"Tlalixtaquilla"}, {"nombre":"Tlapa"}, {"nombre":"Tlapehuala"}, {"nombre":"Xalpatláhuac"}, {"nombre":"Xochihuehuetlán"}, {"nombre":"Xochistlahuaca"}, {"nombre":"Zapotitlán Tablas"}, {"nombre":"Zirándaro"}, {"nombre":"Zitlala"}
            		]},
			{"valor": "Hidalgo",
			 "ciudades":[{"nombre":"Acatlán"}, {"nombre":"Acaxochitlán"}, {"nombre":"Actopan"}, {"nombre":"Agua Blanca"}, {"nombre":"Ajacuba"}, {"nombre":"Alfajayucan"}, {"nombre":"Almoloya"}, {"nombre":"Apan"}, {"nombre":"Atitalaquia"}, {"nombre":"Atlapexco"}, {"nombre":"Atotonilco de Tula"}, {"nombre":"Atotonilco el Grande"}, {"nombre":"Calnali"}, {"nombre":"Cardonal"}, {"nombre":"Chapantongo"}, {"nombre":"Chapulhuacán"}, {"nombre":"Chilcuautla"}, {"nombre":"Cuautepec"}, {"nombre":"El Arenal"}, {"nombre":"Eloxochitlán"}
			 	, {"nombre":"Emiliano Zapata"}, {"nombre":"Epazoyucan"}, {"nombre":"Francisco I. Madero"}, {"nombre":"Huasca"}, {"nombre":"Huautla"}, {"nombre":"Huazalingo"}, {"nombre":"Huehuetla"}, {"nombre":"Huejutla"}, {"nombre":"Huichapan"}, {"nombre":"Ixmiquilpan"}, {"nombre":"Jacala"}, {"nombre":"Jaltocán"}, {"nombre":"Juárez Hidalgo"}, {"nombre":"La Misión"}, {"nombre":"Lolotla"}, {"nombre":"Metepec"}, {"nombre":"Metztitlán"}, {"nombre":"Mineral de la Reforma"}, {"nombre":"Mineral del Chico"}
			 	, {"nombre":"Mineral del Monte"}, {"nombre":"Mixquiahuala"}, {"nombre":"Molango"}, {"nombre":"Nicolás Flores"}, {"nombre":"Nopala"}, {"nombre":"Omitlán"}, {"nombre":"Pachuca"}, {"nombre":"Pacula"}, {"nombre":"Pisaflores"}, {"nombre":"Progreso de Obregón"}, {"nombre":"San Agustín Metzquititlán"}, {"nombre":"San Agustín Tlaxiaca"}, {"nombre":"San Bartolo Tutotepec"}, {"nombre":"San Felipe Orizatlán"}, {"nombre":"San Salvador"}, {"nombre":"Santiago de Anaya"}, {"nombre":"Santiago Tulantepec"}, {"nombre":"Singuilucan"}, {"nombre":"Tasquillo"}, {"nombre":"Tecozautla"}
			 	, {"nombre":"Tenango"}, {"nombre":"Tepeapulco"}, {"nombre":"Tepehuacán"}, {"nombre":"Tepeji del Río"}, {"nombre":"Tepetitlán"}, {"nombre":"Tetepango"}, {"nombre":"Tezontepec"}, {"nombre":"Tianguistengo"}, {"nombre":"Tizayuca"}, {"nombre":"Tlahuelilpan"}, {"nombre":"Tlahuiltepa"}, {"nombre":"Tlanalapa"}, {"nombre":"Tlanchinol"}, {"nombre":"Tlaxcoapan"}, {"nombre":"Tolcayuca"}, {"nombre":"Tula"}, {"nombre":"Tulancingo"}, {"nombre":"Villa de Tezontepec"}, {"nombre":"Xochiatipan"}, {"nombre":"Xochicoatlán"}
			 	, {"nombre":"Yahualica"}, {"nombre":"Zacualtipán"}, {"nombre":"Zapotlán"}, {"nombre":"Zempoala"}, {"nombre":"Zimapán"}
            		]},
            	{"valor": "Jalisco",
            	 "ciudades":[{"nombre":"Acatic"}, {"nombre":"Acatlán de Juárez"}, {"nombre":"Ahualulco"}, {"nombre":"Amacueca"}, {"nombre":"Amatitán"}, {"nombre":"Ameca"}, {"nombre":"Arandas"}, {"nombre":"Atemajac"}, {"nombre":"Atengo"}, {"nombre":"Atenguillo"}, {"nombre":"Atotonilco"}, {"nombre":"Atoyac"}, {"nombre":"Autlán"}, {"nombre":"Ayotlán"}, {"nombre":"Ayutla"}, {"nombre":"Bolaños"}, {"nombre":"Cabo Corrientes"}, {"nombre":"Cañadas de Obregón"}, {"nombre":"Casimiro Castillo"}, {"nombre":"Chapala"}
            	 	, {"nombre":"Chimaltitán"}, {"nombre":"Chiquilistlán"}, {"nombre":"Cihuatlán"}, {"nombre":"Cocula"}, {"nombre":"Colotlán"}, {"nombre":"Concepción de Buenos Aires"}, {"nombre":"Cuautitlán"}, {"nombre":"Cuautla"}, {"nombre":"Cuquío"}, {"nombre":"Degollado"}, {"nombre":"Ejutla"}, {"nombre":"EL Arenal"}, {"nombre":"El Grullo"}, {"nombre":"El Limón"}, {"nombre":"El Salto"}, {"nombre":"Encarnación de Díaz"}, {"nombre":"Etzatlán"}, {"nombre":"Gómez Farías"}, {"nombre":"Guachinango"}, {"nombre":"Guadalajara"}
            	 	, {"nombre":"Hostotipaquillo"}, {"nombre":"Huejúcar"}, {"nombre":"Huejuquilla"}, {"nombre":"Ixtlahuacán de los Membrillos"}, {"nombre":"Ixtlahuacán del Río"}, {"nombre":"Jalostotitlán"}, {"nombre":"Jamay"}, {"nombre":"Jesús María"}, {"nombre":"Jilotlán"}, {"nombre":"Jocotepec"}, {"nombre":"Juanacatlán"}, {"nombre":"Juchitlán"}, {"nombre":"La Barca"}, {"nombre":"La Huerta"}, {"nombre":"La Manzanilla de la Paz"}, {"nombre":"Lagos de Moreno"}, {"nombre":"Magdalena"}, {"nombre":"Mascota"}, {"nombre":"Mazamitla"}, {"nombre":"Mexticacán"}
            	 	, {"nombre":"Mezquitic"}, {"nombre":"Mixtlán"}, {"nombre":"Ocotlán"}, {"nombre":"Ojuelos"}, {"nombre":"Pihuamo"}, {"nombre":"Poncitlán"}, {"nombre":"Puerto Vallarta"}, {"nombre":"Quitupan"}, {"nombre":"San Cristóbal de la Barranca"}, {"nombre":"San Diego de Alejandría"}, {"nombre":"San Gabriel"}, {"nombre":"San Juan de los Lagos"}, {"nombre":"San Juanito de Escobedo"}, {"nombre":"San Julián"}, {"nombre":"San Marcos"}, {"nombre":"San Martín de Bolaños"}, {"nombre":"San Martín Hidalgo"}, {"nombre":"San Miguel el Alto"}, {"nombre":"San Sebastián"}, {"nombre":"Santa María de los Ángeles"}
            	 	, {"nombre":"Santa María del Oro"}, {"nombre":"Sayula"}, {"nombre":"Tala"}, {"nombre":"Talpa"}, {"nombre":"Tamazula"}, {"nombre":"Tapalpa"}, {"nombre":"Tecalitlán"}, {"nombre":"Techaluta"}, {"nombre":"Tecolotlán"}, {"nombre":"Tenamaxtlán"}, {"nombre":"Teocaltiche"}, {"nombre":"Teocuitatlán"}, {"nombre":"Tepatitlán"}, {"nombre":"Tequila"}, {"nombre":"Teuchitlán"}, {"nombre":"Tizapán"}, {"nombre":"Tlajomulco"}, {"nombre":"Tlaquepaque"}, {"nombre":"Tolimán"}, {"nombre":"Tomatlán"}
            	 	, {"nombre":"Tonalá"}, {"nombre":"Tonaya"}, {"nombre":"Tonila"}, {"nombre":"Totatiche"}, {"nombre":"Tototlán"}, {"nombre":"Tuxcacuesco"}, {"nombre":"Tuxcueca"}, {"nombre":"Tuxpan"}, {"nombre":"Unión de San Antonio"}, {"nombre":"Unión de Tula"}, {"nombre":"Valle de Guadalupe"}, {"nombre":"Valle de Juárez"}, {"nombre":"Villa Corona"}, {"nombre":"Villa Guerrero"}, {"nombre":"Villa Hidalgo"}, {"nombre":"Villa Purificación"}, {"nombre":"Yahualica"}, {"nombre":"Zacoalco"}, {"nombre":"Zapopan"}, {"nombre":"Zapotiltic"}, {"nombre":"Zapotitlán"}
            	 	, {"nombre":"Zapotlán del Rey"}, {"nombre":"Zapotlán el Grande"}, {"nombre":"Zapotlanejo"}
            		]},
            	{"valor": "Estado de México",
            	 "ciudades":[{"nombre":"Acambay"}, {"nombre":"Acolman"}, {"nombre":"Aculco"}, {"nombre":"Almoloya de Alquisiras"}, {"nombre":"Almoloya de Juárez"}, {"nombre":"Almoloya del Río"}, {"nombre":"Amanalco"}, {"nombre":"Amatepec"}, {"nombre":"Amecameca"}, {"nombre":"Apaxco"}, {"nombre":"Atenco"}, {"nombre":"Atizapán"}, {"nombre":"Atizapán de Zaragoza"}, {"nombre":"Atlacomulco"}, {"nombre":"Atlautla"}, {"nombre":"Axapusco"}, {"nombre":"Ayapango"}, {"nombre":"Calimaya"}, {"nombre":"Capulhuac"}, {"nombre":"Chalco"}, {"nombre":"Chapa de Mota"}
            	 	, {"nombre":"Chapultepec"}, {"nombre":"Chiautla"}, {"nombre":"Chicoloapan"}, {"nombre":"Chiconcuac"}, {"nombre":"Chimalhuacán"}, {"nombre":"Coacalco"}, {"nombre":"Coatepec"}, {"nombre":"Cocotitlán"}, {"nombre":"Coyotepec"}, {"nombre":"Cuautitlán"}, {"nombre":"Cuautitlán Izcalli"}, {"nombre":"Donato Guerra"}, {"nombre":"Ecatepec"}, {"nombre":"Ecatzingo"}, {"nombre":"El Oro"}, {"nombre":"Huehuetoca"}, {"nombre":"Hueypoxtla"}, {"nombre":"Huixquilucan"}, {"nombre":"Isidro Fabela"}, {"nombre":"Ixtapaluca"}
            	 	, {"nombre":"Ixtapan de la Sal"}, {"nombre":"Ixtapan del Oro"}, {"nombre":"Ixtlahuaca"}, {"nombre":"Jaltenco"}, {"nombre":"Jilotepec"}, {"nombre":"Jilotzingo"}, {"nombre":"Jiquipilco"}, {"nombre":"Jocotitlán"}, {"nombre":"Joquicingo"}, {"nombre":"Juchitepec"}, {"nombre":"La Paz"}, {"nombre":"Lerma"}, {"nombre":"Luvianos"}, {"nombre":"Malinalco"}, {"nombre":"Melchor Ocampo"}, {"nombre":"Metepec"}, {"nombre":"Mexicaltzingo"}, {"nombre":"Morelos"}, {"nombre":"Naucalpan"}, {"nombre":"Nextlalpan"}
            	 	, {"nombre":"Nezahualcóyotl"}, {"nombre":"Nicolás Romero"}, {"nombre":"Nopaltepec"}, {"nombre":"Ocoyoacac"}, {"nombre":"Ocuilan"}, {"nombre":"Otumba"}, {"nombre":"Otzoloapan"}, {"nombre":"Otzolotepec"}, {"nombre":"Ozumba"}, {"nombre":"Papalotla"}, {"nombre":"Polotitlán"}, {"nombre":"Rayón"}, {"nombre":"San Antonio la Isla"}, {"nombre":"San Felipe del Progreso"}, {"nombre":"San José del Rincón"}, {"nombre":"San Martín de las Pirámides"}, {"nombre":"San Mateo Atenco"}, {"nombre":"San Simón de Guerrero"}, {"nombre":"Santo Tomás"}, {"nombre":"Soyaniquilpan"}, {"nombre":"Sultepec"}
            	 	, {"nombre":"Tecámac"}, {"nombre":"Tejupilco"}, {"nombre":"Temamatla"}, {"nombre":"Temascalapa"}, {"nombre":"Temascalcingo"}, {"nombre":"Temascaltepec"}, {"nombre":"Temoaya"}, {"nombre":"Tenancingo"}, {"nombre":"Tenango del Aire"}, {"nombre":"Tenango del Valle"}, {"nombre":"Teoloyucán"}, {"nombre":"Teotihuacán"}, {"nombre":"Tepetlaoxtoc"}, {"nombre":"Tepetlixpa"}, {"nombre":"Tepotzotlán"}, {"nombre":"Tequixquiac"}, {"nombre":"Texcaltitlán"}, {"nombre":"Texcalyacac"}, {"nombre":"Texcoco"}, {"nombre":"Tezoyuca" }
            	 	, {"nombre":"Tianguistenco"}, {"nombre":"Timilpan"}, {"nombre":"Tlalmanalco"}, {"nombre":"Tlalnepantla"}, {"nombre":"Tlatlaya"}, {"nombre":"Toluca"}, {"nombre":"Tonanitla"}, {"nombre":"Tonatico"}, {"nombre":"Tultepec"}, {"nombre":"Tultitlán"}, {"nombre":"Valle de Bravo"}, {"nombre":"Valle de Chalco"}, {"nombre":"Villa de Allende"}, {"nombre":"Villa del Carbón"}, {"nombre":"Villa Guerrero"}, {"nombre":"Villa Victoria"}, {"nombre":"Xalatlaco"}, {"nombre":"Xonacatlán"}, {"nombre":"Zacazonapan"}, {"nombre":"Zacualpan"}
            	 	, {"nombre":"Zinacantepec"}, {"nombre":"Zumpahuacán"}, {"nombre":"Zumpango"}
            		 ]},
            	{"valor": "Michoacan",
            	 "ciudades":[{"nombre":"Acuitzio"}, {"nombre":"Aguililla"}, {"nombre":"Alvaro Obregón"}, {"nombre":"Angamacutiro"}, {"nombre":"Angangueo"}, {"nombre":"Apatzingán"}, {"nombre":"Aporo"}, {"nombre":"Aquila"}, {"nombre":"Ario"}, {"nombre":"Arteaga"}, {"nombre":"Briseñas"}, {"nombre":"Buenavista"}, {"nombre":"Carácuaro"}, {"nombre":"Charapan"}, {"nombre":"Charo"}, {"nombre":"Chavinda"}, {"nombre":"Cherán"}, {"nombre":"Chilchota"}, {"nombre":"Chinicuila"}, {"nombre":"Chucándiro"}, {"nombre":"Churintzio"}
            	 	, {"nombre":"Churumuco"}, {"nombre":"Coahuayana"}, {"nombre":"Coalcomán"}, {"nombre":"Coeneo"}, {"nombre":"Cojumatlán"}, {"nombre":"Contepec"}, {"nombre":"Copándaro"}, {"nombre":"Cotija"}, {"nombre":"Cuitzeo"}, {"nombre":"Ecuandureo"}, {"nombre":"Epitacio Huerta"}, {"nombre":"Erongarícuaro"}, {"nombre":"Gabriel Zamora"}, {"nombre":"Hidalgo"}, {"nombre":"Huandacareo"}, {"nombre":"Huaniqueo"}, {"nombre":"Huetamo"}, {"nombre":"Huiramba"}, {"nombre":"Indaparapeo"}, {"nombre":"Irimbo"}, {"nombre":"Ixtlán"}
            	 	, {"nombre":"Jacona"}, {"nombre":"Jiménez"}, {"nombre":"Jiquilpan"}, {"nombre":"José Sixto Verduzco"}, {"nombre":"Juárez"}, {"nombre":"Jungapeo"}, {"nombre":"La Huacana"}, {"nombre":"La Piedad"}, {"nombre":"Lagunillas"}, {"nombre":"Lázaro Cárdenas"}, {"nombre":"Los Reyes"}, {"nombre":"Madero"}, {"nombre":"Maravatío"}, {"nombre":"Marcos Castellanos"}, {"nombre":"Morelia"}, {"nombre":"Morelos"}, {"nombre":"Múgica"}, {"nombre":"Nahuatzen"}, {"nombre":"Nocupétaro"}, {"nombre":"Nuevo Parangaricutiro"}
            	 	, {"nombre":"Nuevo Urecho"}, {"nombre":"Numarán"}, {"nombre":"Ocampo"}, {"nombre":"Pajacuarán"}, {"nombre":"Panindícuaro"}, {"nombre":"Paracho"}, {"nombre":"Parácuaro"}, {"nombre":"Pátzcuaro"}, {"nombre":"Penjamillo"}, {"nombre":"Peribán"}, {"nombre":"Purépero"}, {"nombre":"Puruándiro"}, {"nombre":"Queréndaro"}, {"nombre":"Quiroga"}, {"nombre":"Sahuayo"}, {"nombre":"Salvador Escalante"}, {"nombre":"San Lucas"}, {"nombre":"Santa Ana Maya"}, {"nombre":"Senguio"}, {"nombre":"Susupuato"}
            	 	, {"nombre":"Tacámbaro"}, {"nombre":"Tancítaro"}, {"nombre":"Tangamandapio"}, {"nombre":"Tangancícuaro"}, {"nombre":"Tanhuato"}, {"nombre":"Taretan"}, {"nombre":"Tarímbaro",}, {"nombre":"Tepalcatepec"}, {"nombre":"Tingüindín"}, {"nombre":"Tingambato"}, {"nombre":"Tiquicheo"}, {"nombre":"Tlalpujahua"}, {"nombre":"Tlazazalca"}, {"nombre":"Tocumbo"}, {"nombre":"Tumbiscatío"}, {"nombre":"Turicato"}, {"nombre":"Tuxpan"}, {"nombre":"Tuzantla"}, {"nombre":"Tzintzuntzan"}, {"nombre":"Tzitzio"}
            	 	, {"nombre":"Uruapan"}, {"nombre":"Venustiano Carranza"}, {"nombre":"Villamar"}, {"nombre":"Vista Hermosa"}, {"nombre":"Yurécuaro"}, {"nombre":"Zacapu"}, {"nombre":"Zamora"}, {"nombre":"Zináparo"}, {"nombre":"Zinapécuaro"}, {"nombre":"Ziracuaretiro"}, {"nombre":"Zitácuaro"}
            		]},
            	{"valor": "Morelos",
            	 "ciudades":[{"nombre":"Amacuzac"}, {"nombre":"Atlatlahucan"}, {"nombre":"Axochiapan"}, {"nombre":"Ayala"}, {"nombre":"Coatlán del Río"}, {"nombre":"Cuautla"}, {"nombre":"Cuernavaca"}, {"nombre":"Emiliano Zapata"}, {"nombre":"Huitzilac"}, {"nombre":"Jantetelco"}, {"nombre":"Jiutepec"}, {"nombre":"Jojutla"}, {"nombre":"Jonacatepec"}, {"nombre":"Mazatepec"}, {"nombre":"Miacatlán"}, {"nombre":"Ocuituco"}, {"nombre":"Puente de Ixtla"}, {"nombre":"Temixco"}, {"nombre":"Temoac"}, {"nombre":"Tepalcingo"}
            	 	, {"nombre":"Tepoztlán"}, {"nombre":"Tetecala"}, {"nombre":"Tetela del Volcán"}, {"nombre":"Tlalnepantla"}, {"nombre":"Tlaltizapán"}, {"nombre":"Tlaquiltenango"}, {"nombre":"Tlayacapan"}, {"nombre":"Totolapan"}, {"nombre":"Xochitepec"}, {"nombre":"Yautepec"}, {"nombre":"Yecapixtla"}, {"nombre":"Zacatepec"}, {"nombre":"Zacualpan"}
            		]},
            	{"valor": "Nayarit",
            	 "ciudades":[{"nombre":"Acaponeta"}, {"nombre":"Ahuacatlán"}, {"nombre":"Amatlán"}, {"nombre":"Bahía de Banderas"}, {"nombre":"Compostela"}, {"nombre":"Del Nayar"}, {"nombre":"Huajicori"}, {"nombre":"Ixtlán del Río"}, {"nombre":"Jala"}, {"nombre":"La Yesca"}, {"nombre":"Rosamorada"}, {"nombre":"Ruíz"}, {"nombre":"San Blas"}, {"nombre":"San Pedro Lagunillas"}, {"nombre":"Santa María del Oro"}, {"nombre":"Santiago Ixcuintla"}, {"nombre":"Tecuala"}, {"nombre":"Tepic"}, {"nombre":"Tuxpan"}, {"nombre":"Xalisco"}
            		]},
            	{"valor": "Nuevo León",
            	 "ciudades":[{"nombre":"Abasolo"}, {"nombre":"Agualeguas"}, {"nombre":"Allende"}, {"nombre":"Anáhuac"}, {"nombre":"Apodaca"}, {"nombre":"Aramberri"}, {"nombre":"Bustamante"}, {"nombre":"Cadereyta Jiménez"}, {"nombre":"Carmen"}, {"nombre":"Cerralvo"}, {"nombre":"China"}, {"nombre":"Ciénega de Flores"}, {"nombre":"Dr. Coss"}, {"nombre":"Dr. Arroyo"}, {"nombre":"Dr. González"}, {"nombre":"Galeana"}, {"nombre":"García"}, {"nombre":"Gral. Escobedo"}, {"nombre":"Gral. Terán"}, {"nombre":"Gral. Treviño"}
            	 	, {"nombre":"Gral. Zaragoza"}, {"nombre":"Gral. Zuazua"}, {"nombre":"Gral. Bravo"}, {"nombre":"Guadalupe"}, {"nombre":"Hidalgo"}, {"nombre":"Higueras"}, {"nombre":"Hualahuises"}, {"nombre":"Iturbide"}, {"nombre":"Juárez"}, {"nombre":"Lampazos de Naranjo"}, {"nombre":"Linares"}, {"nombre":"Los Aldamas"}, {"nombre":"Los Herreras"}, {"nombre":"Los Ramones"}, {"nombre":"Marín"}, {"nombre":"Melchor Ocampo"}, {"nombre":"Mier y Noriega"}, {"nombre":"Mina"}, {"nombre":"Montemorelos"}, {"nombre":"Monterrey"}
            	 	, {"nombre":"Parás"}, {"nombre":"Pesquería"}, {"nombre":"Rayones"}, {"nombre":"Sabinas Hidalgo"}, {"nombre":"Salinas Victoria"}, {"nombre":"San Nicolás de los Garza"}, {"nombre":"San Pedro Garza García"}, {"nombre":"Santa Catarina"}, {"nombre":"Santiago"}, {"nombre":"Vallecillo"}, {"nombre":"Villaldama"}
            		]},
            	{"valor": "Oaxaca",
            	 "ciudades":[{"nombre":"Abejones"}, {"nombre":"Acatlán"}, {"nombre":"Animas Trujano"}, {"nombre":"Apasco"}, {"nombre":"Asunción Cacalotepec"}, {"nombre":"Asunción Cuyotepeji"}, {"nombre":"Asunción Ixtaltepec"}, {"nombre":"Asunción Nochixtlán"}, {"nombre":"Asunción Ocotlán"}, {"nombre":"Asunción Tlacolulita"}, {"nombre":"Ayoquezco"}, {"nombre":"Ayotzintepec"}, {"nombre":"Calihualá"}, {"nombre":"Candelaria Loxicha"}, {"nombre":"Capulálpam"}, {"nombre":"Chahuites"}, {"nombre":"Chalcatongo"}, {"nombre":"Chiquihuitlán"}, {"nombre":"Ciénega de Zimatlán"}
            	 	, {"nombre":"Ciudad Ixtepec"}, {"nombre":"Coatecas Altas"}, {"nombre":"Coicoyán"}, {"nombre":"Concepción Buenavista"}, {"nombre":"Concepción Pápalo"}, {"nombre":"Constancia del Rosario"}, {"nombre":"Cosolapa"}, {"nombre":"Cosoltepec"}, {"nombre":"Cuilápam"}, {"nombre":"Cuyamecalco"}, {"nombre":"El Barrio de la Soledad"}, {"nombre":"El Espinal"}, {"nombre":"Eloxochitlán"}, {"nombre":"Fresnillo"}, {"nombre":"Guadalupe de Ramírez"}, {"nombre":"Guadalupe Etla"}, {"nombre":"Guelatao" }, {"nombre":"Guevea de Humboldt"}, {"nombre":"Ejutla de Crespo"}, {"nombre":"Huajuapan"}
            	 	, {"nombre":"Huautepec"}, {"nombre":"Huautla"}, {"nombre":"Ixpantepec Nieves"}, {"nombre":"Ixtlán de Juárez"}, {"nombre":"Jaltepec"}, {"nombre":"Juchitán"}, {"nombre":"La Compañía"}, {"nombre":"La Pe"}, {"nombre":"La Reforma"}, {"nombre":"Loma Bonita"}, {"nombre":"Mariscala de Juárez"}, {"nombre":"Mártires de Tacubaya"}, {"nombre":"Matías Romero Avendaño"}, {"nombre":"Mazatlán Villa de Flores"}, {"nombre":"Mesones Hidalgo"}, {"nombre":"Miahuatlán"}, {"nombre":"Mixistlán"}, {"nombre":"Mixtepec"}, {"nombre":"Monjas"}, {"nombre":"Natividad"}, {"nombre":"Nazareno Etla"}
            	 	, {"nombre":"Nejapa de Madero"}, {"nombre":"Nuevo Zoquiapam"}, {"nombre":"Oaxaca"}, {"nombre":"Ocotlán"}, {"nombre":"Ocotlán"}, {"nombre":"Peñasco"}, {"nombre":"Pinotepa"}, {"nombre":"Pluma Hidalgo"}, {"nombre":"Putla Villa de Guerrero"}, {"nombre":"Reforma de Pineda"}, {"nombre":"Reyes Etla"}, {"nombre":"Rojas de Cuauhtémoc"}, {"nombre":"Salina Cruz"}, {"nombre":"San Agustín Amatengo"}, {"nombre":"San Agustín Atenango"}, {"nombre":"San Agustín Chayuco"}, {"nombre":"San Agustín de las Juntas"}, {"nombre":"San Agustín Etla"}, {"nombre":"San Agustín Loxicha"}, {"nombre":"San Agustín Tlacotepec"}
            	 	, {"nombre":"San Agustín Yatareni"}, {"nombre":"San Andrés Cabecera Nueva"}, {"nombre":"San Andrés Dinicuiti"}, {"nombre":"San Andrés Huaxpaltepec"}, {"nombre":"San Andrés Huayapam"}, {"nombre":"San Andrés Ixtlahuaca"}, {"nombre":"San Andrés Lagunas"}, {"nombre":"San Andrés Nuxiño"}, {"nombre":"San Andrés Paxtlán" }, {"nombre":"San Andrés Sinaxtla"}, {"nombre":"San Andrés Solaga"}, {"nombre":"San Andrés Teotilalpam"}, {"nombre":"San Andrés Tepetlapa"}, {"nombre":"San Andrés Yaá"}, {"nombre":"San Andrés Zabache"}, {"nombre":"San Andrés Zautla"}, {"nombre":"San Antonino Castillo Velasco"}, {"nombre":"San Antonino el Alto"}, {"nombre":"San Antonino Monte Verde"}, {"nombre":"San Antonio Acutla"}
            	 	, {"nombre":"San Antonio de la Cal"}, {"nombre":"San Antonio Huitepec"}, {"nombre":"San Antonio Nanahuatípam"}, {"nombre":"San Antonio Sinicahua"}, {"nombre":"San Antonio Tepetlapa"}, {"nombre":"San Baltazar Chichicápam"}, {"nombre":"San Baltazar Loxicha"}, {"nombre":"San Baltazar Yatzachi"}, {"nombre":"San Bartolo Coyotepec"}, {"nombre":"San Bartolo Soyaltepec"}, {"nombre":"San Bartolo Yautepec"}, {"nombre":"San Bartolomé Ayautla"}, {"nombre":"San Bartolomé Loxicha"}, {"nombre":"San Bartolomé Quialana"}, {"nombre":"San Bartolomé Yucuañe"}, {"nombre":"San Bartolomé Zoogocho"}, {"nombre":"San Bernardo Mixtepec"}, {"nombre":"San Blas Atempa"}, {"nombre":"San Carlos Yautepec"}
            	 	, {"nombre":"San Cristóbal Amatlán"}, {"nombre":"San Cristóbal Amoltepec"}, {"nombre":"San Cristóbal Lachirioag"}, {"nombre":"San Cristóbal Suchixtlahuaca"}, {"nombre":"San Dionisio del Mar"}, {"nombre":"San Dionisio Ocotepec"}, {"nombre":"San Dionisio Ocotlán"}, {"nombre":"San Esteban Atatlahuca"}, {"nombre":"San Felipe Jalapa de Díaz"}, {"nombre":"San Felipe Tejalapam"}, {"nombre":"San Felipe Usila"}, {"nombre":"San Francisco Cahuacuá"}, {"nombre":"San Francisco Cajonos"}, {"nombre":"San Francisco Chapulapa"}, {"nombre":"San Francisco Chindúa" }, {"nombre":"San Francisco del Mar"}, {"nombre":"San Francisco Huehuetlán"}, {"nombre":"San Francisco Ixhuatán"}
            	 	, {"nombre":"San Francisco Jaltepetongo"}, {"nombre":"San Francisco Lachigoló"}, {"nombre":"San Francisco Logueche"}, {"nombre":"San Francisco Nuxaño"}, {"nombre":"San Francisco Ozolotepec"}, {"nombre":"San Francisco Sola"}, {"nombre":"San Francisco Telixtlahuaca"}, {"nombre":"San Francisco Teopan"}, {"nombre":"San Francisco Tlapancingo"}, {"nombre":"San Gabriel Mixtepec"}, {"nombre":"San Ildefonso Amatlán"}, {"nombre":"San Ildefonso Sola"}, {"nombre":"San Ildefonso Villa Alta"}, {"nombre":"San Jacinto Amilpas"}, {"nombre":"San Jacinto Tlacotepec"}, {"nombre":"San Jerónimo Coatlán"}, {"nombre":"San Jerónimo Silacayoapilla"}, {"nombre":"San Jerónimo Sosola"}
            	 	, {"nombre":"San Jerónimo Taviche"}, {"nombre":"San Jerónimo Tecoátl"}, {"nombre":"San Jerónimo Tlacochahuaya"}, {"nombre":"San Jorge Nuchita"}, {"nombre":"San José Ayuquila"}, {"nombre":"San José Chiltepec"}, {"nombre":"San José del Peñasco"}, {"nombre":"San José del Progreso"}, {"nombre":"San José Estancia Grande"}, {"nombre":"San José Independencia"}, {"nombre":"San José Lachiguiri"}, {"nombre":"San José Tenango"}, {"nombre":"San Juan Ñumí"}, {"nombre":"San Juan Achiutla"}, {"nombre":"San Juan Atepec"}, {"nombre":"San Juan Bautista Atatlahuca"}, {"nombre":"San Juan Bautista Coixtlahuaca"}, {"nombre":"San Juan Bautista Cuicatlán"}, {"nombre":"San Juan Bautista Guelache"}
            	 	, {"nombre":"San Juan Bautista Jayacatlán"}, {"nombre":"San Juan Bautista Lo de Soto"}, {"nombre":"San Juan Bautista Suchitepec"}, {"nombre":"San Juan Bautista Tlachichilco"}, {"nombre":"San Juan Bautista Tlacoatzintepec"}, {"nombre":"San Juan Bautista Tuxtepec"}, {"nombre":"San Juan Bautista Valle Nacional"}, {"nombre":"San Juan Cacahuatepec"}, {"nombre":"San Juan Chicomezúchil"}, {"nombre":"San Juan Chilateca"}, {"nombre":"San Juan Cieneguilla"}, {"nombre":"San Juan Coatzóspam"}, {"nombre":"San Juan Colorado"}, {"nombre":"San Juan Comaltepec"}, {"nombre":"San Juan Cotzocón"}, {"nombre":"San Juan de los Cués"}, {"nombre":"San Juan del Estado"}, {"nombre":"San Juan del Río"}
            	 	, {"nombre":"San Juan Diuxi"}, {"nombre":"San Juan Evangelista Analco"}, {"nombre":"San Juan Guelavía"}, {"nombre":"San Juan Guichicovi"}, {"nombre":"San Juan Ihualtepec"}, {"nombre":"San Juan Juquila Mixes"}, {"nombre":"San Juan Juquila Vijanos"}, {"nombre":"San Juan Lachao"}, {"nombre":"San Juan Lachigalla"}, {"nombre":"San Juan Lajarcia"}, {"nombre":"San Juan Lalana"}, {"nombre":"San Juan Mazatlán"}, {"nombre":"San Juan Mixtepec"}, {"nombre":"San Juan Mixtepec"}, {"nombre":"San Juan Ozolotepec"}, {"nombre":"San Juan Petlapa"}, {"nombre":"San Juan Quiahije"}, {"nombre":"San Juan Quiotepec"}, {"nombre":"San Juan Sayultepec"}, {"nombre":"San Juan Tabaá"}, {"nombre":"San Juan Tamazola"}
            	 	, {"nombre":"San Juan Teita"}, {"nombre":"San Juan Teitipac"}, {"nombre":"San Juan Tepeuxila"}, {"nombre":"San Juan Teposcolula"}, {"nombre":"San Juan Yaeé"}, {"nombre":"San Juan Yatzona"}, {"nombre":"San Juan Yucuita"}, {"nombre":"San Lorenzo"}, {"nombre":"San Lorenzo Albarradas"}, {"nombre":"San Lorenzo Cacaotepec"}, {"nombre":"San Lorenzo Cuaunecuiltitla"}, {"nombre":"San Lorenzo Texmelucan"}, {"nombre":"San Lorenzo Victoria"}, {"nombre":"San Lucas Camotlán"}, {"nombre":"San Lucas Ojitlán"}, {"nombre":"San Lucas Quiaviní"}, {"nombre":"San Lucas Zoquiápam"}, {"nombre":"San Luis Amatlán"}, {"nombre":"San Marcial Ozolotepec"}, {"nombre":"San Marcos Arteaga"}
            	 	, {"nombre":"San Martín de los Cansecos"}, {"nombre":"San Martín Huamelúlpam"}, {"nombre":"San Martín Itunyoso"}, {"nombre":"San Martín Lachilá"}, {"nombre":"San Martín Peras"}, {"nombre":"San Martín Tilcajete"}, {"nombre":"San Martín Toxpalan"}, {"nombre":"San Martín Zacatepec"}, {"nombre":"San Mateo Cajonos"}, {"nombre":"San Mateo del Mar"}, {"nombre":"San Mateo Etlatongo"}, {"nombre":"San Mateo Nejápam"}, {"nombre":"San Mateo Peñasco"}, {"nombre":"San Mateo Piñas"}, {"nombre":"San Mateo Río Hondo"}, {"nombre":"San Mateo Sindihui"}, {"nombre":"San Mateo Tlapiltepec"}, {"nombre":"San Mateo Yoloxochitlán"}, {"nombre":"San Melchor Betaza"}, {"nombre":"San Miguel Achiutla"}
            	 	, {"nombre":"San Miguel Ahuehuetitlán"}, {"nombre":"San Miguel Aloápam"}, {"nombre":"San Miguel Amatitlán"}, {"nombre":"San Miguel Amatlán"}, {"nombre":"San Miguel Chicahua"}, {"nombre":"San Miguel Chimalapa"}, {"nombre":"San Miguel Coatlán"}, {"nombre":"San Miguel del Puerto"}, {"nombre":"San Miguel del Río"}, {"nombre":"San Miguel Ejutla"}, {"nombre":"San Miguel el Grande"}, {"nombre":"San Miguel Huautla"}, {"nombre":"San Miguel Mixtepec"}, {"nombre":"San Miguel Panixtlahuaca"}, {"nombre":"San Miguel Peras"}, {"nombre":"San Miguel Piedras"}, {"nombre":"San Miguel Quetzaltepec"}, {"nombre":"San Miguel Santa Flor"}, {"nombre":"San Miguel Soyaltepec"}
            	 	, {"nombre":"San Miguel Suchixtepec"}, {"nombre":"San Miguel Tecomatlán"}, {"nombre":"San Miguel Tenango"}, {"nombre":"San Miguel Tequixtepec"}, {"nombre":"San Miguel Tilquiápam"}, {"nombre":"San Miguel Tlacamama"}, {"nombre":"San Miguel Tlacotepec"}, {"nombre":"San Miguel Tulancingo"}, {"nombre":"San Miguel Yotao"}, {"nombre":"San Nicolás"}, {"nombre":"San Nicolás Hidalgo"}, {"nombre":"San Pablo Coatlán"}, {"nombre":"San Pablo Cuatro Venados"}, {"nombre":"San Pablo Etla"}, {"nombre":"San Pablo Huitzo"}, {"nombre":"San Pablo Huixtepec"}, {"nombre":"San Pablo Macuiltianguis"}, {"nombre":"San Pablo Tijaltepec"}, {"nombre":"San Pablo Villa de Mitla"}
            	 	, {"nombre":"San Pablo Yaganiza"}, {"nombre":"San Pedro Amuzgos"}, {"nombre":"San Pedro Apóstol"}, {"nombre":"San Pedro Atoyac"}, {"nombre":"San Pedro Cajonos"}, {"nombre":"San Pedro Comitancillo"}, {"nombre":"San Pedro Coxcaltepec Cántaros"}, {"nombre":"San Pedro el Alto"}, {"nombre":"San Pedro Huamelula"}, {"nombre":"San Pedro Huilotepec"}, {"nombre":"San Pedro Ixcatlán"}, {"nombre":"San Pedro Ixtlahuaca"}, {"nombre":"San Pedro Jaltepetongo"}, {"nombre":"San Pedro Jicayán"}, {"nombre":"San Pedro Jocotipac"}, {"nombre":"San Pedro Juchatengo"}, {"nombre":"San Pedro Mártir"}, {"nombre":"San Pedro Mártir Quiechapa"}, {"nombre":"San Pedro Mártir Yucuxaco"}
            	 	, {"nombre":"San Pedro Mixtepec"}, {"nombre":"San Pedro Molinos"}, {"nombre":"San Pedro Nopala"}, {"nombre":"San Pedro Ocopetatillo"}, {"nombre":"San Pedro Ocotepec"}, {"nombre":"San Pedro Pochutla"}, {"nombre":"San Pedro Quiatoni"}, {"nombre":"San Pedro Sochiapam"}, {"nombre":"San Pedro Tapanatepec"}, {"nombre":"San Pedro Taviche"}, {"nombre":"San Pedro Teozacoalco"}, {"nombre":"San Pedro Teutila"}, {"nombre":"San Pedro Tidaá"}, {"nombre":"San Pedro Topiltepec"}, {"nombre":"San Pedro Totolapa"}, {"nombre":"San Pedro y San Pablo Ayutla"}, {"nombre":"San Pedro y San Pablo Teposcolula"}, {"nombre":"San Pedro y San Pablo Tequixtepec"}, {"nombre":"San Pedro Yaneri"}
            	 	, {"nombre":"San Pedro Yólox"}, {"nombre":"San Pedro Yucunama"}, {"nombre":"San Raymundo Jalpan"}, {"nombre":"San Sebastián Abasolo"}, {"nombre":"San Sebastián Coatlán"}, {"nombre":"San Sebastián Ixcapa"}, {"nombre":"San Sebastián Nicananduta"}, {"nombre":"San Sebastián Río Hondo"}, {"nombre":"San Sebastián Tecomaxtlahuaca"}, {"nombre":"San Sebastián Teitipac"}, {"nombre":"San Sebastián Tutla"}, {"nombre":"San Simón Almolongas"}, {"nombre":"San Simón Zahuatlán"}, {"nombre":"San Vicente Coatlán"}, {"nombre":"San Vicente Lachixío"}, {"nombre":"San Vicente Nuñú"}, {"nombre":"Santa Ana"}, {"nombre":"Santa Ana Ateixtlahuaca"}, {"nombre":"Santa Ana Cuauhtémoc"}
            	 	, {"nombre":"Santa Ana del Valle"}, {"nombre":"Santa Ana Tavela"}, {"nombre":"Santa Ana Tlapacoyan"}, {"nombre":"Santa Ana Yareni"}, {"nombre":"Santa Ana Zegache"}, {"nombre":"Santa Catalina Quierí"}, {"nombre":"Santa Catarina Cuixtla"}, {"nombre":"Santa Catarina Ixtepeji"}, {"nombre":"Santa Catarina Juquila"}, {"nombre":"Santa Catarina Lachatao"}, {"nombre":"Santa Catarina Loxicha"}, {"nombre":"Santa Catarina Mechoacán"}, {"nombre":"Santa Catarina Minas"}, {"nombre":"Santa Catarina Quiané"}, {"nombre":"Santa Catarina Quioquitani"}, {"nombre":"Santa Catarina Tayata"}, {"nombre":"Santa Catarina Ticuá"}, {"nombre":"Santa Catarina Yosonotú"}, {"nombre":"Santa Catarina Zapoquila"}
            	 	, {"nombre":"Santa Cruz Acatepec"}, {"nombre":"Santa Cruz Amilpas"}, {"nombre":"Santa Cruz de Bravo"}, {"nombre":"Santa Cruz Itundujia"}, {"nombre":"Santa Cruz Mixtepec"}, {"nombre":"Santa Cruz Nundaco"}, {"nombre":"Santa Cruz Papalutla"}, {"nombre":"Santa Cruz Tacache de Mina"}, {"nombre":"Santa Cruz Tacahua"}, {"nombre":"Santa Cruz Tayata"}, {"nombre":"Santa Cruz Xitla"}, {"nombre":"Santa Cruz Xoxocotlán"}, {"nombre":"Santa Cruz Zenzontepec"}, {"nombre":"Santa Gertrudis"}, {"nombre":"Santa Inés de Zaragoza"}, {"nombre":"Santa Inés del Monte"}, {"nombre":"Santa Inés Yatzeche"}, {"nombre":"Santa Lucía del Camino"}, {"nombre":"Santa Lucía Miahuatlán"}
            	 	, {"nombre":"Santa Lucía Monteverde"}, {"nombre":"Santa Lucía Ocotlán"}, {"nombre":"Santa Magdalena Jicotlán"}, {"nombre":"Santa María Alotepec"}, {"nombre":"Santa María Apazco"}, {"nombre":"Santa María Atzompa"}, {"nombre":"Santa María Camotlán"}, {"nombre":"Santa María Chachoápam"}, {"nombre":"Santa María Chilchotla"}, {"nombre":"Santa María Chimalapa"}, {"nombre":"Santa María Colotepec"}, {"nombre":"Santa María Cortijo"}, {"nombre":"Santa María Coyotepec"}, {"nombre":"Santa María del Rosario"}, {"nombre":"Santa María del Tule"}, {"nombre":"Santa María Ecatepec"}, {"nombre":"Santa María Guelacé"}, {"nombre":"Santa María Guienagati"}, {"nombre":"Santa María Huatulco"}
            	 	, {"nombre":"Santa María Huazolotitlán"}, {"nombre":"Santa María Ipalapa"}, {"nombre":"Santa María Ixcatlán"}, {"nombre":"Santa María Jacatepec"}, {"nombre":"Santa María Jalapa del Marqués"}, {"nombre":"Santa María Jaltianguis"}, {"nombre":"Santa María la Asunción"}, {"nombre":"Santa María Lachixío"}, {"nombre":"Santa María Mixtequilla"}, {"nombre":"Santa María Nativitas"}, {"nombre":"Santa María Nduayaco"}, {"nombre":"Santa María Ozolotepec"}, {"nombre":"Santa María Pápalo"}, {"nombre":"Santa María Peñoles"}, {"nombre":"Santa María Petapa"}, {"nombre":"Santa María Quiegolani"}, {"nombre":"Santa María Sola"}, {"nombre":"Santa María Tataltepec"}, {"nombre":"Santa María Tecomavaca"}
            	 	, {"nombre":"Santa María Temaxcalapa"}, {"nombre":"Santa María Temaxcaltepec"}, {"nombre":"Santa María Teopoxco"}, {"nombre":"Santa María Tepantlali"}, {"nombre":"Santa María Texcatitlán"}, {"nombre":"Santa María Tlahuitoltepec"}, {"nombre":"Santa María Tlalixtac"}, {"nombre":"Santa María Tonameca"}, {"nombre":"Santa María Totolapilla"}, {"nombre":"Santa María Xadani"}, {"nombre":"Santa María Yalina"}, {"nombre":"Santa María Yavesía"}, {"nombre":"Santa María Yolotepec"}, {"nombre":"Santa María Yosoyúa"}, {"nombre":"Santa María Yucuhiti"}, {"nombre":"Santa María Zacatepec"}, {"nombre":"Santa María Zaniza"}, {"nombre":"Santa María Zoquitlán"}, {"nombre":"Santiago Amoltepec"}
            	 	, {"nombre":"Santiago Apoala"}, {"nombre":"Santiago Apóstol"}, {"nombre":"Santiago Astata"}, {"nombre":"Santiago Atitlán"}, {"nombre":"Santiago Ayuquililla"}, {"nombre":"Santiago Cacaloxtepec"}, {"nombre":"Santiago Camotlán"}, {"nombre":"Santiago Chazumba"}, {"nombre":"Santiago Choapam"}, {"nombre":"Santiago Comaltepec"}, {"nombre":"Santiago del Río"}, {"nombre":"Santiago Huajolotitlán"}, {"nombre":"Santiago Huauclilla"}, {"nombre":"Santiago Ihuitlán Plumas"}, {"nombre":"Santiago Ixcuintepec"}, {"nombre":"Santiago Ixtayutla"}, {"nombre":"Santiago Jamiltepec"}, {"nombre":"Santiago Jocotepec"}, {"nombre":"Santiago Juxtlahuaca"}, {"nombre":"Santiago Lachiguiri"}
            	 	, {"nombre":"Santiago Lalopa"}, {"nombre":"Santiago Laollaga"}, {"nombre":"Santiago Laxopa"}, {"nombre":"Santiago Llano Grande"}, {"nombre":"Santiago Matatlán"}, {"nombre":"Santiago Miltepec"}, {"nombre":"Santiago Minas"}, {"nombre":"Santiago Nacaltepec"}, {"nombre":"Santiago Nejapilla"}, {"nombre":"Santiago Niltepec"}, {"nombre":"Santiago Nundiche"}, {"nombre":"Santiago Nuyoó"}, {"nombre":"Santiago Pinotepa Nacional"}, {"nombre":"Santiago Suchilquitongo"}, {"nombre":"Santiago Tamazola"}, {"nombre":"Santiago Tapextla"}, {"nombre":"Santiago Tenango"}, {"nombre":"Santiago Tepetlapa"}, {"nombre":"Santiago Tetepec"}, {"nombre":"Santiago Texcalcingo"}
            	 	, {"nombre":"Santiago Textitlán"}, {"nombre":"Santiago Tilantongo"}, {"nombre":"Santiago Tillo"}, {"nombre":"Santiago Tlazoyaltepec"}, {"nombre":"Santiago Xanica"}, {"nombre":"Santiago Xiacuí"}, {"nombre":"Santiago Yaitepec"}, {"nombre":"Santiago Yaveo"}, {"nombre":"Santiago Yolomécatl"}, {"nombre":"Santiago Yosondúa"}, {"nombre":"Santiago Yucuyachi"}, {"nombre":"Santiago Zacatepec"}, {"nombre":"Santiago Zoochila"}, {"nombre":"Santo Domingo Albarradas"}, {"nombre":"Santo Domingo Armenta"}, {"nombre":"Santo Domingo Chihuitán"}, {"nombre":"Santo Domingo de Morelos"}, {"nombre":"Santo Domingo Ingenio"}, {"nombre":"Santo Domingo Ixcatlán"}, {"nombre":"Santo Domingo Nuxaá"}
            	 	, {"nombre":"Santo Domingo Ozolotepec"}, {"nombre":"Santo Domingo Petapa"}, {"nombre":"Santo Domingo Roayaga"}, {"nombre":"Santo Domingo Tehuantepec"}, {"nombre":"Santo Domingo Teojomulco"}, {"nombre":"Santo Domingo Tepuxtepec"}, {"nombre":"Santo Domingo Tlatayápam"}, {"nombre":"Santo Domingo Tomaltepec"}, {"nombre":"Santo Domingo Tonalá"}, {"nombre":"Santo Domingo Tonaltepec"}, {"nombre":"Santo Domingo Xagacía"}, {"nombre":"Santo Domingo Yanhuitlán"}, {"nombre":"Santo Domingo Yodohino"}, {"nombre":"Santo Domingo Zanatepec"}, {"nombre":"Santo Tomás Jalieza"}, {"nombre":"Santo Tomás Mazaltepec"}, {"nombre":"Santo Tomás Ocotepec"}, {"nombre":"Santo Tomás Tamazulapan"}
            	 	, {"nombre":"Santos Reyes Nopala"}, {"nombre":"Santos Reyes Pápalo"}, {"nombre":"Santos Reyes Tepejillo"}, {"nombre":"Santos Reyes Yucuná"}, {"nombre":"Silacayoápam"}, {"nombre":"Sitio de Xitlapehua"}, {"nombre":"Soledad Etla"}, {"nombre":"Tamazulapam"}, {"nombre":"Tanetze"}, {"nombre":"Taniche"}, {"nombre":"Tataltepec"}, {"nombre":"Teococuilco"}, {"nombre":"Teotitlán de Flores Magón"}, {"nombre":"Teotitlán del Valle"}, {"nombre":"Teotongo"}, {"nombre":"Tepelmeme"}, {"nombre":"Tezoatlán"}, {"nombre":"Tlacolula"}, {"nombre":"Teitipac"}, {"nombre":"Tequisistlán"}, {"nombre":"Tlacotepec"}, {"nombre":"Tlacotepec Plumas"}, {"nombre":"Tlaxiaco"}, {"nombre":"Tlalixtac de Cabrera"}
            	 	, {"nombre":"Totontepec"}, {"nombre":"Trinidad Zaachila"}, {"nombre":"Unión Hidalgo"}, {"nombre":"Valerio Trujano"}, {"nombre":"Villa de Chilapa de Díaz"}, {"nombre":"Villa de Etla"}, {"nombre":"Villa de Tamazulápam"}, {"nombre":"Villa de Tututepec"}, {"nombre":"Villa de Zaachila"}, {"nombre":"Villa Díaz Ordaz"}, {"nombre":"Villa Hidalgo"}, {"nombre":"Villa Sola de Vega"}, {"nombre":"Villa Talea de Castro"}, {"nombre":"Villa Tejúpam de la Unión"}, {"nombre":"Vista Hermosa"}, {"nombre":"Yaxe"}, {"nombre":"Yodocono"}, {"nombre":"Yogana"}, {"nombre":"Yutanduchi de Guerrero"}, {"nombre":"Zahuatlán"}, {"nombre":"Zapotitlán del Río"}, {"nombre":"Zapotitlán Lagunas"}
            	 	, {"nombre":"Zapotitlán Palmas"}, {"nombre":"Zimatlán de Alvarez"}
            		]},
                  {"valor": "Puebla",
                   "ciudades":[{"nombre":"Acajete"}, {"nombre":"Acateno"}, {"nombre":"Acatlán"}, {"nombre":"Acatzingo"}, {"nombre":"Acteopan"}, {"nombre":"Ahuacatlán"}, {"nombre":"Ahuatlán"}, {"nombre":"Ahuazotepec"}, {"nombre":"Ahuehuetitla"}, {"nombre":"Ajalpan"}, {"nombre":"Albino Zertuche"}, {"nombre":"Aljojuca"}, {"nombre":"Altepexi"}, {"nombre":"Amixtlán"}, {"nombre":"Amozoc"}, {"nombre":"Aquixtla"}, {"nombre":"Atempan"}, {"nombre":"Atexcal"}, {"nombre":"Atlequizayan"}, {"nombre":"Atlixco"}, {"nombre":"Atoyatempan"}, {"nombre":"Atzala"}, {"nombre":"Atzitzihuacán"}, {"nombre":"Atzitzintla"}, {"nombre":"Axutla"}, {"nombre":"Ayotoxco de Guerrero"}, {"nombre":"Calpan"}
                       	, {"nombre":"Caltepec"}, {"nombre":"Camocuautla"}, {"nombre":"Cañada Morelos"}, {"nombre":"Caxhuacan"}, {"nombre":"Chalchicomula"}, {"nombre":"Chapulco"}, {"nombre":"Chiautla"}, {"nombre":"Chiautzingo"}, {"nombre":"Chichiquila"}, {"nombre":"Chiconcuautla"}, {"nombre":"Chietla"}, {"nombre":"Chigmecatitlán"}, {"nombre":"Chignahuapan"}, {"nombre":"Chignautla"}, {"nombre":"Chila"}, {"nombre":"Chila de la Sal"}, {"nombre":"Chilchotla"}, {"nombre":"Chinantla"}, {"nombre":"Coatepec"}, {"nombre":"Coatzingo"}, {"nombre":"Cohetzala"}, {"nombre":"Cohuecán"}, {"nombre":"Coronango"}, {"nombre":"Coxcatlán"}, {"nombre":"Coyomeapan"}, {"nombre":"Coyotepec"}
                       	, {"nombre":"Cuapiaxtla de Madero"}, {"nombre":"Cuautempan"}, {"nombre":"Cuautinchán"}, {"nombre":"Cuautlancingo"}, {"nombre":"Cuayuca de Andrade"}, {"nombre":"Cuetzalan del Progreso"}, {"nombre":"Cuyoaco"}, {"nombre":"Domingo Arenas"}, {"nombre":"Eloxochitlán"}, {"nombre":"Epatlán"}, {"nombre":"Esperanza"}, {"nombre":"Francisco Z. Mena"}, {"nombre":"General Felipe Angeles"}, {"nombre":"Guadalupe"}, {"nombre":"Guadalupe Victoria"}, {"nombre":"Hermenegildo Galeana"}, {"nombre":"Honey"}, {"nombre":"Huaquechula"}, {"nombre":"Huatlatlauca"}, {"nombre":"Huauchinango"}, {"nombre":"Huehuetla"}, {"nombre":"Huehuetlán el Chico"}, {"nombre":"Huehuetlán el Grande"}
                       	, {"nombre":"Huejotzingo"}, {"nombre":"Hueyapan"}, {"nombre":"Hueytamalco"}, {"nombre":"Hueytlalpan"}, {"nombre":"Huitzilan"}, {"nombre":"Huitziltepec"}, {"nombre":"Ixcamilpa"}, {"nombre":"Ixcaquixtla"}, {"nombre":"Ixtacamaxtitlán"}, {"nombre":"Ixtepec"}, {"nombre":"Izúcar"}, {"nombre":"Jalpan"}, {"nombre":"Jolalpan"}, {"nombre":"Jonotla"}, {"nombre":"Jopala"}, {"nombre":"Juan C. Bonilla"}, {"nombre":"Juan Galindo"}, {"nombre":"Juan N. Méndez"}, {"nombre":"La Magdalena Tlatlauquitepec"}, {"nombre":"Lafragua"}, {"nombre":"Libres"}, {"nombre":"Los Reyes de Juárez"}, {"nombre":"Mazapiltepec"}, {"nombre":"Mixtla"}, {"nombre":"Molcaxac"}, {"nombre":"Naupan"}
                       	, {"nombre":"Nauzontla"}, {"nombre":"Nealtican"}, {"nombre":"Nicolás Bravo"}, {"nombre":"Nopalucan"}, {"nombre":"Ocotepec"}, {"nombre":"Ocoyucan"}, {"nombre":"Olintla"}, {"nombre":"Oriental"}, {"nombre":"Pahuatlán"}, {"nombre":"Palmar de Bravo"}, {"nombre":"Pantepec"}, {"nombre":"Petlalcingo"}, {"nombre":"Piaxtla"}, {"nombre":"Puebla"}, {"nombre":"Quecholac"}, {"nombre":"Quimixtlán"}, {"nombre":"Rafael Lara Grajales"}, {"nombre":"San Andrés Cholula"}, {"nombre":"San Antonio Cañada"}, {"nombre":"San Diego la Mesa Tochimiltzingo"}, {"nombre":"San Felipe Teotlalcingo"}, {"nombre":"San Felipe Tepatlán"}, {"nombre":"San Gabriel Chilac"}, {"nombre":"San Gregorio Atzompa"}
                       	, {"nombre":"San Jerónimo Tecuanipan"}, {"nombre":"San Jerónimo Xayacatlán"}, {"nombre":"San José Chiapa"}, {"nombre":"San José Miahuatlán"}, {"nombre":"San Juan Atenco"}, {"nombre":"San Juan Atzompa"}, {"nombre":"San Martín Texmelucan"}, {"nombre":"San Martín Totoltepec"}, {"nombre":"San Matías Tlalancaleca"}, {"nombre":"San Miguel Ixitlán"}, {"nombre":"San Miguel Xoxtla"}, {"nombre":"San Nicolás Buenos Aires"}, {"nombre":"San Nicolás de los Ranchos"}, {"nombre":"San Pablo Anicano"}, {"nombre":"San Pedro Cholula"}, {"nombre":"San Pedro Yeloixtlahuaca"}, {"nombre":"San Salvador el Seco"}, {"nombre":"San Salvador el Verde"}, {"nombre":"San Salvador Huixcolotla"}
                       	, {"nombre":"San Sebastián Tlacotepec"}, {"nombre":"Santa Catarina Tlaltempan"}, {"nombre":"Santa Inés Ahuatempan"}, {"nombre":"Santa Isabel Cholula"}, {"nombre":"Santiago Miahuatlán"}, {"nombre":"Santo Tomás Hueyotlipan"}, {"nombre":"Soltepec"}, {"nombre":"Tecali de Herrera"}, {"nombre":"Tecamachalco"}, {"nombre":"Tecomatlán"}, {"nombre":"Tehuacán"}, {"nombre":"Tehuitzingo"}, {"nombre":"Tenampulco"}, {"nombre":"Teopantlán"}, {"nombre":"Teotlalco"}, {"nombre":"Tepanco de López"}, {"nombre":"Tepango de Rodríguez"}, {"nombre":"Tepatlaxco"}, {"nombre":"Tepeaca"}, {"nombre":"Tepemaxalco"}, {"nombre":"Tepeojuma"}, {"nombre":"Tepetzintla"}, {"nombre":"Tepexco"}
                       	, {"nombre":"Tepexi de Rodríguez"}, {"nombre":"Tepeyahualco"}, {"nombre":"Tepeyahualco"}, {"nombre":"Tetela"}, {"nombre":"Teteles"}, {"nombre":"Teziutlán"}, {"nombre":"Tianguismanalco"}, {"nombre":"Tilapa"}, {"nombre":"Tlachichuca"}, {"nombre":"Tlacotepec"}, {"nombre":"Tlacuilotepec"}, {"nombre":"Tlahuapan"}, {"nombre":"Tlaltenango"}, {"nombre":"Tlanepantla"}, {"nombre":"Tlaola"}, {"nombre":"Tlapacoya"}, {"nombre":"Tlapanalá"}, {"nombre":"Tlatlauquitepec"}, {"nombre":"Tlaxco"}, {"nombre":"Tochimilco"}, {"nombre":"Tochtepec"}, {"nombre":"Totoltepec"}, {"nombre":"Tulcingo"}, {"nombre":"Tuzamapan"}, {"nombre":"Tzicatlacoyan"}, {"nombre":"Venustiano Carranza"}
                       	, {"nombre":"Vicente Guerrero"}, {"nombre":"Xayacatlán de Bravo"}, {"nombre":"Xicotepec"}, {"nombre":"Xicotlán"}, {"nombre":"Xiutetelco"}, {"nombre":"Xochiapulco"}, {"nombre":"Xochiltepec"}, {"nombre":"Xochitlán de Vicente Suárez"}, {"nombre":"Xochitlán Todos Santos"}, {"nombre":"Yaonáhuac"}, {"nombre":"Yehualtepec"}, {"nombre":"Zacapala"}, {"nombre":"Zacapoaxtla"}, {"nombre":"Zacatlán"}, {"nombre":"Zapotitlán"}, {"nombre":"Zapotitlán de Méndez"}, {"nombre":"Zaragoza"}, {"nombre":"Zautla"}, {"nombre":"Zihuateutla"}, {"nombre":"Zinacatepec"}, {"nombre":"Zongozotla"}, {"nombre":"Zoquiapan"}, {"nombre":"Zoquitlán"}
                       	]},
                  {"valor": "Querétaro",
                   "ciudades":[{"nombre":"Amealco de Bonfil"}, {"nombre":"Arroyo Seco"}, {"nombre":"Cadereyta de Montes"}, {"nombre":"Colón"}, {"nombre":"Corregidora"}, {"nombre":"El Marqués"}, {"nombre":"Ezequiel Montes"}, {"nombre":"Huimilpan"}, {"nombre":"Jalpan de Serra"}, {"nombre":"Landa de Matamoros"}, {"nombre":"Pedro Escobedo"}, {"nombre":"Peñamiller"}, {"nombre":"Pinal de Amoles"}, {"nombre":"Querétaro"}, {"nombre":"San Joaquín"}, {"nombre":"San Juan del Río"}, {"nombre":"Tequisquiapan"}, {"nombre":"Tolimán"}
            		]},
            	{"valor": "Quintana Roo",
            	 "ciudades":[{"nombre":"Cozumel"}, {"nombre":"José María Morelos"}, {"nombre":"Felipe Carrillo Puerto"}, {"nombre":"Lázaro Cárdenas"}, {"nombre":"Isla Mujeres"}, {"nombre":"Solidaridad"}, {"nombre":"Othón P. Blanco"}, {"nombre":"Tulum"}, {"nombre":"Benito Juárez"}, {"nombre":"Bacalar"}
            		]},
            	{"valor": "San Luis Potosí",
            	 "ciudades":[{"nombre":"Ahualulco"}, {"nombre":"Alaquines"}, {"nombre":"Aquismón"}, {"nombre":"Armadillo de los Infante"}, {"nombre":"Axtla de Terrazas"}, {"nombre":"Cárdenas"}, {"nombre":"Catorce"}, {"nombre":"Cedral"}, {"nombre":"Cerritos"}, {"nombre":"Cerro de San Pedro"}, {"nombre":"Charcas"}, {"nombre":"Ciudad del Maíz"}, {"nombre":"Ciudad Fernández"}, {"nombre":"Ciudad Valles"}, {"nombre":"Coxcatlán"}, {"nombre":"Ebano"}, {"nombre":"El Naranjo"}, {"nombre":"Guadalcázar"}, {"nombre":"Huehuetlán"}, {"nombre":"Lagunillas"}, {"nombre":"Matehuala"}
            		, {"nombre":"Matlapa"}, {"nombre":"Mexquitic"}, {"nombre":"Moctezuma"}, {"nombre":"Rayón"}, {"nombre":"Rioverde"}, {"nombre":"Salinas"}, {"nombre":"San Antonio"}, {"nombre":"San Ciro de Acosta"}, {"nombre":"San Luis Potosí"}, {"nombre":"San Martín Chalchicuautla"}, {"nombre":"San Nicolás Tolentino"}, {"nombre":"San Vicente Tancuayalab"}, {"nombre":"Santa Catarina"}, {"nombre":"Santa María del Río"}, {"nombre":"Santo Domingo"}, {"nombre":"Soledad de Graciano Sánchez"}, {"nombre":"Tamasopo"}, {"nombre":"Tamazunchale"}, {"nombre":"Tampacán"}, {"nombre":"Tampamolón Corona"}
            		, {"nombre":"Tamuín"}, {"nombre":"Tancanhuitz"}, {"nombre":"Tanlajás"}, {"nombre":"Tanquián"}, {"nombre":"Tierra Nueva"}, {"nombre":"Vanegas"}, {"nombre":"Venado"}, {"nombre":"Villa de Arista"}, {"nombre":"Villa de Arriaga"}, {"nombre":"Villa de Guadalupe"}, {"nombre":"Villa de la Paz"}, {"nombre":"Villa de Ramos"}, {"nombre":"Villa de Reyes"}, {"nombre":"Villa Hidalgo"}, {"nombre":"Villa Juárez"}, {"nombre":"Xilitla"}, {"nombre":"Zaragoza"}
            		]},
            	{"valor": "Sinaloa",
            	 "ciudades":[{"nombre":"Ahome"}, {"nombre":"Angostura"}, {"nombre":"Badiraguato"}, {"nombre":"Choix"}, {"nombre":"Concordia"}, {"nombre":"Cosalá"}, {"nombre":"Culiacán"}, {"nombre":"El Fuerte"}, {"nombre":"Elota"}, {"nombre":"Escuinapa"}, {"nombre":"Guasave"}, {"nombre":"Mazatlán"}, {"nombre":"Mocorito"}, {"nombre":"Navolato"}, {"nombre":"Rosario"}, {"nombre":"Salvador Alvarado"}, {"nombre":"San Ignacio"}, {"nombre":"Sinaloa"}
            	      ]},
            	{"valor": "Sonora",
            	 "ciudades":[{"nombre":"Aconchi"}, {"nombre":"Agua Prieta"}, {"nombre":"Alamos"}, {"nombre":"Altar"}, {"nombre":"Arivechi"}, {"nombre":"Arizpe"}, {"nombre":"Atil"}, {"nombre":"Bacadéhuachi"}, {"nombre":"Bacanora"}, {"nombre":"Bacerac"}, {"nombre":"Bacoachi"}, {"nombre":"Bácum"}, {"nombre":"Banámichi" }, {"nombre":"Baviácora"}, {"nombre":"Bavispe"}, {"nombre":"Benito Juárez"}, {"nombre":"Benjamín Hill"}, {"nombre":"Caborca"}, {"nombre":"Cajeme"}, {"nombre":"Cananea"}, {"nombre":"Carbó"}
            		, {"nombre":"Cucurpe"}, {"nombre":"Cumpas"}, {"nombre":"Divisaderos"}, {"nombre":"Empalme"}, {"nombre":"Etchojoa" }, {"nombre":"Fronteras"}, {"nombre":"General Plutarco Elías Calles"}, {"nombre":"Granados"}, {"nombre":"Guaymas"}, {"nombre":"Hermosillo"}, {"nombre":"Nogales"}, {"nombre":"Huachinera"}, {"nombre":"Huásabas"}, {"nombre":"Huatabampo"}, {"nombre":"Huépac"}, {"nombre":"Imuris"}, {"nombre":"La Colorada"}, {"nombre":"Magdalena"}, {"nombre":"Mazatán"}, {"nombre":"Moctezuma"}
            		, {"nombre":"Naco"}, {"nombre":"Nácori Chico"}, {"nombre":"Nacozari de García"}, {"nombre":"Navojoa"}, {"nombre":"Onavas"}, {"nombre":"Opodepe"}, {"nombre":"Oquitoa"}, {"nombre":"Pitiquito"}, {"nombre":"Puerto Peñasco"}, {"nombre":"Quiriego"}, {"nombre":"Rayón"}, {"nombre":"Rosario"}, {"nombre":"Sahuaripa"}, {"nombre":"San Felipe de Jesús"}, {"nombre":"San Ignacio Río Muerto"}, {"nombre":"San Javier"}, {"nombre":"San Luis Río Colorado"}, {"nombre":"San Miguel de Horcasitas"}, {"nombre":"San Pedro de la Cueva"}, {"nombre":"Santa Ana"}
            		, {"nombre":"Santa Cruz"}, {"nombre":"Sáric"}, {"nombre":"Soyopa"}, {"nombre":"Suaqui Grande"}, {"nombre":"Tepache"}, {"nombre":"Trincheras"}, {"nombre":"Tubutama"}, {"nombre":"Ures"}, {"nombre":"Villa Hidalgo"}, {"nombre":"Villa Pesqueira"}, {"nombre":"Yécora"}
            		]},
            	{"valor": "Tabasco",
            	 "ciudades":[{"nombre":"Balancán"}, {"nombre":"Cárdenas"}, {"nombre":"Centla"}, {"nombre":"Centro"}, {"nombre":"Comalcalco"}, {"nombre":"Cunduacán"}, {"nombre":"Emiliano Zapata"}, {"nombre":"Huimanguillo"}, {"nombre":"Jalapa"}, {"nombre":"Jalpa de Méndez"}, {"nombre":"Jonuta" }, {"nombre":"Macuspana"}, {"nombre":"Nacajuca"}, {"nombre":"Paraíso"}, {"nombre":"Tacotalpa"}, {"nombre":"Teapa"}, {"nombre":"Tenosique"}
            	      ]},
            	{"valor": "Tamaulipas",
            	 "ciudades":[{"nombre":"Abasolo"}, {"nombre":"Aldama"}, {"nombre":"Altamira"}, {"nombre":"Antiguo Morelos"}, {"nombre":"Burgos"}, {"nombre":"Bustamante"}, {"nombre":"Camargo"}, {"nombre":"Casas"}, {"nombre":"Ciudad Madero"}, {"nombre":"Cruillas"}, {"nombre":"El Mante"}, {"nombre":"Güémez"}, {"nombre":"Gómez Farías"}, {"nombre":"González"}, {"nombre":"Guerrero"}, {"nombre":"Gustavo Díaz Ordaz"}, {"nombre":"Hidalgo"}, {"nombre":"Jaumave"}, {"nombre":"Jiménez"}, {"nombre":"Llera"}, {"nombre":"Mainero"}
            		, {"nombre":"Matamoros"}, {"nombre":"Méndez"}, {"nombre":"Mier"}, {"nombre":"Miguel Alemán"}, {"nombre":"Miquihuana"}, {"nombre":"Nuevo Laredo"}, {"nombre":"Nuevo Morelos" }, {"nombre":"Ocampo"}, {"nombre":"Padilla"}, {"nombre":"Palmillas"}, {"nombre":"Reynosa"}, {"nombre":"Río Bravo"}, {"nombre":"San Carlos"}, {"nombre":"San Fernando"}, {"nombre":"San Nicolás"}, {"nombre":"Soto la Marina"}, {"nombre":"Tampico"}, {"nombre":"Tula"}, {"nombre":"Valle Hermoso"}, {"nombre":"Victoria"}
            		, {"nombre":"Villagrán"}, {"nombre":"Xicoténcatl"}
            		]},
            	{"valor": "Tlaxcala",
            	 "ciudades":[{"nombre":"Acuamanala"}, {"nombre":"Altzayanca"}, {"nombre":"Amaxac de Guerrero"}, {"nombre":"Apetatitlán"}, {"nombre":"Apizaco"}, {"nombre":"Atlangatepec"}, {"nombre":"Benito Juárez"}, {"nombre":"Calpulalpan"}, {"nombre":"Chiautempan"}, {"nombre":"Contla"}, {"nombre":"Cuapiaxtla"}, {"nombre":"Cuaxomulco"}, {"nombre":"El Carmen Tequexquitla"}, {"nombre":"Emiliano Zapata"}, {"nombre":"Españita"}, {"nombre":"Huamantla"}, {"nombre":"Hueyotlipan"}, {"nombre":"Ixtacuixtla"}, {"nombre":"Ixtenco"}, {"nombre":"La Magdalena Tlaltelulco"}, {"nombre":"Lázaro Cárdenas"}
            		, {"nombre":"Mazatecochco"}, {"nombre":"Muñoz de Domingo Arenas"}, {"nombre":"Nanacamilpa"}, {"nombre":"Natívitas"}, {"nombre":"Panotla"}, {"nombre":"Papalotla"}, {"nombre":"San Damián Texoloc"}, {"nombre":"San Francisco Tetlanohcan"}, {"nombre":"San Jerónimo Zacualpan"}, {"nombre":"San José Teacalco"}, {"nombre":"San Juan Huactzinco"}, {"nombre":"San Lorenzo Axocomanitla"}, {"nombre":"San Lucas Tecopilco"}, {"nombre":"San Pablo del Monte"}, {"nombre":"Sanctórum"}, {"nombre":"Santa Ana Nopalucan"}, {"nombre":"Santa Apolonia Teacalco"}, {"nombre":"Santa Catarina Ayometla"}
            		, {"nombre":"Santa Cruz Quilehtla"}, {"nombre":"Santa Cruz Tlaxcala"}, {"nombre":"Santa Isabel Xiloxoxtla"}, {"nombre":"Tenancingo"}, {"nombre":"Teolocholco"}, {"nombre":"Tepetitla"}, {"nombre":"Tepeyanco"}, {"nombre":"Terrenate"}, {"nombre":"Tetla"}, {"nombre":"Tetlatlahuca"}, {"nombre":"Tlaxcala"}, {"nombre":"Tlaxco"}, {"nombre":"Tocatlán"}, {"nombre":"Totolac"}, {"nombre":"Tzompantepec"}, {"nombre":"Xaloztoc"}, {"nombre":"Xaltocan"}, {"nombre":"Xicohtzinco"}, {"nombre":"Yauhquemecan"}, {"nombre":"Zacatelco"}, {"nombre":"Zitlaltepec"}
            		]},
            	{"valor": "Veracruz",
            	 "ciudades":[{"nombre":"Acajete"}, {"nombre":"Acatlán"}, {"nombre":"Acayucan"}, {"nombre":"Actopan"}, {"nombre":"Acula"}, {"nombre":"Acultzingo"}, {"nombre":"Agua Dulce"}, {"nombre":"Alpatláhuac"}, {"nombre":"Alto Lucero"}, {"nombre":"Altotonga"}, {"nombre":"Alvarado"}, {"nombre":"Amatitlán" }, {"nombre":"Amatlán"}, {"nombre":"Angel R. Cabada"}, {"nombre":"Apazapan"}, {"nombre":"Aquila"}, {"nombre":"Astacinga"}, {"nombre":"Atlahuilco"}, {"nombre":"Atoyac"}, {"nombre":"Atzacan"}
            		, {"nombre":"Atzalan"}, {"nombre":"Ayahualulco"}, {"nombre":"Banderilla"}, {"nombre":"Benito Juárez"}, {"nombre":"Boca del Río"}, {"nombre":"Calcahualco"}, {"nombre":"Camarón de Tejeda"}, {"nombre":"Camerino Z. Mendoza"}, {"nombre":"Carlos A. Carrillo"}, {"nombre":"Carrillo Puerto"}, {"nombre":"Castillo de Teayo"}, {"nombre":"Catemaco"}, {"nombre":"Cazones"}, {"nombre":"Cerro Azul"}, {"nombre":"Chacaltianguis"}, {"nombre":"Chalma"}, {"nombre":"Chiconamel"}, {"nombre":"Chiconquiaco"}, {"nombre":"Chicontepec"}, {"nombre":"Chinameca"}
            		, {"nombre":"Chinampa"}, {"nombre":"Chocamán"}, {"nombre":"Chontla"}, {"nombre":"Chumatlán"}, {"nombre":"Citlaltépetl" }, {"nombre":"Coacoatzintla"}, {"nombre":"Coahuitlán"}, {"nombre":"Coatepec"}, {"nombre":"Coatzacoalcos"}, {"nombre":"Coatzintla"}, {"nombre":"Coetzala"}, {"nombre":"Colipa"}, {"nombre":"Comapa"}, {"nombre":"Córdoba"}, {"nombre":"Cosamaloapan"}, {"nombre":"Cosautlán"}, {"nombre":"Coscomatepec"}, {"nombre":"Cosoleacaque"}, {"nombre":"Cotaxtla"}, {"nombre":"Coxquihui"}, {"nombre":"Coyutla"}
            		, {"nombre":"Cuichapa"}, {"nombre":"Cuitláhuac"}, {"nombre":"El Higo"}, {"nombre":"Emiliano Zapata"}, {"nombre":"Espinal"}, {"nombre":"Filomeno Mata"}, {"nombre":"Fortín"}, {"nombre":"Gutiérrez Zamora"}, {"nombre":"Hidalgotitlán"}, {"nombre":"Huatusco"}, {"nombre":"Huayacocotla"}, {"nombre":"Hueyapan"}, {"nombre":"Huiloapan"}, {"nombre":"Ignacio de la Llave"}, {"nombre":"Ilamatlán"}, {"nombre":"Isla"}, {"nombre":"Ixcatepec"}, {"nombre":"Ixhuacán"}, {"nombre":"Ixhuatlán de Madero"}, {"nombre":"Ixhuatlán del Café"}
            		, {"nombre":"Ixhuatlán del Sureste"}, {"nombre":"Ixhuatlancillo"}, {"nombre":"Ixmatlahuacan"}, {"nombre":"Ixtaczoquitlán"}, {"nombre":"Jalacingo"}, {"nombre":"Jalcomulco"}, {"nombre":"Jáltipan"}, {"nombre":"Jamapa"}, {"nombre":"Jesús Carranza"}, {"nombre":"Jilotepec"}, {"nombre":"José Azueta"}, {"nombre":"Juan Rodríguez Clara"}, {"nombre":"Juchique de Ferrer"}, {"nombre":"La Antigua"}, {"nombre":"La Perla"}, {"nombre":"Landero y Coss"}, {"nombre":"Las Choapas"}, {"nombre":"Las Minas"}, {"nombre":"Las Vigas de Ramírez"}, {"nombre":"Lerdo de Tejada"}
            		, {"nombre":"Los Reyes"}, {"nombre":"Magdalena"}, {"nombre":"Maltrata"}, {"nombre":"Manlio Fabio Altamirano"}, {"nombre":"Mariano Escobedo"}, {"nombre":"Martínez de la Torre"}, {"nombre":"Mecatlán"}, {"nombre":"Mecayapan"}, {"nombre":"Medellín"}, {"nombre":"Miahuatlán"}, {"nombre":"Minatitlán"}, {"nombre":"Misantla"}, {"nombre":"Mixtla de Altamirano"}, {"nombre":"Moloacán"}, {"nombre":"Nanchital"}, {"nombre":"Naolinco"}, {"nombre":"Naranjal"}, {"nombre":"Naranjos Amatlán"}, {"nombre":"Nautla"}, {"nombre":"Nogales"}
            		, {"nombre":"Oluta"}, {"nombre":"Omealca"}, {"nombre":"Orizaba"}, {"nombre":"Otatitlán"}, {"nombre":"Oteapan"}, {"nombre":"Ozuluama"}, {"nombre":"Pajapan"}, {"nombre":"Pánuco"}, {"nombre":"Papantla"}, {"nombre":"Paso de Ovejas"}, {"nombre":"Paso del Macho"}, {"nombre":"Perote"}, {"nombre":"Platón Sánchez"}, {"nombre":"Playa Vicente"}, {"nombre":"Poza Rica"}, {"nombre":"Pueblo Viejo"}, {"nombre":"Puente Nacional"}, {"nombre":"Rafael Delgado"}, {"nombre":"Rafael Lucio"}, {"nombre":"Río Blanco"}
            		, {"nombre":"Saltabarranca"}, {"nombre":"San Andrés Tenejapan"}, {"nombre":"San Andrés Tuxtla"}, {"nombre":"San Juan Evangelista"}, {"nombre":"San Rafael"}, {"nombre":"Santiago Sochiapan"}, {"nombre":"Santiago Tuxtla"}, {"nombre":"Sayula de Alemán"}, {"nombre":"Sochiapa"}, {"nombre":"Soconusco"}, {"nombre":"Soledad Atzompa"}, {"nombre":"Soledad de Doblado"}, {"nombre":"Soteapan" }, {"nombre":"Tamalín"}, {"nombre":"Tamiahua"}, {"nombre":"Tampico Alto"}, {"nombre":"Tancoco"}, {"nombre":"Tantima"}, {"nombre":"Tantoyuca"}, {"nombre":"Tatahuicapan"}
            		, {"nombre":"Tatatila"}, {"nombre":"Tecolutla"}, {"nombre":"Tehuipango"}, {"nombre":"Temapache"}, {"nombre":"Tempoal"}, {"nombre":"Tenampa"}, {"nombre":"Tenochtitlán"}, {"nombre":"Teocelo"}, {"nombre":"Tepatlaxco"}, {"nombre":"Tepetlán"}, {"nombre":"Tepetzintla"}, {"nombre":"Tequila"}, {"nombre":"Texcatepec"}, {"nombre":"Texhuacán"}, {"nombre":"Texistepec"}, {"nombre":"Tezonapa"}, {"nombre":"Tierra Blanca"}, {"nombre":"Tihuatlán"}, {"nombre":"Tlachichilco"}, {"nombre":"Tlacojalpan"}
            		, {"nombre":"Tlacolulan"}, {"nombre":"Tlacotalpan"}, {"nombre":"Tlacotepec"}, {"nombre":"Tlalixcoyan"}, {"nombre":"Tlalnelhuayocan"}, {"nombre":"Tlaltetela"}, {"nombre":"Tlapacoyan"}, {"nombre":"Tlaquilpa"}, {"nombre":"Tlilapan"}, {"nombre":"Tomatlán"}, {"nombre":"Tonayán"}, {"nombre":"Totutla",}, {"nombre":"Tres Valles"}, {"nombre":"Túxpam"}, {"nombre":"Tuxtilla"}, {"nombre":"Ursulo Galván"}, {"nombre":"Uxpanapa"}, {"nombre":"Vega de Alatorre"}, {"nombre":"Veracruz"}, {"nombre":"Villa Aldama"}
            		, {"nombre":"Xalapa"}, {"nombre":"Xico"}, {"nombre":"Xoxocotla"}, {"nombre":"Yanga"}, {"nombre":"Yecuatla"}, {"nombre":"Zacualpan"}, {"nombre":"Zaragoza"}, {"nombre":"Zentla"}, {"nombre":"Zongolica"}, {"nombre":"Zontecomatlán"}, {"nombre":"Zozocolco"}
            		]},
            	{"valor": "Yucatan",
            	 "ciudades":[{"nombre":"Abalá"}, {"nombre":"Acanceh"}, {"nombre":"Akil"}, {"nombre":"Baca"}, {"nombre":"Bokobá"}, {"nombre":"Buctzotz"}, {"nombre":"Cacalchén"}, {"nombre":"Calotmul"}, {"nombre":"Cansahcab"}, {"nombre":"Cantamayec"}, {"nombre":"Celestún"}, {"nombre":"Cenotillo"}, {"nombre":"Chacsinkín"}, {"nombre":"Chankom"}, {"nombre":"Chapab"}, {"nombre":"Chemax"}, {"nombre":"Chichimilá"}, {"nombre":"Chicxulub Pueblo"}, {"nombre":"Chikindzonot"}, {"nombre":"Chocholá"}, {"nombre":"Chumayel"}
            		, {"nombre":"Conkal"}, {"nombre":"Cuncunul"}, {"nombre":"Cuzamá"}, {"nombre":"Dzán"}, {"nombre":"Dzemul"}, {"nombre":"Dzidzantún"}, {"nombre":"Dzilam de Bravo"}, {"nombre":"Dzilam González"}, {"nombre":"Dzitás"}, {"nombre":"Dzoncauich"}, {"nombre":"Espita"}, {"nombre":"Halachó"}, {"nombre":"Hocabá"}, {"nombre":"Hoctún"}, {"nombre":"Homún"}, {"nombre":"Huhí"}, {"nombre":"Hunucmá"}, {"nombre":"Ixil" }, {"nombre":"Izamal"}, {"nombre":"Kanasín"}, {"nombre":"Kantunil"}
            		, {"nombre":"Kaua"}, {"nombre":"Kinchil"}, {"nombre":"Kopomá"}, {"nombre":"Mama"}, {"nombre":"Maní"}, {"nombre":"Maxcanú"}, {"nombre":"Mayapán"}, {"nombre":"Mérida"}, {"nombre":"Mocochá"}, {"nombre":"Motul"}, {"nombre":"Muna"}, {"nombre":"Muxupip"}, {"nombre":"Opichén"}, {"nombre":"Oxkutzcab"}, {"nombre":"Panabá"}, {"nombre":"Peto"}, {"nombre":"Progreso"}, {"nombre":"Quintana Roo"}, {"nombre":"Río Lagartos"}, {"nombre":"Sacalum"}, {"nombre":"Samahil"}
            		, {"nombre":"San Felipe"}, {"nombre":"Sanahcat"}, {"nombre":"Santa Elena"}, {"nombre":"Seyé"}, {"nombre":"Sinanché"}, {"nombre":"Sotuta"}, {"nombre":"Sucilá"}, {"nombre":"Sudzal"}, {"nombre":"Suma"}, {"nombre":"Tahdziú"}, {"nombre":"Tahmek"}, {"nombre":"Teabo"}, {"nombre":"Tecoh"}, {"nombre":"Tekal de Venegas"}, {"nombre":"Tekantó"}, {"nombre":"Tekax"}, {"nombre":"Tekit"}, {"nombre":"Tekom"}, {"nombre":"Telchac Pueblo"}, {"nombre":"Telchac Puerto"}, {"nombre":"Temax"}
            		, {"nombre":"Temozón"}, {"nombre":"Tepakán"}, {"nombre":"Tetiz"}, {"nombre":"Teya"}, {"nombre":"Ticul"}, {"nombre":"Timucuy"}, {"nombre":"Tinum"}, {"nombre":"Tixcacalcupul"}, {"nombre":"Tixkokob"}, {"nombre":"Tixmehuac"}, {"nombre":"Tixpéhual"}, {"nombre":"Tizimín"}, {"nombre":"Tunkás"}, {"nombre":"Tzucacab"}, {"nombre":"Uayma"}, {"nombre":"Ucú"}, {"nombre":"Umán"}, {"nombre":"Valladolid"}, {"nombre":"Xocchel"}
            		, {"nombre":"Yaxcabá"}, {"nombre":"Yaxkukul"}, {"nombre":"Yobaín"}
            		]},
            	{"valor": "Zacatecas",
            	 "ciudades":[{"nombre":"Apozol"}, {"nombre":"Apulco"}, {"nombre":"Atolinga"}, {"nombre":"Benito Juárez"}, {"nombre":"Calera"}, {"nombre":"Cañitas"}, {"nombre":"Chalchihuites"}, {"nombre":"Concepción del Oro"}, {"nombre":"Cuauhtémoc"}, {"nombre":"El Plateado"}, {"nombre":"El Salvador"}, {"nombre":"Fresnillo"}, {"nombre":"Genaro Codina"}, {"nombre":"General Enrique Estrada"}, {"nombre":"General Francisco R. Murguía"}, {"nombre":"General Pánfilo Natera"}, {"nombre":"Guadalupe"}, {"nombre":"Huanusco"}, {"nombre":"Jalpa"}, {"nombre":"Jerez"}
            		, {"nombre":"Jiménez del Teul"}, {"nombre":"Juan Aldama"}, {"nombre":"Juchipila"}, {"nombre":"Loreto"}, {"nombre":"Luis Moya"}, {"nombre":"Mazapil"}, {"nombre":"Melchor Ocampo"}, {"nombre":"Mezquital del Oro"}, {"nombre":"Miguel Auza"}, {"nombre":"Momax"}, {"nombre":"Monte Escobedo"}, {"nombre":"Morelos"}, {"nombre":"Moyahua de Estrada"}, {"nombre":"Nochistlán de Mejía"}, {"nombre":"Noria de Angeles"}, {"nombre":"Ojocaliente"}, {"nombre":"Pánuco"}, {"nombre":"Pinos"}, {"nombre":"Río Grande"}, {"nombre":"Sain Alto"}, {"nombre":"Santa María de la Paz"}
            		, {"nombre":"Sombrerete"}, {"nombre":"Susticacán"}, {"nombre":"Tabasco"}, {"nombre":"Tepechitlán"}, {"nombre":"Tepetongo"}, {"nombre":"Teul"}, {"nombre":"Tlaltenango"}, {"nombre":"Trancoso"}, {"nombre":"Trinidad García de la Cadena"}, {"nombre":"Valparaíso"}, {"nombre":"Vetagrande"}, {"nombre":"Villa de Cos"}, {"nombre":"Villa García"}, {"nombre":"Villa González Ortega"}, {"nombre":"Villa Hidalgo"}, {"nombre":"Villanueva"}, {"nombre":"Zacatecas"}
            		]},
            ];



/* Permite mostrar una ventana modal*/
		$scope.showModal=function(item){
/*se toma el valor seleccionado de la lista de inmuebles y se asigna
a una variable en el $rootScope*/
			$rootScope.inmuebleActual= item;
/*Se toma la variable del $rootScope y se pasa al scope del controller de la modal
para poder acceder a sus datos*/
			$scope.item=$rootScope.inmuebleActual;
			var modalInstance = $modal.open({
				templateUrl: 'modules/inmuebles/views/view-inmueble.client.view.html',
				controller: 'myModalController',
			});
		}

		// Create new Inmueble
		$scope.create = function() {

			// Create new Inmueble object
			var inmueble = new Inmuebles ({
				titulo: this.titulo,
				tipo_inmueble: this.tipo_inmueble,
				tipo_trans: this.tipo_trans,
				estado: this.estado.valor,
				ciudad: this.ciudad.nombre,
				zona: this.zona,
				colonia: this.colonia,
				direccion: this.direccion,
				precio: this.precio,
                        moneda: moneda,
                        m2terreno: this.m2terreno,
                        m2construccion: this.m2construccion,
                        no_plantas: this.no_plantas,
				no_habitaciones: this.no_habitaciones,
				no_banos: this.no_banos,
				no_carros: this.no_carros,
//se obtiene el String base64 de la imagen principal a través del DOM
                        image: this.image,
                        imagenes: this.imagenes,
			});

      		// Redirect after save
			inmueble.$save(function(response) {
				$location.path('inmuebles');

				// Clear form fields
				$scope.titulo = '';
				$scope.tipo_inmueble = '';
				$scope.tipo_trans = '';
				$scope.estado = '';
				$scope.ciudad = '';
				$scope.zona = '';
				$scope.colonia = '';
				$scope.direccion = '';
				$scope.precio='';
                        $scope.m2terreno='',
                        $scope.m2construccion='',
				$scope.no_plantas = '';
				$scope.no_habitaciones = '';
				$scope.no_banos = '';
				$scope.no_carros = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// Remove existing Inmueble
		$scope.remove = function(inmueble) {
			if ( inmueble ) { 
				inmueble.$remove();

				for (var i in $scope.inmuebles) {
					if ($scope.inmuebles [i] === inmueble) {
						$scope.inmuebles.splice(i, 1);
					}
				}
			} else {
				$scope.inmueble.$remove(function() {
					$location.path('inmuebles');
				});
			}
		};

		// Update existing Inmueble
		$scope.update = function() {
			var inmueble = $scope.inmueble;
                  console.log(inmueble);
			inmueble.$update(function() {
				$location.path('inmueblesMe');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

            // Update existing Inmueble
            $scope.updateDestacado = function() {
                  var inmueble = $scope.inmueble;

                  inmueble.$update(function() {
                        $location.path('inmueblesDestacados');
                  }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                  });
            };

		// Find a list of Inmuebles
		$scope.find = function() {
			$scope.inmuebles = Inmuebles.query();
		};

		// Find existing Inmueble
		$scope.findOne = function() {
			$scope.inmueble = Inmuebles.get({ 
				inmuebleId: $stateParams.inmuebleId
			});
			//$scope.inmueble= inmueble.inmuebleActual;

		};


            $scope.load = function(lugar) {
                        

            if (GBrowserIsCompatible()) {
                  var map = new GMap2(document.getElementById("map"));
                  map.setCenter(new GLatLng(0,0), 0);
                  map.addControl(new GSmallMapControl());
                  map.addControl(new GScaleControl());
                  map.addControl(new GMapTypeControl());
                  GEvent.addListener(map, "click", function(overlay, point){ 
                        if(overlay){ 
                              if(overlay.title)
                                    map.openInfoWindowHtml(overlay.getPoint(), overlay.title);
                        }
                  });
                  var geocoder = new GClientGeocoder();
                  geocoder.getLatLng(lugar, function(point) {
                        if (!point) {
                              alert("Lugar no encontrado");
                        } else {
                              map.setCenter(point, 12);    // 12 indica el valor de zoom
                              var center = new GMarker(map.getCenter());
                              center.title = lugar;
                              map.addOverlay(center);
                              map.openInfoWindowHtml(center.getPoint(), center.title);
                        }
                  });
                  var center = new GMarker(map.getCenter());
            center.title = "Centro del mapa";
                  map.addOverlay(center);
                  map.openInfoWindowHtml(center.getPoint(), center.title);
            }
      };



	}
]);

angular.module('inmuebles').controller('myModalController', ['$scope', '$rootScope', '$modalInstance',
	function($scope, $rootScope, $modalInstance) {
		$scope.item=$rootScope.inmuebleActual;
	}
	]);


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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
// Se anexa la ruta admin para administrar usuarios
		state('editUser', {
			url: '/settings/editUser/:userId',
			templateUrl: 'modules/users/views/settings/edit-user.client.view.html'
		}).
		state('admin', {
			url: '/settings/admin',
			templateUrl: 'modules/users/views/settings/admin-users.client.view.html'
		}).
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				$scope.error="Registrado guardado";
				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};


		//Metodo que obtiene todos los usuarios para la administración de usuarios
		// Find a list of Users
		$scope.find = function() {
			$scope.users = Users.query();
		};

		// Find existing user
		$scope.findOne = function() {
			$scope.inmueble = Inmuebles.get({ 
				inmuebleId: $stateParams.inmuebleId
			});
		};
		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
/*'use strict';

// Configuring the Articles module
angular.module('usuarios').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Usuarios', 'usuarios', 'dropdown', '/usuarios(/create)?');
		Menus.addSubMenuItem('topbar', 'usuarios', 'List Usuarios', 'usuarios');
		Menus.addSubMenuItem('topbar', 'usuarios', 'New Usuario', 'usuarios/create');
	}
]);*/
'use strict';

//Setting up route
angular.module('usuarios').config(['$stateProvider',
	function($stateProvider) {
		// Usuarios state routing
		$stateProvider.
		state('listUsuarios', {
			url: '/usuarios',
			templateUrl: 'modules/usuarios/views/list-usuarios.client.view.html'
		}).
		state('createUsuario', {
			url: '/usuarios/create',
			templateUrl: 'modules/usuarios/views/create-usuario.client.view.html'
		}).
		state('viewUsuario', {
			url: '/usuarios/:usuarioId',
			templateUrl: 'modules/usuarios/views/view-usuario.client.view.html'
		}).
		state('editSite', {
			url: '/usuarios/:usuarioId/editP',
			templateUrl: 'modules/usuarios/views/edit-site.client.view.html'
		}).
		state('editUsuario', {
			url: '/usuarios/:usuarioId/edit',
			templateUrl: 'modules/usuarios/views/edit-usuario.client.view.html'
		});
	}
]);
'use strict';

// Usuarios controller
angular.module('usuarios').controller('UsuariosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Usuarios',
	function($scope, $stateParams, $location, Authentication, Usuarios) {
		$scope.authentication = Authentication;

		// Create new Usuario
		$scope.create = function() {
			// Create new Usuario object
			var usuario = new Usuarios ({
				name: this.name
			});

			// Redirect after save
			usuario.$save(function(response) {
				$location.path('usuarios/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Usuario
		$scope.remove = function(usuario) {
			if ( usuario ) { 
				usuario.$remove();

				for (var i in $scope.usuarios) {
					if ($scope.usuarios [i] === usuario) {
						$scope.usuarios.splice(i, 1);
					}
				}
			} else {
				$scope.usuario.$remove(function() {
					$location.path('usuarios');
				});
			}
		};

		// Update existing Usuario
		$scope.update = function() {
			var usuario = $scope.usuario;
			
			usuario.$update(function() {
				$location.path('usuarios');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Usuario
		$scope.updateSite = function() {
			var usuario = $scope.usuario;
			
			usuario.$update(function() {
				$location.path('inmuebles');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Usuarios
		$scope.find = function() {
			$scope.usuarios = Usuarios.query();
		};

		// Find existing Usuario
		$scope.findOne = function() {
			$scope.usuario = Usuarios.get({ 
				usuarioId: $stateParams.usuarioId
			});
		};
	}
]);
'use strict';

//Usuarios service used to communicate Usuarios REST endpoints
angular.module('usuarios').factory('Usuarios', ['$resource',
	function($resource) {
		return $resource('usuarios/:usuarioId', { usuarioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);