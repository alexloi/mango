/*===========================================
=            ACCOUNTS CONTROLLER            =
===========================================*/

'use strict';

var mongoose = require('mongoose')
  , passport = require('passport')
  , config = require('../../config/config')
  , User = mongoose.model('User')
  , util = require('util')
  , _ = require('lodash')
  , message = { error: '', success: '', info: ''}
  , emailService = require('../../services/sendgrid');

module.exports.renderLogin = function (req, res) {
    return res.render('accounts/login');
};

module.exports.renderProfile = function (req, res) {
    return res.render('accounts/profile');
};

module.exports.renderForgot = function (req , res) {
    return res.render('accounts/forgot');
};

module.exports.renderReset = function (req, res, next) {
    // Find the password_token
    User.findOne({password_token: req.params['token']}, function(err, user){
        // Error middleware
        if(err) next(err);

        // No user found - token doesnt exist
        if(!user){
            req.flash('error', 'Token expired or user doesnt exist');
            return res.render('accounts/reset');    
        };

        // Log the mofo in 
        req.login(user, function(err, user){
            if(err) return next(err);
            return res.render('accounts/reset');    
        });
    });
};

module.exports.login = function (req, res, next) {
    // Local authentication
    passport.authenticate('local', function(err, user, info){
        // Error middleware
        if(err) return next(err);
        
        // No such user - return invalid email
        if(!user){
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        };
        
        // Log the player in
        req.login(user, function(err){
            if(err) next(err);
            return res.redirect('/profile');
        });

    })(req, res, next);
};

module.exports.signup = function (req, res) {
    return res.render('accounts/signup');
};

module.exports.forgot = function (req, res, next) {
    // Validator
    req.check('email', 'invalid email').notEmpty().isEmail();

    // Checks req.body for above stated validations
    var errors = req.validationErrors();

    // Any errors
    if (errors) {
        // Create a flash error
        req.flash('error', errors[0].msg);
        return res.redirect('/forgot');
    };

    // Lowercase email #cleanup
    req.body.email = req.body.email.toLowerCase();

    // Check if user exists
    User.count({email: req.body.email}, function(err, count){
        if(err) return next(err);
        return count == 1 ? userExists() : userUnknown();
    });

    // If user exists find him
    var userExists = function(){
        User.findOne({email: req.body.email}, function(err, user){
            if(err) return next(err);

            // Create a verification token
            user.generatePasswordToken(function(err){
                if(err) return next(err);
                
                user.save(function(err, user){
                    if(err) return next(err);

                    // Create the verification link
                    var verificationLink = 'http://' + config.serverAddr + '/reset/'+ user.password_token;

                    // Send off ze email
                    emailService.send({ from: 'info@streethub.com', 
                                        to: user.email, 
                                        subject: 'forgot password', 
                                        html: '<a href="'+verificationLink+'">Reset here</a>'}, function(success, message){
                                            req.flash('info', message || 'Check your inbox');
                                            return res.redirect('/forgot');
                                        });
                });
            });
        });
    };  

    // User doesn't exist
    var userUnknown = function() {
        req.flash('error', 'Email doesnt exist! Register a new account');
        return res.redirect('/forgot');
    };
};

module.exports.createUserAccount = function (req, res, next) {
    // Validate account details
    req.check('first_name', 'empty first name').notEmpty();
    req.check('family_name', 'empty last name').notEmpty();
    req.check('email', 'invalid email').notEmpty().isEmail();
    req.check('password', 'empty password').notEmpty(); 
    req.check('password', '6 to 20 characters required').len(6, 20);
    req.check('password', 'should match').equals(req.body.validate_password);

    // Check for validation errors
    var errors = req.validationErrors();
    
    if (errors) {
        // Create a flash error
        req.flash('error', errors[0].msg);
        // And return
        return res.redirect('/signup');
    }; 

    // Lowercase email #cleanup
    req.body.email = req.body.email.toLowerCase();
    // User role #cleanup
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

        // Hash ze password based on @alexmic voodoo
        user.hashPassword( function(err) {
            if(err) return next(err);

            // Save this mofo
            user.save(function(err,user){
                if(err) return next(err);

                // And log him in
                req.logIn(user, function(err){
                    if(err) return next(err);
                    return res.redirect('/profile');
                });
            });
        });
    };

};

module.exports.resetPassword = function (req, res) {
    // Validate password
    req.check('password', 'empty password').notEmpty(); 
    req.check('password', '6 to 20 characters required').len(6, 20);
    req.check('password', 'should match').equals(req.body.validate_password);

    var errors = req.validationErrors();
    
    if (errors) {
        // Create a flash error
        req.flash('error', errors[0].msg);
        return res.redirect('/reset/'+req.user.password_token);
    };  
    
    var user = req.user;
    // Set new password
    user.password = req.body.password;
    user.password_token = null;

    // Hash the new password
    user.hashPassword( function(err) {
        if(err) return next(err);

        // Store the user and go back to profile
        user.save(function(err, user){
            req.login(user, function(err){
                if(err) return next(err);
                return res.redirect('/profile');
            });
        });

    });
};

module.exports.logout = function (req, res) {
    // Logout the request
    req.logout();

    // Return to main page
    return res.redirect('/');
};
