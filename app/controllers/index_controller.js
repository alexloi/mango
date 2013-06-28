/*========================================
=            INDEX CONTROLLER            =
========================================*/

'use strict';

exports.index = function(req, res) {
    return res.send('Index page');
    //return res.render('landing/index');
};

exports.login = function (req, res) {
    return res.send('<a href="/auth/facebook"> Login Facebook </a>');
    //return res.render('landing/login');
};
