'use strict';

module.exports = {
	db: 'mongodb://localhost/quatroparedes-dev',
	app: {
		title: 'Quatroparedes'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '144182149247756',
		clientSecret: process.env.FACEBOOK_SECRET || 'f7c2b62ee53e2b5d7b25820a6cdb65d0',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: 'https://localhost:3000/oauth2callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '50521223582-6bbrjlnjmdc4kdpglqhl6b94acqtcgvd.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'x95YMBQfai0EuE9hEZC2WJuu',
		callbackURL: 'http://localhost:3000/auth/google/callback'
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
		from: process.env.MAILER_FROM || 'remotecnologias',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'google',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'remotecnologias@gmail.com',
				pass: process.env.MAILER_PASSWORD || 'ng05jc28'
			}
		}
	}
};
