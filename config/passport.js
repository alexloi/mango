/*=======================================
=            PASSPORT CONFIG            =
=======================================*/

'use strict';

var mongoose = require('mongoose')
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
    // - add remaining strategies for Twitter, Facebook and Github

    /* Passport Strategies  #passportstrategy */
            
    // Local Strategy
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
                User.find($or[{'accounts.uid':profile_id, 'accounts.provider': 'facebook'}, {'email': profile.email}], function(err, user){
                    // Found a user who has this provider
                    if(user && user._id ){
                        /* Got a hit */
                        if(user.accounts && accounts.provider == 'facebook'){
                            // Found a user who has this facebook account
                            done(null, user);    
                        }else{
                            // Found a user who has an account with this email 
                            // but hasn't connected facebook yet
                            user.accounts.push({provider:'facebook', uid:profile.id});
                            user.save(function(err,newUser){
                                if(err) throw new Error('passport.js (ln 72): User with identical email tries to connect with Facebook');
                                done(null, newUser);
                            });
                        }
                    } else {
                        /* 
                            New user
                            #todo #user
                                - Abstract data object to just pass profile for filling
                        */
                        var newUser = new User()
                          , data = {  firstName: profile.name.givenName
                                    , lastName: profile.name.lastName
                                    , email: profile.emails[0].value
                                    , photo: profile.photos[0].value
                                    , accounts: [] }
                          , account = {provider:'facebook', uid:profile.id};

                        // Push new facebook account
                        data.accounts.push(account);
                        // Extend the user object with our data
                        _.attach(newUser, data);
                        // Save this mofo
                        newUser.save(function(err, savedUser){
                            if(err) throw err;
                            done(null, savedUser);
                        });
                    }
                });
            });
        }
    ));
};

// #todo 
// - Implement password reset function 
// - Integrate sendgrid / mail service to send out send new password to user