'use strict';

var http = require('http');

var ServerError = function(status, reason, message, systemError) {
    this.status = status;
    this.reason = reason;
    this.message = message;
    this.systemError = systemError;
    this.errors = [];

    //Allows multiple errors to be added into the response, if necessary
    this.error = function(reason, message) {
        this.errors.push({
            reason: reason,
            message: message
        });

        return this;
    };

    this.toJSON = function() {
        var response = {
            error: {
                code: this.status,
                message: http.STATUS_CODES[this.status],
                errors: this.errors
            }
        };

        return response;
    };

    if (this.reason && this.message) {
        this.error(this.reason, this.message);
    }

    return this;
};

ServerError.LOCATION_TYPES = {
    BODY: "entity-body",
    PATH: "path",
    PARAMETER: "parameter"
};

//TODO : Arrange this by service
//Supported Error reasons
ServerError.REASONS = {
    USER_NOT_AUTHORIZED: "user_not_authorized"
};

exports.ServerError = ServerError;
