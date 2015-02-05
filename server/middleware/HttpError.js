'use strict';

var logger = require('../lib/Logger');

module.exports.httpError = function(err, req, res, next) {
    var responseError = err.toJSON();

    if (responseError.error.code === 500) {
        logger.error(JSON.stringify({
            responseError: responseError,
            systemError: err.systemError
        }, null, 2));
    }

    res.status(responseError.error.code).json(err.toJSON());

    next();
};