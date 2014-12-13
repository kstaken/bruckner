var logger;

process.on('message', function(msg) {
    // TODO: this is here so that we can eventually do a graceful exit.
    // For now it just ends the process.
    if (msg.cmd && msg.cmd == 'stop') {
        logger.info("Worker " + cluster.worker.id + " stopping.");
        
        process.exit();    
    }
});

exports.initialize = function(config) {
    logger = config.logger;
}