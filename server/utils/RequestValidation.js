'use strict';

var ServerError = require('../lib/Error').ServerError;

/**
 * Checks to make sure that only valid keys are in the data.
 * @param  {Object} data         The object to be inspected
 * @param  {Array} valid_keys Arrays of valid keys
 * @param  {Boolean} Whether to generate a server error.
 * @return {Array} Array of invalid keys
 */
exports.inspectValidKeys = function(data, valid_keys, generateError) {
    var key,
        unsupported_result = [],
        invalid_result = [],
        unsup_len,
        inval_len,
        serverError,
        i;

    generateError = generateError || false;

    valid_keys = valid_keys || [];

    for (key in data) {
        if (valid_keys.indexOf(key) === -1) {
            unsupported_result.push(key);
        }

        //TODO : The values cannot be empty, for now. To be resolved later...
        if (data[key].length === 0) {
            invalid_result.push(key);
        }
    }

    if (generateError) {
        unsup_len = unsupported_result.length;
        inval_len = invalid_result.length;

        if (unsup_len || inval_len) {
            serverError = new ServerError(400);

            for (i = 0; i < unsup_len; i++) {
                serverError.error(ServerError.REASONS.UNSUPPORTED_PROPERTIES, "'" + unsupported_result[i] + "' is not supported");
            }
            for (i = 0; i < inval_len; i++) {
                serverError.error(ServerError.REASONS.INVALID_PROPERTIES, "'" + invalid_result[i] + "' is invalid");
            }
            return serverError;
        } else {
            return null;
        }
    }

    return unsupported_result.concat(invalid_result);
};

/**
 * Checks to make sure that required keys are in the data.
 * @param  {Object} data         The object to be inspected
 * @param  {Array} required_keys Arrays of required keys
 * @param  {Boolean} Whether to generate a server error.
 * @return {Array} Array of missing keys
 */
exports.inspectRequiredData = function(data, required_keys, generateError) {
    var i,
        key,
        len,
        result = [],
        serverError;

    generateError = generateError || false;

    required_keys = required_keys || [];

    len = required_keys.length;

    for (i = 0; i < len; i++) {
        key = required_keys[i];

        if (!data || !data.hasOwnProperty(key) || (data[key].length === 0)) {
            result.push(key);
        }
    }

    if (generateError) {
        len = result.length;

        if (len) {
            serverError = new ServerError(400);

            for (i = 0; i < len; i++) {
                serverError.error(ServerError.REASONS.MISSING_REQUIRED_PROPERTY, "'" + result[i] + "' is required");
            }
            return serverError;
        } else {
            return null;
        }
    }

    return result;
};