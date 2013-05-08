/*======================================
=            LOGGING CONFIG            =
======================================*/

'use strict';

var winston = require('winston');

module.exports = function(app, config) {
    // as per https://github.com/flatiron/winston/issues/89, 'debug' priority
    // is screwed. Until this is fixed and deployed, we set our own priority
    // levels
    var levels = {
        silly: 0,
        verbose: 1,
        debug: 2,
        info: 3,
        warn: 4,
        error: 5
    };

    // create two loggers - one for config messages e.g on startup and one
    // general for application logging (which will use json)
    var configLogger = winston.loggers.add('config', {
        console: {
            level: config.logLevel,
            prettyPrint: true,
            colorize: true
        }
    });

    var appLogger = winston.loggers.add('app', {
        console: {
            level: config.logLevel,
            handleExceptions: true,
            json: true
        }
    });

    configLogger.level = config.logLevel;
    configLogger.levels = levels;
    appLogger.level = config.logLevel;
    appLogger.levels = levels;
};