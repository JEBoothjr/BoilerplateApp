"use strict";

var util = require('util'),
    _ = require('lodash'),
    BaseModel = require('./BaseModel'),
    findAllQuery = "SELECT * FROM master_items;",
    findByIdQuery = "SELECT * FROM master_items WHERE id = ?;",
    createQuery = "INSERT INTO master_items (id, name, description) VALUES(?, ?, ?);",
    updateQuery = "UPDATE master_items SET <%> WHERE id=?",
    deleteQuery = "DELETE FROM master_items WHERE id=?;";

function MasterItemsModel() {
    BaseModel.apply(this, arguments);
}

util.inherits(MasterItemsModel, BaseModel);
MasterItemsModel.prototype.name = 'MasterItemsModel';

MasterItemsModel.prototype.create = function(item_data, callback) {
    item_data.id = this.driver.types.timeuuid();
    item_data.created_at = new Date();
    item_data.expires_at = (item_data.expires_at) ? new Date(item_data.expires_at) : null;

    //TODO : send error if expires_at is less than the current date.

    this.execute(createQuery, [item_data.id, item_data.name, item_data.description], null, function(err, result) {
        if (err) {
            return callback(err);
        }

        //Only return the id. The service will to a proper lookup
        callback(null, {
            id: item_data.id
        });
    });
};

MasterItemsModel.prototype.findAll = function(options, callback) {
    var self = this,
        fetchOpt = {
            prepare: 1
        },
        DEFAULT_PAGE_SIZE = 50;

    if (arguments.length < 2) {
        callback = _.isFunction(options) ? options : /* istanbul ignore next */ null;
        options = null;
    }
    options = (!_.isObject(options)) ? {} : options;

    if (options.limit) {
        fetchOpt.fetchSize = options.limit;
    } else {
        fetchOpt.fetchSize = DEFAULT_PAGE_SIZE;
    }

    fetchOpt.pageState = options.next ? new Buffer(options.next, 'hex') : null; //Convert the pageStage back to a buffer

    this.execute(findAllQuery, null, fetchOpt, function(err, result) {
        if (err) {
            return callback(err);
        }

        var pageState = result.meta && result.meta.pageState ? result.meta.pageState.toString('hex') : null; //Send this to client

        result = self.processRows(result);

        callback(null, {
            _metadata: {
                cursor: {
                    //previous: options.pageState || null,//Not sure how the cassandra drive does previous
                    next: pageState
                }
            },
            items: result
        });
    });
};

MasterItemsModel.prototype.findById = function(item_id, callback) {
    var self = this;

    this.execute(findByIdQuery, [item_id], null, function(err, result) {
        if (err) {
            return callback(err);
        }

        result = self.processRows(result)[0] || null;

        callback(null, result);
    });
};

//TODO : maybe only generate the code at publish time
MasterItemsModel.prototype.update = function(item_data, callback) {
    var itemId = item_data.id,
        query;

    item_data = _.clone(item_data); //Since we're modifying an upstream object, let's clone it to prevent issues.
    delete item_data.id; //We don't want this in the query

    query = this.buildSetQuery(updateQuery, item_data);

    this.execute(query, [itemId], null, function(err, result) {
        if (err) {
            return callback(err);
        }

        //Only return the id. The service will to a proper lookup
        callback(null, {
            id: itemId
        });
    });
};

MasterItemsModel.prototype.delete = function(item_id, callback) {
    this.execute(deleteQuery, [item_id], null, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, null);
    });
};

module.exports = exports = MasterItemsModel;
