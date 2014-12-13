var cluster = require('cluster');
var _ = require('lodash');

var logger;

//var workerCount = require('os').cpus().length;
var workerCount = 5;

//var workerCount = 10;
//var workerQueue = [];

var activeWorkerCount = 0;
var activeRange = 0;

var shuttingdown = false;

var shutdown = function() {
    logger.info("Shutting down.");
    shuttingdown = true;

    if (_.keys(cluster.workers).length == 0) {
        logger.info("No workers to notify. Exiting.")     
    
        process.exit();
    }   
    else {
        logger.info("Notifying workers to stop.")     
    
        logger.info("Waiting for " + _.keys(cluster.workers).length + " workers to stop.")        
        notifyWorkers({ cmd: "stop" });            
    }        
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

var notifyWorkers = function(msg) {
    for (var id in cluster.workers) {              
        cluster.workers[id].send(msg);                                      
    }
}

var initiateWork = function() {
    var worker = cluster.fork();       
    worker.on('message', messageHandler);

    if (worker) {
        logger.info("Worker starting process")
    }
    else {
        logger.info("No workers available to process")
    }
}

var messageHandler = function(msg) {
    if (msg.hasOwnProperty('processed')) {  
        activeWorkerCount--;          
        
        // Add worker to the available queue
        logger.info("Worker " + msg.workerId + " work completed.")
        //workerQueue.push(cluster.workers[msg.workerId]);
        initiateWork();
    }
    else {
        logger.error("Received notification with unknown message.")
    }
}

cluster.on('exit', function(worker, code, signal) {        
    if (! shuttingdown && code !== 0) {
        logger.info("Worker exited unexpectedly " + worker.id);
        logger.info("Launching a new one");
        initiateWork();
    }

    // If we're shuttingdown and all the workers have exited then the master can exit.
    if (shuttingdown && _.keys(cluster.workers).length == 0) {
        logger.info("All workers have exited. Ending.")
        process.exit();
    }            
})

var launchEtcd = function() {

}

var launchNsqd = function() {

}

var launchNsqdLookup = function() {

}

exports.initialize = function(config) {
    logger = config.logger;

    // Setup the workers.
    for (var i = 0; i < workerCount; i++) {
        setTimeout(initiateWork, i * 5000);
    }
}