/*===================================
=            API HELPERS            =
===================================*/

'use strict';

var _ = require('lodash');

/**
 * Makes an API response. Making such a response entails adding 'meta' info
 * on the payload to be sent to the client as well as mapping models to
 * resources if applicable.
 *
 * Params:
 *     - res: the express response object
 *     - data: the data to be sent to the client, can be array or object
 */
exports.makeResponse = function(res, data) {
    var total = Array.isArray(data) ? data.length : 1
      , payload = {};

    payload.meta = {
        took: new Date().getTime() - res._data.startTime,
        host: res._data.host
    };

    payload.response = {};
    payload.response.total = total;
    payload.response.data = Array.isArray(data)
                            ? _.invoke(data, 'mapToResource')
                            : data.mapToResource();
    return res.json(200, payload);
};