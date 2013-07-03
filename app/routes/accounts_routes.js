/*====================================
=           ACCOUNTS ROUTES          =
====================================*/

'use strict';

var passport = require('passport')
  , accounts = require('../controllers/accounts_controller')
  , user = require('connect-roles');

module.exports = function(app, config) {
    // AUTH
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successReturnToOrRedirect: '/profile', failureRedirect: '/login' }));

    // ACCOUNTS
    app.get('/login', user.can('login'), accounts.renderLogin);
    app.post('/login', accounts.login);
    
    app.get('/signup',  user.can('signup'), accounts.signup);
    app.post('/signup', accounts.createUserAccount);

    app.get('/forgot', user.can('forgot'), accounts.renderForgot);
    app.post('/forgot', accounts.forgot);

    app.get('/reset/:token', accounts.renderReset);
    app.post('/reset', user.can('reset'), accounts.resetPassword);

    app.get('/profile', user.can('profile'), accounts.renderProfile);
    app.get('/verify', accounts.renderVerify);

    app.get('/logout', accounts.logout); 
};
