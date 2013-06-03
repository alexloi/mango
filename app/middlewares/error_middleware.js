/*========================================
=            ERROR MIDDLEWARE            =
========================================*/

'use strict';

var winston = require('winston')
  , domain = require('domain')
  , logger = winston.loggers.get('app');

/**
 * Used for generic errors in routes.
 */
module.exports.genericError = function(config) {
    return function(err, req, res, next) {
        // #todo: extend this logic to cover for various types of errors
        // and messages i,e stacktraces. this is currently broken hence
        // logging to the console.
        logger.error(err);
        // #todo: make a proper 500
        res.status(500).render('errors/500');
    };
};

/**
 * Last thing to get called, assumed 404.
 */
module.exports.notFound = function(config) {
    return function(req, res, next){
        // #todo: make a proper 404
        res.status(404).render('errors/404');
    };
};

/**
 * Used for unhandled exceptions - domains are *experimental*.
 */
module.exports.errorDomain = function(config) {
    return function(req, res, next) {
        var d = domain.create();
        d.add(req);
        d.add(res);
        d.on('error', function(err) {
            return next(err);
        });
        next();
    };
};