'use strict';

var config = require('config'),
    logger = require('../lib/Logger');
//useService = require("../services/UserService").UserService;
//tokenService = require("../services/TokenService").TokenService;

module.exports.token = function(req, res, next) {
    var tokenConfig = config.get('server.auth.token'),
        token = req.headers[tokenConfig.header];

    res.locals.app = res.locals.app || {};
    res.locals.app.user_ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    if (token) {
        next();
        // tokenService.decryptToken(token, function(err, result) {
        //     if (err) {
        //         return next(err);
        //     }
        //     useService.findById(result.userid, function(err, user) {
        //         if (err) {
        //             return next(err);
        //         }
        //         res.locals.app.user = user;

        //         next();
        //     });
        // });
    } else {
        logger.debug("No Token");
        //No token, so let other middleware handle it accordingly
        next();
    }
};
