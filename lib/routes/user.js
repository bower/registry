var passport = require('passport');

module.exports = function (app, registry) {


  //
  // GET /users/:name
  //
  app.get('/users/:name', function (req, res) {
    var user = new registry.User(registry, req.body);

    user.find(req.params.name).then(function (data) {
      res.send(data, 201);
    }, function (err) {
      res.json(err, 400);
    }).done();

  });

  //
  // POST /users/:name
  //
  app.post('/users/:name', function (req, res) {
    if (!req || !req.params || !req.params.name) {
      res.send('Missing search parameter', 400);
    }

    var user = new registry.User(registry, req.body);

    user.save().then(function () {
      res.send({'ok': 'User created'}, 201);
    }, function (err) {
      if (err['status-code'] === 409) {
        res.send({'error': 'User already exists' });
      } else {
        res.json(err, 400);
      }
    }).done();

  });


  //
  // PUT /users/:name
  //
  app.put('/users/:name', function (req, res) {
    if (!req || !req.params || !req.params.name) {
      res.send('Missing search parameter', 400);
    }

    var user = new registry.User(registry, req.body);

    user.update().then(function () {
      res.send({'ok': 'User updated'}, 201);
    }, function (err) {
      res.json(err, 400);
    }).done();

  });


  //
  // DELETE /users/:name
  //
  app.del('/users/:name', passport.authenticate('digest', { session: false }), function (req, res) {
    if (!req || !req.params || !req.params.name) {
      res.send('Missing search parameter', 400);
    }

    var user = new registry.User(registry, req.body);

    user.destroy(req.params.name).then(function () {
      res.send(204);
    }, function (err) {
      res.send(err.message || 'Error', err['status-code'] || 400);
    });

  });

};
