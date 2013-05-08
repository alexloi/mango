/*====================================
=            GLOBAL CONFIG           =
=====================================*/

/*
- Environment variables:
    
    # PORT (specifies port to run on) 
        -> defaults to 8000
    # NODE_ENV (specifies node env) 
        -> defaults to 'development'
    # SESSION_SECRET (secret to encode session) 
        -> defaults to 's3cr3tP0wah'
    # {social}_APP_ID / {social}_APP_SECRET (social connections) 
        -> no default
    # MONGO_USER / MONGO_PASS (mongohq connectivity) 
        -> no default, only used in production
*/

'use strict';

var _ = require('lodash')
  , util = require('util')
  , os = require('os');

// make sure we cast this to boolean
var useCompiledAssets = process.env.USE_COMPILED_ASSETS === 'true';

var addPassportCallbacks = function(config) {
    var url = util.format("http://%s/auth/%s/callback", config.serverAddr);
    _.each(config.passport, function(provider, key) {
        provider.callbackURL = util.format(url, key);
    });
};

// common settings between development and production
var common = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 8000,
    sessionSecret: process.env.SESSION_SECRET || 's3cr3tP0wah',
    root: require('path').normalize(__dirname + '/..'),
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
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_ID
        },
        twitter: {
            clientID: process.env.TWITTER_APP_ID,
            clientSecret: process.env.TWITTER_APP_SECRET
        },
        github: {
            clientID: process.env.GITHUB_APP_ID,
            clientSecret: process.env.GITHUB_APP_SECRET
        }
    }
};

// development settings
var development = _.extend({}, common, {
    dbUri: 'mongodb://localhost/mango',
    showStackError: true,
    logLevel: 'debug',
    serverAddr: util.format('localhost:%s', common.port)
});

// production settings
var production = _.extend({}, common, {
    dbUri: 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@dharma.mongohq.com:10069/mango',
    showStackError: false,
    logLevel: 'error',
    serverAddr: 'mango.co'
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
