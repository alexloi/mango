/*======================================
=            PRE-TEST HOOKS            =
======================================*/

'use strict';

var config = require('../config/config')
  , bootstrap = require('../config/bootstrap')
  , mongoose = require('mongoose')
  , express = require('express')
  , _ = require('lodash');

before(function(done) {
    global.app = express();
    bootstrap(global.app, config);
    mongoose.connection.on('connected', done);
});

after(function() {
    mongoose.connection.db.dropDatabase();
});