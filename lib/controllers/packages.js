//
// controllers.packages
//

var Model = require('../models/package');

//
// GET /
//
exports.index = function(req, res) {

  'use strict';

  Model.list(function(err, data) {
    if (err) {
      return res.send(err.message, err['status-code']);
    }

    return res.send(data, 200);
  });

};

//
// GET /id
//
exports.show = function(req, res) {

  'use strict';

  if (req && req.params) {

    Model.find(req.params.name, function(err, data) {
      if (err) {
        return res.send(err.message, err['status-code']);
      }

      return res.send(data, 200);
    });

  }

};


exports.search = function(req, res, next) {

  'use strict';

  Model.search(req.params.name, function(err, data) {
    if (err) {
      return res.send(err.message, err['status-code']);
    }

    return res.send(data, 200);

  });

};



//
// POST /
//
exports.create = function(req, res) {

  'use strict';

  var model = Model.factory(req.body);

  model.save(function (err, data) {
    if (err) {
      return res.json(err, 400);
    }

    return res.send(data, 201);
  });

};
