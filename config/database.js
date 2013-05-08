/*=======================================
=            DATABASE CONFIG            =
=======================================*/

var mongoose = require('mongoose')
  , util = require('util')
  , winston = require('winston')
  , logger = winston.loggers.get('config');

module.exports = function(app, config) {
    var open = function() {
        logger.info(util.format('connected to:', config.dbUri));
    };

    var error = function() {
        // #todo
    };

    var reconnect = function() {
        // #todo
    };
    
    mongoose.connect(config.dbUri, { server: { auto_reconnect: true } });
    mongoose.connection.once('open', open);
    mongoose.connection.on('error', error);
    mongoose.connection.on('reconnect', reconnect);
};