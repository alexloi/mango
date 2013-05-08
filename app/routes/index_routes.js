/*====================================
=            INDEX ROUTES            =
====================================*/

'use strict';

var index = require('../controllers/index_controller');

module.exports = function(app, config) {
    // render index
    app.get('/', index.index);
};
