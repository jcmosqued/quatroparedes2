'use strict';

module.exports = {
	db: 'mongodb://localhost/quatroparedes-dev',
	assets: {
		lib: {
			css: [
				//'public/lib/bootstrap/dist/css/bootstrap.min.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js', 
				//'public/lib/angular-cookies/angular-cookies.js', 
				//'public/lib/angular-animate/angular-animate.js', 
				//'public/lib/angular-touch/angular-touch.js', 
				//'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
	            'public/lib/angular-base64-upload/dist/angular-base64-upload.min.js'
	            

			]
		},
		css: 'public/dist/application.min.css',
		js:  ['public/dist/application.min.js',
			 'http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAg_2UIEV5rd9OVgNSGNfsyxTaN__vuAQAUAfJwnfsk7h_mauWkxSYbIJkdkwH1e7uYk7faoLIELG-Tw']
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '144182149247756',
		clientSecret: process.env.FACEBOOK_SECRET || 'f7c2b62ee53e2b5d7b25820a6cdb65d0',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '50521223582-6bbrjlnjmdc4kdpglqhl6b94acqtcgvd.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'x95YMBQfai0EuE9hEZC2WJuu',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
