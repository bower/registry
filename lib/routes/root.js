'use strict';

var serverStatus = require('../status');

exports.status = function (request, response) {
    response.send(serverStatus);
};
