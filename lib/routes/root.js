'use strict';

var serverStatus = require('../status');

module.exports.status = function (request, response) {
	response.send(serverStatus);
};
