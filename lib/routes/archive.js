var Archive = require('../models/Archive');

module.exports = function (app) {


    //
    // GET /archives/:name
    //
    app.get('/archives/:name', function (req, res) {
        var archive = new Archive(req.body);

        archive.find(req.params.name).then(function (data) {
            res.send(data, 201);
        }, function (err) {
            res.json(err, 400);
        }).done();

    });

    //
    // GET /archives/:name/:version
    //
    app.get('/archives/:name/:version', function (req, res) {
        if (!req || !req.params || !req.params.name) {
            res.send('Missing search parameter', 400);
        }

        var archive = new Archive(req.body);

        archive.find(req.params.name).then(function (data) {
            res.send(data, 201);
        }, function (err) {
            res.json(err, 400);
        }).done();

    });

    //
    // POST /archives/:name/:version
    //
    app.post('/archives/:name/:version', function (req, res) {
        if (!req || !req.params || !req.params.name) {
            res.send('Missing search parameter', 400);
        }

        var archive = new Archive(req.files);

        archive.save().then(function () {
            res.send({'ok': 'Archive created'}, 201);
        }, function (err) {
            if (err['status-code'] === 409) {
                res.send({'error': 'Archive already exists' });
            } else {
                res.json(err, 400);
            }
        }).done();

    });

};
