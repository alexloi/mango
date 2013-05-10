/*================================
=            VIEW MIDDLEWARE     =
=================================*/

'use strict';

/**
 * Enhance request with helpful attributes.
 */
module.exports.locals = function(config, CDN) {
    return function(req, res, next) {
        res.locals.req = req;
        res.locals.title = '';
        res.locals.config = config;
        res.locals.CDN = CDN();
        next();
    };
};