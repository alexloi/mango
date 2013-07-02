/*===========================================
=            ACCOUNTS CONTROLLER            =
===========================================*/

'use strict';

var mongoose = require('mongoose')
  , passport = require('passport')
  , User = mongoose.model('User')
  , util = require('util')
  , _ = require('lodash')
  , emailService = require('../../services/sendgrid');


module.exports.renderLogin = function (req, res) {
    return res.render('accounts/login', { message: req.flash('error') });
};

module.exports.renderProfile = function (req, res) {
    return res.send('User profile: ', req.user);
};

module.exports.renderVerify = function (req, res) {
    return res.send('Verify email: ' + req.user.email + '<a href="/profile"> Next </a>');
};

module.exports.login = function (req, res, next) {
    passport.authenticate('local', function(err, user, info){
        if(err) return next(err);
        if(!user){
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        };
        req.login(user, function(err){
            if(err) next(err);
            return res.redirect('/profile');
        });

    })(req, res, next);
};

module.exports.signup = function (req, res) {
    return res.render('accounts/signup', { message: req.flash('error') });
};

module.exports.createUserAccount = function (req, res) {
    // Validate account details
    req.check('first_name', 'empty first name').notEmpty();
    req.check('family_name', 'empty last name').notEmpty();
    req.check('email', 'invalid email').notEmpty().isEmail();
    req.check('password', 'empty password').notEmpty(); 
    req.check('password', '6 to 20 characters required').len(6, 20);
    req.check('password', 'should match').equals(req.body.validate_password);

    var errors = req.validationErrors();
    
    if (errors) {
        // Create a flash error
        req.flash('error', errors[0].msg);
        return res.redirect('/signup');
    }; 

    // Lowercase email
    req.body.email = req.body.email.toLowerCase();
    // User role
    req.body.role = 'user';

    // Check if user exists
    User.count({email: req.body.email}, function(err, count){
        if(err) return next(err);
        return count == 1 ? userExists() : makeUser();
    });

    // If exists go back
    var userExists = function() {
        req.flash('error', 'User already exists, Try <a href="/login"> logging in </a>');
        return res.redirect('/signup');
    };

    // Else sign this player up!
    var makeUser = function() {
        var user = new User(req.body);
        user.hashPassword( function(err) {
            if(err) return next(err);

            user.save(function(err,user){
                if(err) return next(err);
                req.logIn(user, function(err){
                    if(err) return next(err);
                    return res.redirect('/profile');
                });
            });
        });
    };

};

module.exports.logout = function (req, res) {
    req.logout();
    return res.redirect('/');
};
