'use strict';

var express = require('express'),
    router = express.Router(),
    config = require('config'),
    masterItemsService = require('../services/master_items_Service').MasterItemsService,
    ServerError = require('../lib/Error').ServerError;

function validateItemData(data, keys) {
    var prop,
        result = [];

    keys = keys || ["name", "description"];

    for (prop in data) {
        if (keys.indexOf(prop) === -1) {
            result.push(prop);
        }
    }
    return result;
}

router.post(config.get('server.api_root') + '/items', function(req, res, next) {
    var itemData = req.body,
        serverError,
        invalidKeys,
        i,
        len;

    if (!itemData || !itemData.hasOwnProperty('name') || (itemData.name.length === 0)) {
        return next(new ServerError(400, ServerError.REASONS.MISSING_REQUIRED_PROPERTY, "'name' is required"));
    }

    invalidKeys = validateItemData(itemData);
    len = invalidKeys.length;

    if (len > 0) {
        serverError = new ServerError(400);
        for (i = 0; i < len; i++) {
            serverError.error(ServerError.REASONS.UNSUPPORTED_PROPERTIES, "'" + invalidKeys[i] + "' is not supported");
        }
        return next(serverError);
    }

    masterItemsService.create(itemData, function(err, result) {
        if (err) {
            return next(err);
        }

        res.status(200).json(result);
    });
});

router.get(config.get('server.api_root') + '/items/:item_id', function(req, res, next) {
    masterItemsService.findById(req.params.item_id, function(err, result) {
        if (err) {
            return next(err);
        }

        res.status(200).json(result);
    });
});

router.get(config.get('server.api_root') + '/items', function(req, res, next) {
    var reqOpts = {
        limit: parseInt(req.query.limit) || null,
        next: req.query.next || null
    };

    masterItemsService.findAll(reqOpts, function(err, result) {
        if (err) {
            return next(err);
        }
        res.status(200).json(result);
    });
});

router.put(config.get('server.api_root') + '/items/:item_id', function(req, res, next) {
    var itemData = req.body,
        serverError,
        invalidKeys,
        len,
        i;

    if (!itemData || !itemData.hasOwnProperty('name') || (itemData.name.length === 0)) {
        return next(new ServerError(400, ServerError.REASONS.MISSING_REQUIRED_PROPERTY, "'name' is required"));
    }

    invalidKeys = validateItemData(itemData);
    len = invalidKeys.length;

    if (len > 0) {
        serverError = new ServerError(400);
        for (i = 0; i < len; i++) {
            serverError.error(ServerError.REASONS.UNSUPPORTED_PROPERTIES, "'" + invalidKeys[i] + "' is not supported");
        }
        return next(serverError);
    }

    itemData.id = req.params.item_id;

    masterItemsService.update(itemData, function(err, result) {
        if (err) {
            return next(err);
        }

        res.status(200).json(result);
    });
});

router.delete(config.get('server.api_root') + '/items/:item_id', function(req, res, next) {
    masterItemsService.delete(req.params.item_id, function(err, result) {
        if (err) {
            return next(err);
        }

        res.status(200).json(result);
    });
});

exports.router = router;
