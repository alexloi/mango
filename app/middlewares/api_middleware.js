/*======================================
=            API MIDDLEWARE            =
======================================*/

'use strict';

var _ = require('lodash')
  , apiHelpers = require('../../lib/api_helpers');

module.exports = function(config) {
    return function(req, res, next) {
        res._data = {};
        res.api = {};
        res._data.host = config.hostname;
        res._data.startTime = new Date().getTime();
        res.api.end = _.partial(apiHelpers.makeResponse, res);
        next();
    };
};