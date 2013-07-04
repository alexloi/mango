/*================================================
=            ROLES MIDDLEWARE                    =
==================================================*/

'use strict';

var user = require('connect-roles');

// Permitted route
user.use('login', function(req){
    if(!req.user.isAuthenticated){
        return true;
    }
});

user.use('signup', function(req){
    if(!req.user.isAuthenticated){
        return true;
    }
});

user.use('profile', function(req){
    if(req.user.role == 'user' || req.user.role === 'admin'){
        return true;
    }
});

user.use('reset', function(req){
    if(req.user.role == 'user' || req.user.role == 'admin'){
        return true;
    }
});

user.use('forgot', function(req){
    if(!req.user.isAuthenticated){
        return true;
    }
});

// Failure handler
user.setFailureHandler(function(req, res, action){
    action === 'profile' ? res.redirect('/login') : false;
    action === 'login' ?  res.redirect('/profile') : false;
    action === 'signup' ? res.redirect('/profile') : false;
    action === 'forgot' ? res.redirect('/profile') : false;
});