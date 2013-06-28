/*====================================
=           ACCOUNTS ROUTES          =
====================================*/

'use strict';

var passport = require('passport')
  , accounts = require('../controllers/accounts_controller')
  , authMiddleware = require('../middlewares/auth_middleware')
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function(app, config) {
    // AUTH
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successReturnToOrRedirect: '/profile', failureRedirect: '/login' }));

    // ACCOUNTS
    app.get('/login', authMiddleware.user.isLoggedIn, accounts.showLogin);
    app.post('/login', accounts.login);

    app.get('/signup',  authMiddleware.user.isLoggedIn, accounts.signup);
    app.post('/signup', accounts.createAccount);

    app.get('/profile', ensureLoggedIn('/login'), accounts.profile);
    app.get('/verify', ensureLoggedIn('/login'), accounts.verify);
    app.get('/logout', ensureLoggedIn('/'), accounts.logout);
};
