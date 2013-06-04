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
    sessionSecret: 'mang0isp0warfuLL',
    app: {
        name: 'mango',
        domain: 'mango.co'
    },
    db: {
        name: 'mango',
        mongoHqUri: 'mongodb://alex:alap8790@dharma.mongohq.com:10069/mango'
    },
    social: {
        facebook: {
            appId: '163922760454149',
            appSecret: 'f38003fd42c83c72c0f7d58d6308add9',
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
        key: 'AKIAJ2CIJSY53IIYQ7QQ',
        secret: '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'
    },
    cdn: {
        domain: 'cdn.streethub.com',
        bucket: 'streethub-assets'
    }
};

module.exports = config;
