/*=================================
=            ENV TESTS            =
=================================*/

'use strict';

var assert = require('chai').assert,
    path = require('path');

describe('config/env', function() {
    beforeEach(function() {
        var configDir = path.resolve(__dirname + '../../../config/config.js');
         delete require.cache[configDir];
    });

    it('should configure development properly', function() {
        var config;
        process.env.NODE_ENV = 'development';
        config = require('../../config/config');
        assert.equal(config.env, 'development', 'development: env is correct');
        assert.equal(config.logLevel, 'debug', 'development: log level correct');
    });

    it('should configure production properly', function() {
        var config;
        process.env.NODE_ENV = 'production';
        config = require('../../config/config');
        assert.equal(config.env, 'production', 'production: env is correct');
        assert.equal(config.logLevel, 'error', 'production: log level correct');
    });
}); 



