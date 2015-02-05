'use strict';
/**
 * Used by the services, this is to remove specific data values that we don't want returned to the client.
 */
exports.processResults = function(result, blacklist) {
    var item,
        processed_result = [],
        i,
        j,
        len,
        listLen,
        blackListed,
        isSingle = !result ? false : !result.length;

    //Send it back
    if (!result) {
        return processed_result; //TODO : Is this what we want? Or an empty array? OR empty Object?
    }

    //If we get a single object, lets add it to an array to use te same code.
    if (!result.length) {
        result = [result];
    }

    blacklist = blacklist || [];
    listLen = blacklist.length;

    len = result.length;

    for (i = 0; i < len; i++) {
        item = result[i];

        //delete unwanted properties
        for (j = 0; j < listLen; j++) {
            blackListed = blacklist[j];
            delete item[blackListed];
        }

        processed_result.push(item);
    }

    //If we get a single object, lets just only it back.
    return isSingle ? processed_result[0] : processed_result;
};