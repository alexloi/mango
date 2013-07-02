/*====================================
=            AUTH HELPERS            =
====================================*/

'use strict';

var _ = require('lodash')
  , config = require('../config/config')
  , crypto = require('crypto')
  , util = require('util')
  , helpers = require('./helpers');

/**
 * Splits a stored password into salt and password using $ as delim.
 *
 * Params:
 *     - password: the password to split, as a string
 *
 * Examples:
 *     >>> splitPassword('aded$a1ava');
 *     // => {salt: 'aded', password: 'a1ava'}
 */
var splitPassword = function(password) {
    var tokens;
    if (_.isEmpty(password)) return null;
    tokens = password.split('$');
    if (tokens.length == 1) return null;
    return {salt: tokens[0], password: tokens[1]};
};

/**
 * Creates a random salt of a given `size`.
 *
 * Params:
 *     - size: salt size in bytes, defaulting to 5
 *
 * Examples:
 *     >>> auth.salt()
 *     // => 'abfd1acd9a'
 *     >>> auth.salt(3)
 *     // => 'fea12a'
 */
var salt = function(size) {
    if (size == null) size = 5;
    return helpers.rndhex(Math.max(size, 0));
};

/**
 * Makes a hash from a plaintext password using crypto.pbkdf2.
 *
 * Params:
 *     - plaintext: plaintext password
 *     - salt: salt to append on the password
 *     - done: callback getting (err, password), `password` is a string
 *
 * Examples:
 *     >>> pbkdf2('mypassword', 'salt', function(err, password) {
 *             console.log(password);
 *         });
 *     // => undefined
*/
var pbkdf2 = function(plaintext, salt, done) {
    var concat = function(err, password) {
        var hash;
        if (err) return done(err);
        hash = Buffer(password, 'binary').toString('hex');
        return done(null, util.format('%s$%s', salt, hash));
    };
    if (_.isEmpty(plaintext) || _.isEmpty(salt)) return done(null, null);
    crypto.pbkdf2(plaintext, salt, config.pbkdf2.iterations, config.pbkdf2.size, concat);
};

/**
 * Makes a hash from a plaintext password using crypto.md5. Intended
 * for hashing "less critical" passwords.
 *
 * Params:
 *     - plaintest: plaintext password
 *     - salt: salt to append on the password
 *
 * Examples:
 *     >>> md5('mypassword', 'salt');
 *     // => 'salt$afade134adef121...'
 */
var md5 = function(plaintext, salt) {
    var hash;
    if (_.isEmpty(plaintext) || _.isEmpty(salt)) return null;
    hash = crypto.createHash('md5').update(plaintext).digest('hex');
    return util.format('%s$%s', salt, hash);
};

/**
 * Given a User instance and a password, it checks if the supplied
 * password is correct, hence authenticating the user.
 *
 * Params:
 *     - user: a User instance
 *     - password: given input password as string
 *     - done: callback getting (err, authenticated), `authenticated` is a boolean
 *
 * Examples:
 *     >>> authenticateUser(user, 'test', function(err, authenticated){
 *             console.log(authenticated);
 *         });
 *      // => undefined
 */
var authenticateUser = function(user, password, done) {
    var split = splitPassword(user.password);

    if (split == null) return done(null, false);

    var checkPassword = function(err, password) {
        if (err) return done(err);
        done(null, password === user.password);
    };

    pbkdf2(password, split.salt, checkPassword);
};

/**
 * Exports
 */
module.exports.passwords = {};
module.exports.passwords.md5 = md5;
module.exports.passwords.pbkdf2 = pbkdf2;

module.exports.authenticate = {};
module.exports.authenticate.user = authenticateUser;

module.exports.salt = salt;