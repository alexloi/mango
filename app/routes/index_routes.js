/*====================================
=            INDEX ROUTES            =
====================================*/

'use strict';

var index = require('../controllers/index_controller');

module.exports = function(app, config) {
    app.get('/', index.index);
    app.get('/login', index.login);
};
