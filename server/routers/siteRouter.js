'use strict';

var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.send('Welcome to PeaPosy.com');
});

router.get('/login', function(req, res) {
    res.render('login', {
        title: "?",
        layout: "page",
        user: req.user
    });
});

exports.router = router;
