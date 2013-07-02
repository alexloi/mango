/*====================================
=            SENDGRID SERVICE            =
====================================*/

var _ = require('lodash')
  , config = require('../config/config')
  , util = require('util')
  , Sendgrid = require('sendgrid').SendGrid
  , mailer = new Sendgrid(config.services.sendgrid.user, config.services.sendgrid.pass);

/**
* Send off the email with the SendGrid based mailer and return the response
*
* Usage
* -----
* send({from:'', to:'', subject:'', html:''}, cb)
*
* Will send email and return the response to the calling fn callback
* Reference #sendgrid : https://github.com/sendgrid/sendgrid-nodejs 
* 
* ! cb should take success, message
*
* Example
* -------
* emailService.send({from:'x@x.com', to:'y@y.us', subject:'test', html:'this!'}, function(success, message){
        console.log('success:', success, 'message', message);
    }); 
* Returns
* -------
* success(bool) , message(string)
**/

var send = function(params, cb) {
    mailer.send(params, function(success, message){
        return cb(success, message);
    });
};

/**
* Exports
**/
module.exports.send = send;

