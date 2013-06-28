/*======================================
=            EXPRESS CONFIG            =
======================================*/

'use strict';

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , viewMiddleware = require('../app/middlewares/view_middleware')
  , errorMiddleware = require('../app/middlewares/error_middleware')
  , apiMiddleware = require('../app/middlewares/api_middleware')
  , authMiddleware = require('../app/middlewares/auth_middleware')
  , passport = require('passport')
  , validator = require('express-validator');

module.exports = function(app, config) {
    app.use(express.static(config.root + '/assets'));
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.set('showStackError', config.showStackError);

    app.configure(function () {
        // Configure express
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.favicon());

        // Setup sessions
        app.use(express.session({
            secret: config.sessionSecret,
            store: new mongoStore({
                url: config.dbUri,
                collection: 'sessions'
            })
        }));

        // Connect errorMiddleware for error handling
        app.use(errorMiddleware.errorDomain(config));

        // Setup CDN
        var CDN = require('express-cdn')(app, config.cdn);

        // Setup locals for views
        app.use(viewMiddleware.locals(config, CDN));

        // Setup passport for auth
        app.use(passport.initialize());
        app.use(passport.session());

        // Mount api-specific middleware on /api
        app.use('/api', authMiddleware.loginRequired(config));
        app.use('/api', apiMiddleware(config));

        // Validators
        app.use(validator);

        // Router
        app.use(app.router);

        //Bind error handling 
        app.use(errorMiddleware.genericError(config));
        app.use(errorMiddleware.notFound(config));
    });
};