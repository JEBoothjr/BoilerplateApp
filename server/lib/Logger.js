"use strict";

var winston = require('winston'),
    defaultLevels = {
        silly: 0,
        debug: 1,
        verbose: 2,
        info: 3,
        warn: 4,
        error: 5
    },
    defaultFolder = "./logs",
    mkdirp = require('mkdirp'),
    transportState = null;

function Logger() {
    this.config = null;
    this.configured = false;
    this.internal_logger = new(winston.Logger)();
}

Logger.prototype.configure = function(config) {
    var i,
        len,
        transport,
        transportDefinition,
        folder,
        doExitOnError,
        levels,
        level,
        func;

    this.config = config;

    if (!config) {
        throw new Error("No configuration has been supplied.");
    }

    if (!config.transports || config.transports.length === 0) {
        throw new Error("Missing transport definitions for logging.");
    }

    if (this.configured) {
        throw new Error("The logger is already configured.");
    }

    doExitOnError = config.exitOnError;
    this.internal_logger.exitOnError = (typeof doExitOnError === 'undefined') ? false : doExitOnError;

    //Create the log folder if it doesn't exist
    folder = config.folder || defaultFolder;
    mkdirp.sync(folder);

    levels = config.levels || defaultLevels;
    this.internal_logger.setLevels(levels);

    func = function(level) {
        if (!Logger.prototype[level]) {
            Logger.prototype[level] = function() {
                var args = Array.prototype.slice.call(arguments),
                    str = args.join(" ");

                this.internal_logger[level].call(this, str);
            };
        }
    };

    for (level in levels) {
        func(level);
    }

    len = config.transports.length;
    for (i = 0; i < len; i++) {
        transportDefinition = config.transports[i];
        transport = winston.transports[transportDefinition.name];

        this.internal_logger.add(transport, transportDefinition.options);
    }

    this.configured = true;

    return this;
};

Logger.prototype.instance = function() {
    return this.internal_logger;
};

Logger.prototype.log = function(level, msg) {
    this.internal_logger.log(level, msg);
};

Logger.prototype.addTransport = function(transport, options) {
    this.internal_logger.add(transport, options);
};

Logger.prototype.removeTransport = function(transport) {
    this.internal_logger.remove(transport);
};

Logger.prototype.setLevel = function(level, transportName, silent) {
    var tp,
        result = false;

    if (typeof this.internal_logger.levels[level] === 'undefined') {

        /* istanbul ignore if */
        if (!silent) {
            console.log("Unsupported log level, " + level + ". Looking for one of these :");
            console.log(JSON.stringify(this.internal_logger.levels, null, 2));
        }

        return result;
    }

    transportName = transportName || 'all';
    transportState = {};

    for (tp in this.internal_logger.transports) {
        if (tp === transportName || transportName === 'all') {
            transportState[tp] = this.internal_logger.transports[tp].level;
            this.internal_logger.transports[tp].level = level;

            result = true;

            /* istanbul ignore if */
            if (!silent) {
                console.log("Setting log level for " + tp + " to " + level + ".");
            }
        }
    }

    return result;
};

Logger.prototype.revertLevel = function(silent) {
    var ts,
        result = false;

    for (ts in transportState) {
        this.internal_logger.transports[ts].level = transportState[ts];

        result = true;

        /* istanbul ignore if */
        if (!silent) {
            console.log("Reverting log level for " + ts + " to " + transportState[ts] + ".");
        }
    }

    return result;
};

module.exports = exports = new Logger();
