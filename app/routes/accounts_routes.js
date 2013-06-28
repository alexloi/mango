/*====================================
=           ACCOUNTS ROUTES          =
====================================*/

'use strict';

var passport = require('passport')
  , accounts = require('../controllers/accounts_controller')
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function(app, config) {
    // AUTH
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successReturnToOrRedirect: '/account', failureRedirect: '/login' }))

    // ACCOUNTS
    app.get('/account', ensureLoggedIn('/login'), accounts.profile);
};
