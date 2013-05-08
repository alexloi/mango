/*=======================================
=            PASSPORT CONFIG            =
=======================================*/

'use strict';

var mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User = mongoose.model('User')
  , auth = require('../lib/auth');

module.exports = function(app, config) {
    // serialize/deserialize sessions, store user id in cookies
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({_id: id}, function(err, user) {
            done(err, user);
        });
    });

    // #todo
    // - abstract repeating logic
    // - make the process a bit smarter so that the user can attach providers
    //   to their account
    // - add remaining strategies for Twitter, Facebook and Github
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({username: username.toLowerCase()}, function(err, user) {
                var authResult = function(err, authenticated) {
                    if (authenticated) return done(null, user);
                    return done(null, null, {message: 'Incorrect password.'});
                };
                if (err) return done(err);
                if (!user) return done(null, user, {message: 'Incorrect username.'});
                auth.authenticate.user(user, password, authResult);
            });
        }
    ));

    // Add remaining strategies here...

};

// #todo 
// - Implement password reset function 
// - Integrate sendgrid / mail service to send out send new password to user