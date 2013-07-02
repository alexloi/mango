/*=======================================
=            PASSPORT CONFIG            =
=======================================*/

'use strict';

var mongoose = require('mongoose')
  , _ = require('lodash')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
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
    // - add remaining strategies for Twitter

    /* Passport Strategies  #passportstrategy */
            
    // Local Strategy
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({email: email}, function(err, user) {

                var authResult = function(err, authenticated) {
                    if (authenticated) return done(null, user);
                    return done(null, null, {message: 'Incorrect password.'});
                };

                if (err) return done(err);
                
                if (!user) return done(null, user, {message: 'Incorrect email.'});
                
                auth.authenticate.user(user, password, authResult);
            });
        }
    ));
    
    // Facebook Strategy
    passport.use(new FacebookStrategy({
            clientID: config.passport.facebook.clientID,
            clientSecret: config.passport.facebook.clientSecret,
            callbackURL: config.passport.facebook.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function(){
                // Check for existing account based on:
                // (1) uid and provider OR (2) email of profile already exists
                User.findOne({face_uid: profile.id}, function(err, user){
                    // Found a user who has this provider
                    if(user && user._id){
                        return done(null, user);
                    } else {
                        /* 
                            New user
                            #todo #user
                                - Abstract data object to just pass profile for filling
                        */
                        var newUser = new User()
                          , data = {  first_name: profile.name.givenName
                                    , family_name: profile.name.familyName
                                    , email: profile.emails[0].value || 'jon@doe.com'
                                    , face_uid: profile.id
                                    , role: 'user'
                                    , accounts: [] }
                          , account = {provider:'facebook', _profile: profile};

                        // Push new facebook account
                        data.accounts.push(account);
                        
                        // Extend the user object with our data
                        _.extend(newUser, data);

                        // Save this mofo
                        newUser.save(function(err, savedUser){
                            if(err) throw err;
                            return done(null, savedUser);
                        });
                    };
                });
            });
        }
    ));
};

// #todo 
// - Implement password reset function 
// - Integrate sendgrid / mail service to send out send new password to user