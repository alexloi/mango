/*=======================================
=            GENERAL HELPERS            =
=======================================*/

'use strict';

var crypto = require('crypto')
  , _ = require('underscore')
  , punct = /[\t !"#$%&\'()*\-\/<=>?@\[\\\]^_`{|},.]+/g;

/**
 * Returns a random hex string of `size` bytes. Note that the resulting string will have
 * *twice* the size specified since it is returned as a hex string.
 *
 * Params:
 *     - size: the size of the string in bytes
 *
 * Examples:
 *     >>> rndhex(3);
 *     // => 'ade2fa'
 */
module.exports.rndhex = function(size) {
    if (size == null) size = 5;
    var buffer = Buffer(crypto.randomBytes(Math.max(0, size)), 'binary');
    return buffer.toString('hex');
};

/**
 * Creates a slug from a string. If the character to replace is at the start
 * or the end of the string then it is removed, otherwise it is replaced with '-'.
 *
 * Params:
 *     - string: the string to slugify
 *
 * Examples:
 *     >>> slugify('hello world');
 *     // => 'hello-world'
 *     >>> slugify('!#hello world');
 *     // => 'hello-world'
 */
module.exports.slugify = function(string) {
    if (string == null) return null;
    var slug = string.toString('utf-8').toLowerCase();
    return slug.replace(punct, function(match) {
        var arglen = arguments.length
          , matchlen = match.length
          , offset = arguments[arglen - 2]
          , strlen = arguments[arglen - 1].length;
        if (offset == 0 || offset == strlen - matchlen) return '';
        return '-';
    });
};