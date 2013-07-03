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
        res.locals.title = 'my life';
        res.locals.config = config;
        res.locals.CDN = CDN();
        res.locals._csrf = req.session._csrf;
        next();
    };
};