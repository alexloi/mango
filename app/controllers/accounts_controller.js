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
  , emailService = require('../../services/sendgrid');


module.exports.renderLogin = function (req, res) {
    return res.render('accounts/login', {message: req.flash('error')});
};

module.exports.renderProfile = function (req, res) {
    return res.send('User profile: ', req.user);
};

module.exports.renderVerify = function (req, res) {
    return res.send('Verify email: ' + req.user.email + '<a href="/profile"> Next </a>');
};

module.exports.renderForgot = function (req , res) {
    return res.render('accounts/forgot', {message: req.flash('error')});
};

module.exports.renderReset = function (req, res, next) {
    // Find the token
    console.log('render reset');
    User.findOne({password_token: req.params['token']}, function(err, user){
        if(err) next(err);

        if(!user){
            req.flash('error', 'Token expired or user doesnt exist');
            return res.render('accounts/reset');    
        };

        req.login(user, function(err, user){
            if(err) return next(err);
            return res.render('accounts/reset', {message: req.flash('error') });    
        });
    });
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
    return res.render('accounts/signup', {message: req.flash('error')});
};

module.exports.forgot = function (req, res, next) {
    // Validator
    req.check('email', 'invalid email').notEmpty().isEmail();

    var errors = req.validationErrors();

    if (errors) {
        // Create a flash error
        req.flash('error', errors[0].msg);
        return res.redirect('/forgot');
    };

    // Lowercase email
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

                    var verificationLink = 'http://' + config.serverAddr + '/reset/'+ user.password_token;

                    emailService.send({ from: 'info@streethub.com', 
                                        to: user.email, 
                                        subject: 'forgot password', 
                                        html: '<a href="'+verificationLink+'">Reset here</a>'}, function(success, message){
                                            req.flash('error', message || 'Check your inbox');
                                            return res.redirect('/forgot');
                                        });
                });
            });
        });
    };  

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

    user.hashPassword( function(err) {
        if(err) return next(err);
        
        // Remove the password_token (used for forget password)
        user.password_token = '';

        user.save(function(err, user){
            req.login(user, function(err){
                if(err) return next(err);
                return res.redirect('/profile');
            });
        });

    });
};

module.exports.logout = function (req, res) {
    req.logout();
    return res.redirect('/');
};
