/*=======================================
=            AUTH MIDDLEWARE            =
=======================================*/

'use strict';

/**
 * Requires the user to be logged in to access the route. If the user is not,
 * it redirects to /login.
 */
module.exports.loginRequired = function(config) {
    return function(req, res, next) {
        var loginUrl = '/login'
          , redirect = req.url != null? '?next=' + req.url : '';
        if (!req.isAuthenticated()) return res.redirect(loginUrl + redirect);
        next();
    };
};

