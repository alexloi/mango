/*======================================
=            EXPRESS CONFIG            =
======================================*/

'use strict';

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , viewMiddleware = require('../app/middlewares/view_middleware')
  , errorMiddleware = require('../app/middlewares/error_middleware')
  , apiMiddleware = require('../app/middlewares/api_middleware')
  , rolesMiddleware = require('../app/middlewares/roles_middleware')
  , passport = require('passport')
  , userAuth = require('connect-roles')
  , validator = require('express-validator')
  , flash = require('connect-flash');

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

        // Setup CDN
        var CDN = require('express-cdn')(app, config.cdn);

        // Use flash messages
        app.use(flash());
        
        // Setup locals for views
        app.use(viewMiddleware.locals(config, CDN));

        // Setup passport for authentication
        app.use(passport.initialize());
        app.use(passport.session());

        // Setup connect-roles for authorization
        // NOTE: Authorization strategy is defined in authMiddleware and is 
        // bootstrapped on require.
        app.use(userAuth);

        // Mount api-specific middleware on /api
        // app.use('/api', authMiddleware.user.loginRequired);
        // app.use('/api', apiMiddleware(config));

        // Validators
        app.use(validator);

        // Add csrf
        app.use(express.csrf());

        // Router
        app.use(app.router);

        //Bind error handling 
        app.use(errorMiddleware.genericError(config));
        app.use(errorMiddleware.notFound(config));
        
    });
};