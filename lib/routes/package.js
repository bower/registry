function routeRegistryQuery(query, res) {
  query.then(function (packages) {
    res.send(packages.toArray(), 200);
  }, function (err) {
    console.log(err.stack);
    res.send(err.message || 'Error', err['status-code'] || 400);
  }).done();
}

module.exports = function(app) {
  app.get('/packages', function (req, res) {
    var packages = new Registry.Packages();
    var query = packages.all();

    routeRegistryQuery(query, res);
  });


  app.get('/packages/:name', function (req, res) {
    if (!req || req.params || req.params.name) {
      res.send('Missing search parameter', 400);
    }

    var packages = new Registry.Packages();
    var query = packages.fetch(req.params.name);

    routeRegistryQuery(query, res);
  });


  app.get('/packages/search/:name', function (req, res) {
    if (!req || req.params || req.params.name) {
      res.send('Missing search parameter', 400);
    }

    var query = Registry.Packages.search(req.params.name);

    routeRegistryQuery(query, res);
  });


  app.post('/packages', function (req, res) {
    var pkg = Registry.Package(req.body);

    pkg.save().then(function (data) {
      res.send(data, 201);
    }, function (err) {
      res.json(err, 400);
    }).done();

  });
};
