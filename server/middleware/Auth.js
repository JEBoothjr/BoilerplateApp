'use strict';

var ServerError = require('../lib/Error').ServerError;

module.exports.isAuthorized = function(req, res, next) {
    if (!req.user) {
        return next(new ServerError(401, ServerError.REASONS.USER_NOT_AUTHORIZED, "User not authorized", null));
    }
    next();
};