var pkg   = require('../../package.json');

module.exports = function (app) {

  app.get('/', function (req, res) {
    var payload = {
      'registry': pkg.version,
      'name': pkg.name,
      'description': pkg.description
    };

    return res.json(payload, 200);

  });

};

