var nock = require('nock');
var _ = require('lodash');

function couchDateNow() {
  return new Date().toString().replace(/GMT(.*)$/, 'GMT');
};

// nock.recorder.rec();

module.exports = function(url, options, ddocs) {

  // delete database
  nock(url)
    .delete('/' + options.database)
    .reply(200, "{\"ok\":true}\n", { 
      server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
      date: couchDateNow(),
      'content-type': 'application/json',
      'content-length': '12',
      'cache-control': 'must-revalidate'
    });

  // create database
  nock(url)
    .put('/' + options.database)
    .reply(201, "{\"ok\":true}\n", { 
      server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
      location: url + '/' + options.database,
      date: couchDateNow(),
      'content-type': 'application/json',
      'content-length': '12',
      'cache-control': 'must-revalidate' });

  // create ddocs (couchApp)
  ddocs.forEach(function(doc) {
    // default attachment objects
    doc['attachments_md5'] = doc['attachments_md5'] || {};
    doc._attachments = doc._attachments || {};

    var rev = '1-510f49198b34aeeadec0ebd28e20c20c';
    var put = JSON.stringify(doc);
    var get = JSON.stringify(_.extend({}, doc, {rev: rev}));

    // put doc
    nock(url)
      .put('/' + options.database + '/' + doc['_id'], put)
      .reply(201, '"{\"ok\":true,\"id\":\"' + doc['id'] + '\",\"rev\":\"' + rev +'\"}\n"', {
        server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
        location: [url, options.database, doc['_id']].join('/'),
        etag: '"' + rev + '"',
        date: couchDateNow(),
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '79',
        'cache-control': 'must-revalidate' 
      });

    // get/verify doc
    nock(url)
      .get('/' + options.database + '/' + doc['_id'])
      .reply(200, get, {
        etag: '"' + rev + '"',
        date: couchDateNow(),
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '386',
        'cache-control': 'must-revalidate' 
      });
  });

};

