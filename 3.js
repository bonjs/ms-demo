'use strict'

var Seneca = require('seneca')
	var Web = require('seneca-web')
	var Express = require('express')
	var Passport = require('passport')
	var Strategy = require('passport-local').Strategy
	var CookieParser = require('cookie-parser')
	var BodyParser = require('body-parser')
	var Session = require('express-session')

	// The config for our routes
	var Routes = [{
		pin : 'role:admin,cmd:*',
		map : {
			home : {
				GET : true,
				POST : true,
				alias : '/'
			},
			logout : {
				GET : true,
				redirect : '/'
			},
			profile : {
				GET : true,
				secure : {
					fail : '/'
				}
			},
			login : {
				POST : true,
				auth : {
					strategy : 'local',
					pass : '/profile',
					fail : '/'
				}
			}
		}
	}
];

// Plugin to handle our routes
function Plugin() {
	var seneca = this;

	seneca.add('role:admin,cmd:home', function(msg, done) {
		done(null, {
			ok : true,
			message : 'please log in...'
		})
	});

	seneca.add('role:admin,cmd:logout', function(msg, done) {
		msg.request$.logout()

		done(null, {
			ok : true
		})
	});

	seneca.add('role:admin,cmd:profile', function(msg, done) {
		done(null, {
			ok : true,
			user : msg.args.user
		})
	});
}

// Prep express
var app = Express();
app.use(CookieParser())
app.use(BodyParser.urlencoded({
	extended : true
}));
app.use(Passport.initialize())
app.use(Passport.session())

// The config we will pass to seneca-web
var config = {
	adapter : require('seneca-web-adapter-express'),
	context : app,
	routes : Routes,
	auth : Passport
}

// Server and start as usual.

var seneca = Seneca()
	.use(Plugin)
	.use(Web, config)
	.ready(function() {
		var server = seneca.export('web/context')();

		server.listen('4050', function(err) {
			console.log(err || 'server started on: 4050')
		});
	})
