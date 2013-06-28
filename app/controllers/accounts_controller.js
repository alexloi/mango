/*===========================================
=            ACCOUNTS CONTROLLER            =
===========================================*/

'use strict';

var mongoose = require('mongoose')
  , passport = require('passport')
  , User = mongoose.model('User')
  , util = require('util')
  , _ = require('lodash');


exports.profile = function (req, res) {
    return res.send('Use profile: ', req.user.username);
};

