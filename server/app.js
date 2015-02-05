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
    Cassandra = require('cassandra-driver'),
    errorMiddleware = require('./middleware/HttpError').httpError,
    tokenMiddleware = require('./middleware/Token').token,
    masterItemsRouter = require('./routers/master_items_Router').router,
    logger = require('./lib/Logger'),
    BaseModel = require('./models/BaseModel'),
    cassandraClient;

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

    app.use(passwordless.sessionSupport());
    app.use(passwordless.acceptToken({
        successRedirect: '/'
    }));

    app.use(tokenMiddleware); //Must be first for token middleware to be handled first
    app.use(masterItemsRouter);

    app.use(errorMiddleware); //Must be last

    callback(null, true);
};

var startCassandra = function(callback) {
    var dbConfig = config.util.cloneDeep(config.db.cassandra);

    logger.info("Starting Cassandra Client");

    //config module v1.0.0 no longer supports mutable config values, so we need to clone it and set it.
    dbConfig.username = process.env.CASS_USER || dbConfig.username;
    dbConfig.password = process.env.CASS_PASS || dbConfig.password;

    cassandraClient = new Cassandra.Client(dbConfig);
    cassandraClient.connect(function(err) {
        /* istanbul ignore if */
        if (err) {
            logger.error("Database Error :\r\n" + JSON.stringify(err, null, 2));
            return callback(new Error("The database failed to connect!"), false);
        }

        cassandraClient.on('log', function(level, className, message, furtherInfo) {
            logger.info('log event: %s \n %s \n %s', level, message, furtherInfo);
        });

        callback(false, true);
    });
};

var setupModels = function(callback) {
    logger.info("Initializing Models");

    BaseModel.prototype.client = cassandraClient;
    BaseModel.prototype.driver = Cassandra;

    callback(false, true);
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
                startCassandra(callback);
            },
            function(callback) {
                setupModels(callback);
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
