/*
//
// controllers.packages
//

var Model = require('../models/package');
var Packages = require('../collections/packages');

//
// GET /
//

function sendError(res, errorData) {
  if (typeof errorData === 'string') {
    errorData = {
      message: errorData,
      'status-code': 400
    };
  }
  errorData = errorData || {};
  return res.send(errorData.message || 'Error',
                  errorData['status-code'] || 400);
}

exports.show = function(req, res) {
  if (!req || req.params || req.params.name) {
    sendError(res, 'Missing search parameter');
  }

  var packages = new Packages();

  packages.show(req.params.name).then(function(data) {
    res.send(data, 200);
  }, function(err) {
    sendError(res, err);
  });
};

exports.index = function(req, res) {

  var packages = new Packages();

  packages.list().then(function(data) {
    res.send(data, 200);
  }, function(err) {
    sendError(res, data);
  });
};

//
// GET /search/:name
//
exports.search = function(req, res) {

  if (!req || req.params || req.params.name) {
    sendError(res, 'Missing search parameter');
  }

  var packages = new Packages();

  packages.search(req.params.name).then(function(data) {
    res.send(data, 200);
  }, function(err) {
    sendError(res, err);
  });

};



//
// POST /
//
exports.create = function(req, res) {

  var model = Model(req.body);

  model.save().then(function (err, data) {
    if (err) {
      return res.json(err, 400);
    }

    return res.send(data, 201);
  });

} */
