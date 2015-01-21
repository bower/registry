/*jshint expr: true*/

delete require.cache[require.resolve('config')];
process.env.NODE_ENV = 'test';

var request = require('request');
var FormData = require('form-data');
var expect = require('chai').expect;
var spawn = require('child_process').spawn;

var config = require('config');
var database = require('../lib/database');

var bowerServerUrl = 'http://localhost:' + config.get('port');

describe('registry server', function(){
    var server = null;

    before(function(done){
        database.dropDatabase().then(function () {
            return database.createDatabase();
        }).then(function () {
            return database.migrate();
        }).then(function () {
            server = spawn('node', ['index.js']);

            server.stderr.on('data', function(data){
                console.error(data.toString());
            });

            server.stdout.on('data', function(data) {
                if (data.toString().match('ready\.')) {
                    done();
                }
            });
        });
    });

    beforeEach(function (done) {
        database.truncate(done);
    });

    after(function(){
        server.kill();
    });

    describe('headers', function() {
        it('should support CORS', function (done) {
            request.get(bowerServerUrl + '/status', function (err, res, body){
                expect(res.headers['access-control-allow-origin']).not.to.be.null;
                done();
            });
        });
    });

    describe('routes', function() {
        describe('/status', function() {
            it('should return 200 when server is running', function (done) {
                request.get(bowerServerUrl + '/status', function (err, res, body){
                    expect(res.statusCode).to.equal(200);
                    done();
                });
            });
        });

        describe('/packages', function() {
            beforeEach(function (done) {
                database.insertPackage('jquery', 'git://github.com/jquery/jquery', done);
            });

            it('shound properly setup database so status is 200', function (done) {
                request.get(bowerServerUrl + '/packages', function (err, res, body){
                    expect(res.statusCode).to.equal(200);
                    done();
                });
            });

            it('shound properly fetch packages list', function (done) {
                request.get(bowerServerUrl + '/packages', function (err, res, body){
                    expect(JSON.parse(body)).to.eql([{
                        'name': 'jquery',
                        'url': 'git://github.com/jquery/jquery',
                        'hits': 0
                    }]);

                    done();
                });
            });

            it('shound properly fetch one package', function (done) {
                request.get(bowerServerUrl + '/packages/jquery', function (err, res, body){
                    expect(JSON.parse(body)).to.eql({
                        'name': 'jquery',
                        'url': 'git://github.com/jquery/jquery',
                        'hits': 0
                    });

                    done();
                });
            });

            it.skip('shound properly bump hit count on single package', function (done) {
                request.get(bowerServerUrl + '/packages/jquery', function (err, res){
                    request.get(bowerServerUrl + '/packages/jquery', function (err, res, body){
                        expect(JSON.parse(body)).to.eql({
                            'name': 'jquery',
                            'url': 'git://github.com/jquery/jquery',
                            'hits': 1
                        });

                        done();
                    });
                });
            });

            it('should allow searches by GETting /packages/search/:name', function (done) {
                var url = bowerServerUrl + '/packages/search/jquery';

                request.get(url, function (err, res, body) {
                    expect(res.statusCode).to.eq(200);
                    expect(JSON.parse(res.body)).to.eql(
                        [{'name':'jquery','url':'git://github.com/jquery/jquery'}]
                    )
                    done();
                });
            });

            it('should not create a package when an invalid URL is provided', function (done) {
                request.post(bowerServerUrl + '/packages', {
                    form: { 'name': 'jquery', 'url': 'jquery.com' }
                }, function (err, res, body){
                    expect(res.statusCode).to.eq(400);
                    done();
                });
            });

            it('should create a package when POSTing to /packages', function (done) {
                request.post(bowerServerUrl + '/packages', {
                    form: { 'name': 'loom', 'url': 'git://github.com/rpflorence/loom.git' }
                }, function (err, res, body){
                    expect(res.statusCode).to.eq(201);
                    done();
                });
            });

            it('should error when a package has already been registered', function (done) {
                request.post(bowerServerUrl + '/packages', {
                    form: { 'name': 'jquery', 'url': 'git://github.com/jquery/jquery.git' }
                }, function (err, res, body) {
                    expect(res.statusCode).to.eq(403);
                    done();
                });
            });
        });
    });

    describe('server', function(){
        // curl -F uses multipart, we want to make sure we keep curl functionality
        it('should support curl', function (done) {
            // code checks github to make sure the url is valid, we should give it some time.
            var form = new FormData();
            form.append('url', 'notvalid');
            form.append('name','jquery');
            form.submit(bowerServerUrl + '/packages', function(err, res) {
                // We expect a 400 because it is an invalid url and the db is not setup
                // We get a 500 if multipart is not instantiated in index
                expect(res.statusCode).to.equal(400);
                done();
            });
        });
    });
});
