/*====================================
=            GLOBAL CONFIG           =
=====================================*/

/*
#todo Push environment variable creation in a pre-deploy config file.
*/

'use strict';

var _ = require('lodash')
  , util = require('util')
  , path = require('path')
  , os = require('os')
  , winston = require('winston')
  , appLogger = winston.loggers.get('app');

// Config set by user in setup/config.js
var settings = require('../setup/config.js');

// make sure we cast this to boolean
var useCompiledAssets = process.env.USE_COMPILED_ASSETS === 'true';

var addPassportCallbacks = function(config) {
    var url = util.format("http://%s/auth/%s/callback", config.serverAddr);
    _.each(config.passport, function(provider, key) {
        provider.callbackURL = util.format(url, key);
    });
};

// root dir
var root = path.normalize(__dirname + '/..');

// common settings between development and production
var common = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    sessionSecret: settings.sessionSecret || 's3cr3tP0wah',
    root: root,
    useCompiledAssets: useCompiledAssets,
    hostname: os.hostname(),
    pbkdf2: {
        iterations: 10000,
        size: 16
    },
    app: {
        name: 'Mango - just another boilerplate'
    },
    passport: {
        facebook: {
            clientID: settings.social.facebook.appId,
            clientSecret: settings.social.facebook.appSecret
        },
        twitter: {
            clientID: settings.social.twitter.appId,
            clientSecret: settings.social.twitter.appSecret
        },
        github: {
            clientID: settings.social.github.appId,
            clientSecret: settings.social.github.appSecret
        }
    },
    // Third party service integration
    services: settings.services,
    cdn: {
        /* Refer to options here: https://github.com/niftylettuce/express-cdn */
        publicDir : path.join(root, 'assets'),
        viewsDir: path.join(root, 'app/views'),
        domain: settings.cdn.domain,
        bucket: settings.cdn.bucket,
        endpoint: settings.cdn.endpoint,        
        key: settings.aws.key,
        secret: settings.aws.secret,
        hostname: os.hostname(),
        port: 1337,
        ssl: false,
        production: false,
        logger: appLogger
    }
};

// development settings
var development = _.extend({}, common, {
    dbUri: 'mongodb://localhost/'+settings.db.name,
    showStackError: true,
    logLevel: 'debug',
    serverAddr: util.format('localhost:%s', common.port),
});
// Configure development cdn
development.cdn = _.extend({}, development.cdn, {
    ssl: false,
    production: false  
});

// production settings
var production = _.extend({}, common, {
    dbUri: settings.db.mongoHqUri,
    showStackError: false,
    logLevel: 'error',
    serverAddr: settings.app.domain,
});
// Configure production cdn
production.cdn = _.extend({}, production.cdn, {
    ssl: false,
    production: true
});

// populare *current* environment based on the environment variable,
// defaulting to development
var current;
switch(common.env) {
    case 'development':
        current = development;
        break;
    case 'production':
        current = production;
        break;
    default:
        current = development;
}

// add the passport callback urls
addPassportCallbacks(current);

// export the current configuration
module.exports = current;
