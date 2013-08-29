var pkgJson   = require('../../package.json');

module.exports = function (app) {

  app.get('/', function (req, res) {
    var payload = {
      'registry': pkgJson.version,
      'name': pkgJson.name,
      'description': pkgJson.description
    };

    return res.json(payload, 200);

  });

};

