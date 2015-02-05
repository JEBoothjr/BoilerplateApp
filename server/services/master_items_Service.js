'use strict';

var async = require('async'),
    _ = require('lodash'),
    ServerError = require('../lib/Error').ServerError,
    MasterItemsModel = require('../models/master_items_Model');

function MasterItemsService() {
    this.create = function(item_data, callback) {
        var masterItemsModel = new MasterItemsModel(),
            self = this;

        async.series({
            create: function(callback) {
                masterItemsModel.create(item_data, function(err, result) {
                    if (err) {
                        return callback(new ServerError(500, ServerError.REASONS.FAILED_TO_CREATE_ITEM, "Error creating item", err), result);
                    }
                    callback(null, result);
                });
            },
            find: function(callback) {
                self.findById(item_data.id, function(err, result) {
                    callback(err, result);
                });
            }
        }, function(err, result) {
            callback(err, result.find);
        });
    };

    this.findById = function(item_id, callback) {
        var masterItemsModel = new MasterItemsModel();

        masterItemsModel.findById(item_id, function(err, result) {
            //8704 is for an invalid uuid
            if (err && err.code !== 8704) {
                return callback(new ServerError(500, ServerError.REASONS.FAILED_TO_RETRIEVE_ITEM, "Error retrieving item", err));
            }
            if (!result) {
                return callback(new ServerError(404, ServerError.REASONS.ITEM_NOT_FOUND, "Item not found", err));
            }

            callback(null, result);
        });
    };

    this.findAll = function(options, callback) {
        var masterItemsModel = new MasterItemsModel();

        if (arguments.length < 2) {
            callback = _.isFunction(options) ? options : /* istanbul ignore next */ null;
            options = null;
        }
        options = (!_.isObject(options)) ? {} : options;

        masterItemsModel.findAll(options, function(err, result) {
            if (err) {
                return callback(new ServerError(500, ServerError.REASONS.FAILED_TO_RETRIEVE_ITEMS, "Error retrieving items", err));
            }

            //TODO : Decide whether to use a 404 or an empty array
            if (!result || !result.items || result.items.length === 0) {
                return callback(new ServerError(404, ServerError.REASONS.ITEMS_NOT_FOUND, "Items not found", err));
            }

            callback(null, result);
        });
    };

    this.update = function(item_data, callback) {
        var masterItemsModel = new MasterItemsModel(),
            self = this;

        async.series({
            verify: function(callback) {
                self.findById(item_data.id, function(err, result) {
                    if (result && result.is_published) {
                        return callback(new ServerError(400, ServerError.REASONS.CANNOT_UPDATE_PUBLISHED_ITEM, "Cannot update a published item", err));
                    }
                    callback(err, result);
                });
            },
            update: function(callback) {
                masterItemsModel.update(item_data, function(err, result) {
                    callback(err, result);
                });
            },
            retrieve: function(callback) {
                self.findById(item_data.id, function(err, result) {
                    callback(err, result);
                });
            }
        }, function(err, result) {
            //We need to return the 'found' item
            if (err) {
                return callback(new ServerError(err.status || 500, err.reason || ServerError.REASONS.FAILED_TO_UPDATE_ITEM, err.message || "Error updating item", err));
            }
            callback(null, result.retrieve);
        });
    };

    this.delete = function(item_id, callback) {
        var masterItemsModel = new MasterItemsModel(),
            self = this;

        async.series({
            verify: function(callback) {
                self.findById(item_id, function(err, result) {
                    //TODO : What if it is expired?
                    if (result && result.is_published) {
                        return callback(new ServerError(400, ServerError.REASONS.CANNOT_DELETE_PUBLISHED_ITEM, "Cannot delete a published item", err));
                    }
                    callback(err, result);
                });
            },
            del: function(callback) {
                masterItemsModel.delete(item_id, function(err, result) {
                    if (err) {
                        return callback(new ServerError(500, ServerError.REASONS.FAILED_TO_DELETE_ITEM, "Error deleting item", err));
                    }
                    callback(null, result);
                });
            }
        }, function(err, result) {
            callback(err, null);
        });
    };
}

exports.MasterItemsService = new MasterItemsService();
