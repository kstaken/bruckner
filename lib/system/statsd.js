'use strict';

var config = require('./config');

var StatsD = require('node-statsd').StatsD;

var client = new StatsD({
    host: config.statsd.ip,
    mock: config.statsd.mock
});

module.exports = client;