'use strict';

var config = require('config'),
    path = require('path'),
    async = require('async'),
    express = require('express'),
    exphbs = require('express-handlebars'),
    viewHelpers = require('./views/lib/helpers'),
    app = express(),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    domain = require('domain'),
    topDomain = domain.create(),
    errorMiddleware = require('./middleware/HttpError').httpError,
    siteRouter = require('./routers/siteRouter').router,
    logger = require('./lib/Logger');

/* istanbul ignore next */
if (!logger.configured) {
    logger.configure(config.logging.winston);
}

/* istanbul ignore next */
topDomain.on('error', function(error) {
    var message = (error.message || error) + ((error && error.stack) ? "\n" + error.stack : '');

    logger.error(message);
});

var initApp = function(callback) {
    logger.info("Initializing Application");

    app.set('views', './server/views/');
    app.engine('handlebars', exphbs({
        defaultLayout: 'app',
        helpers: viewHelpers,
        layoutsDir: path.join(app.settings.views, "layouts"),
        partialsDir: [
            path.join(app.settings.views, "partials"),
        ]
    }));
    app.set('view engine', 'handlebars');

    app.use(express.static(__dirname + '/public'));

    callback(null, true);
};

var initRoutingAndMiddleware = function(callback) {
    logger.info("Initializing Routing and Middleware");

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());

    app.use(siteRouter);

    app.use(errorMiddleware); //Must be last

    callback(null, true);
};

var startServer = function(callback) {
    logger.info("Starting Server...");

    /* istanbul ignore next */
    var port = config.server.port || process.env.PORT;
    app.set('port', port);

    /* istanbul ignore next */
    var server = app.listen(app.get('port'), function() {
        logger.info('Server listening on port ' + server.address().port);
        return callback(null, true);
    });
};

topDomain.run(function() {

    async.series([
            function(callback) {
                initApp(callback);
            },
            function(callback) {
                initRoutingAndMiddleware(callback);
            },
            function(callback) {
                startServer(callback);
            }
        ],
        /* istanbul ignore next */
        function(err) {
            if (err) {
                logger.error("Server startup sequence failed :\r\n" + err.message + "\r\n" + err.stack);
                setTimeout(function() {
                    process.exit(1);
                }, 2000);
            } else {
                console.log('Server Started : ' + new Date());
            }
        });
});

// For supertest
module.exports = app;
