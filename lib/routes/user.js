module.exports = function(app) {

  app.get('/users/:name', function (req, res) {
    var user = new Registry.User(req.params);

    user.find().then(function (data) {
      res.send(data, 201);
    }, function (err) {
      res.json(err, 400);
    }).done();

  });

  app.post('/users/:name', passport.authenticate('digest', { session: false }), function (req, res) {
    var user = new Registry.User(req.body);

    user.save().then(function (data) {
      res.send(data, 201);
    }, function (err) {
      res.json(err, 400);
    }).done();

  });

};
