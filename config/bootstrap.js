/*=========================================
=            BOOTSTRAP HELPERS            =
==========================================*/

var _ = require('lodash')
  , fs = require('fs')
  , path = require('path');

var modelsPath = __dirname + '/../app/models'
  , routesPath = __dirname + '/../app/routes';

/**
 * Shortcut for applying a configuration file to an express app.
 *
 * Usage
 * -----
 * configure(app, config, 'database', 'logging');
 *
 * The above example will first search for two files (database.js, logging.js)
 * in config and apply them in order to the app.
 *
 */
var configure = function(app, config) {
    if (_.isEmpty(app)) throw new Error('app is undefined');
    if (_.isEmpty(config)) throw new Error('config is undefined');
    var additional = [].slice.call(arguments, 2);
    _.each(additional, function(c) {
        var filename = path.join(__dirname, c + '.js');
        if (!fs.existsSync(filename)) throw new Error(c + ' does not exist');
        require('./' + c)(app, config);
    });
};

/**
 * The bootstrap function
 */
module.exports = _.once(function(app, config) {
    // load all models
    fs.readdirSync(modelsPath).forEach(function(file) {
        require(modelsPath + '/' + file);
    });

    // apply configurations
    configure(app, config, 'logging', 'express', 'passport', 'database');

    // load all routes
    fs.readdirSync(routesPath).forEach(function(file) {
        require(routesPath + '/' + file)(app, config);
    });

});