/*==================================
=            USER MODEL            =
==================================*/

'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , auth = require('../../lib/auth')
  , authTypes = ['facebook']
  , plugins = require('../../lib/model_plugins');

/**
 * Loosely asserts on a value being an email address.
 *
 * Params:
 *     - value: the value to check, as a string
 *
 * Examples:
 *     >>> isEmail('foo');
 *     // => false
 *     >>> isEmail('foo@bar.com');
 *     // => true
 */
var isEmail = function(value) {
    return (/.+@.+\..+/).test(value);
};

var UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    family_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true,
        trim: true,
        validate: [isEmail, 'invalid email address'],
        index: {
            name: 1,
            type: -1,
        }
    },
    username: {
        type: String,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String
    },
    // Forgot password
    password_token: {
        type: String,
        unique: true,
        sparse: true,
        index: {
            name: 1,
            type: -1
        }
    },
    role: { 
        type: String, 
        required: true, 
        enum: ['user','admin']
    },
    face_uid: {
        type: String,
        index: {
            unique: true,
            sparse: true,
        },
        default: null
    },
    accounts: []
});

/* Creates a virtual attribute for the model */
UserSchema.virtual('fullName')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    });

UserSchema.plugin(plugins.addUpdatedField);
UserSchema.plugin(plugins.modelResource, {
    links: {
        self: '/api/users/'
    },
    skip: ['password']
});

UserSchema.methods.hashPassword = function(done) {
    var self = this;
    auth.passwords.pbkdf2(self.password, auth.salt(), function(err, password) {
        if (err) return done(err);
        if (password == null) return done(new Error('cannot create pbkdf2 password'));
        self.password = password;
        done(null);
    });
};

UserSchema.methods.generatePasswordToken = function(done) {
    var self = this;
    auth.forgot.email(function(err, token){
        if (err) return done(err);
        self.password_token = token;

        done(null);
    });
};

mongoose.model('User', UserSchema);