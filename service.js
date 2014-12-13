'use strict';

/**
 * The Bruckner service controller 
 */

var cluster = require('cluster');

var logger = require('./lib/system/logger').main;

var config = require('./lib/system/config');

// var statsd = require('./lib/system/statsd');

if (cluster.isMaster) {
    logger.info("Initializing Bruckner Master");
    var master = require('./lib/master');
    
    master.initialize({
        logger: logger
    });
}
else {
    logger.info("Worker");
    var worker = require('./lib/worker');

    worker.initialize({
        logger: logger
    });
}