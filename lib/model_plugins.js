/*==============================================
=            MONGOOSE MODEL PLUGINS            =
==============================================*/

'use strict';

var _ = require('lodash')
 , mongoose = require('mongoose')
 , ObjectId = mongoose.Types.ObjectId;

/**
 * Adds an updated field to the document and a pre-save hook to update
 * the time on save.
 */
module.exports.addUpdatedField = function(schema, options) {
    schema.path('updated', Date);
    schema.pre('save', function(next) {
        this.updated = new Date();
        next();
    });
};

/**
 * Transforms model into an API resource. Includes skipping fields, mapping
 * options, skipping and linking resources 
 */
module.exports.modelResource = function(schema, options) {
    var options = options || {}
      , mappings = options.mappings || {}
      , skip = options.skip || []
      , links = options.links || {};

    // add some sane defaults
    mappings._id = 'id';
    skip.push('__v');

    // sanitize trailing slashes
    _.each(links, function(value, key) {
        var len = value.length;
        if (value[len-1] != '/') value += '/';
        links[key] = value;
    });

    var hyperlink = function(url, value) {
        // is the value a mongoose Model?
        // #todo: check if there's a more robust way to do this
        if (value._id != null) return value.mapToResource();
        // is this a dbref?
        if (value instanceof ObjectId) return {uri: url+value, id: value};
        // otherwise just return the value
        return value;
    };

    schema.methods.mapToResource = function() {
        var resource = {};
        _.each(this._doc, function(value, key) {
            var attr, link;
            if (skip.indexOf(key) > -1) return;
            attr = mappings[key] != null ? mappings[key] : key;
            if (links[key] != null) {
                link = links[key];
                value = (Array.isArray(value))
                        ? _.map(value, _.partial(hyperlink, link))
                        : hyperlink(link, value)
            }
            resource[attr] = value;
        });
        resource['uri'] = links.self + this.get('_id');
        return resource;
    };
};