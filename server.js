/*====================================
=            MAIN SERVER             =
====================================*/

var util = require('util')
  , winston = require('winston')
  , express = require('express')
  , bootstrap = require('./config/bootstrap')
  , config = require('./config/config');

global.app = express();
bootstrap(app, config);

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
