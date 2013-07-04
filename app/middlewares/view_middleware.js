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
        res.locals.message = {error: req.flash('error')[0], info: req.flash('info')[0], success: req.flash('success')[0]};
        res.locals.config = config;
        res.locals.title = config.app.name;
        res.locals.CDN = CDN();
        res.locals._csrf = req.session._csrf;
        next();
    };
};