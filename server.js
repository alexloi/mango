/*====================================
=            MAIN SERVER             =
====================================*/
/**
*  Load config / bootstrap 
**/
var util = require('util')
  , winston = require('winston')
  , express = require('express')
  , config = require('./config/config')
  , bootstrap = require('./config/bootstrap');

global.app = express();
bootstrap(app, config);

// Keep the logger global
logger = winston.loggers.get('config');

/**
 * Run this shizzle.
 */
global.app.listen(config.port, '0.0.0.0');
logger.info('server has started');
logger.info('port:', config.port);
logger.info('environment:', config.env);
logger.info('serving compiled assets:',
            config.useCompiledAssets ? 'yes' : 'no');
