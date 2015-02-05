'use strict';

/**
 * Used internally to the models, this removes column information and null values from the results.
 */
exports.processRows = function(result) {
    var row,
        processed_result = [],
        i,
        prop,
        rows,
        rowLen,
        row_str,
        row_obj;

    if (!result || !result.rows || !result.rows.length) {
        return processed_result;
    }

    rows = result.rows;
    rowLen = rows.length;

    for (i = 0; i < rowLen; i++) {
        row = rows[i];

        //delete null properties
        for (prop in row) {
            if (row[prop] === null) {
                delete row[prop];
            }
        }

        //These are javascript objects and not json, so we have to do this magic to strip it of get methods.
        row_str = JSON.stringify(row);
        row_obj = JSON.parse(row_str);

        processed_result.push(row_obj);
    }

    return processed_result;
};