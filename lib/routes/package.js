function routeregistryQuery(query, res) {

  query.then(function (packages) {
    res.send(packages.toArray(), 200);
  }, function (err) {
    console.log(err.stack);
    res.send(err.message || 'Error', err['status-code'] || 400);
  }).done();

}

module.exports = function (app, registry) {

  app.get('/packages', function (req, res) {
    var packages = new registry.Packages(registry);
    var query = packages.all();

    return routeregistryQuery(query, res);
  });


  app.get('/packages/:name', function (req, res) {
    if (!req || !req.params || !req.params.name) {
      res.send('Missing search parameter', 400);
    }

    var packages = new registry.Packages(registry);
    var query = packages.fetch(req.params.name.split(','));

    return routeregistryQuery(query, res);
  });


  app.get('/packages/search/:name', function (req, res) {
    if (!req || !req.params || !req.params.name) {
      res.send('Missing search parameter', 400);
    }

    var packages = new registry.Packages(registry);
    var query = packages.search(req.params.name);

    return routeregistryQuery(query, res);
  });


  app.post('/packages', function (req, res) {
    var pkg = new registry.Package(registry, req.body);

    pkg.save().then(function () {
      res.send({'ok': 'Package created'}, 201);
    }, function (err) {
      if (err['status-code'] === 409) {
        res.send({'error': 'Package already exists' });
      } else {
        res.json(err, 400);
      }
    }).done();

  });

};
