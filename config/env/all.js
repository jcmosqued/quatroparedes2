'use strict';

module.exports = {
	app: {
		title: 'quatroparedes',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				//'public/lib/bootstrap/dist/css/bootstrap.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				//'public/lib/angular/angular.min.js',
				//'public/lib/angular-resource/angular-resource.min.js', 
				//'public/lib/angular-cookies/angular-cookies.min.js', 
				//'public/lib/angular-animate/angular-animate.min.js', 
				//'public/lib/angular-touch/angular-touch.min.js', 
				//'public/lib/angular-sanitize/angular-sanitize.min.js', 
				//'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				//'public/lib/angular-ui-utils/ui-utils.min.js',
				//'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				//'public/lib/jquery/dist/jquery.min.js',
				//'public/lib/bootstrap/dist/js/bootstrap.min.js',
	            //'public/lib/angular-base64-upload/dist/angular-base64-upload.min.js',
	            //'http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAg_2UIEV5rd9OVgNSGNfsyxTaN__vuAQAUAfJwnfsk7h_mauWkxSYbIJkdkwH1e7uYk7faoLIELG-Tw'
			]
		},
		css: [
			//'public/modules/**/css/*.css',
		],
		js: [
			//'public/config.js',
			//'public/application.js',
			//'public/modules/*/*.js',
			//'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};