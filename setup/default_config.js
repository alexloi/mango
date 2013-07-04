/*=======================================================
=            DEFAULT CONFIGURATION VARIABLES            =
=======================================================*/
/* 
 * Default configuration file, includes AWS keys, Social keys etc.
 * Note: CDN config is based on https://npmjs.org/package/express-cdn
 * 
 * REMINDER: rename this file to config.js when done
 *           --> setup/config.js is in .gitignore by default
 */

var config = {
    sessionSecret: 'Ub3rS3cr3t',
    app: {
        name: '',
        domain: ''
    },
    db: {
        name: '',
    },
    social: {
        facebook: {
            appId: '',
            appSecret: '',
        },
        twitter: {
            appId: '',
            appSecret: ''
        },
        github: {
            appId: '',
            appSecret: ''
        }   
    },
    aws: {
        key: '',
        secret: ''
    },
    cdn: {
        domain: '',
        bucket: '',
        endpoint: ''
    },
    services: {
        sendgrid:{
            user: '',
            pass: ''
        }
    }
};

module.exports = config;


