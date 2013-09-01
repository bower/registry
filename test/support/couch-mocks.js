var nock = require('nock');
var _ = require('lodash');

/* jshint quotmark:false */

module.exports = function (url, options, ddocs) {

  // delete attempt
  nock(url)
    .delete('/' + options.db.name)
    .reply(404, "{\"error\":\"not_found\",\"reason\":\"missing\"}\n", { server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
    date: couchDateNow(),
    'content-type': 'application/json',
    'content-length': '41',
    'cache-control': 'must-revalidate' });

  // creation of db
  nock(url)
    .put('/' + options.db.name)
    .reply(201, "{\"ok\":true}\n", { server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
    location: url + '/' + options.db.name,
    date: couchDateNow(),
    'content-type': 'application/json',
    'content-length': '12',
    'cache-control': 'must-revalidate' });

  nock(url)
    .get('/' + options.db.name + '/_design/packages/_view/byDate?descending=false')
    .reply(200, {
      "total_rows": 1,
      "offset": 0,
      "rows": [
        {
          "id": "test1",
          "key": null,
          "value": {
              "_id": "test1",
              "_rev": "1-1c55ebc8d332c8382c7c9e7d8a8be18f",
              "name": "test1",
              "description": null,
              "type": "git",
              "owners": [],
              "versions": [],
              "keywords": [],
              "url": "git://",
              "resource": "packages",
              "ctime": "2013-08-29T20:09:08.922Z"
            }
          }
        ]
      });

  nock(url)
    .get('/' + options.db.name + '/_all_docs?include_docs=true')
    .reply(200, {
      "total_rows": 1,
      "offset": 0,
      "rows": [
        {
          "id": "test1",
          "key": "test1",
          "value": {
            "rev": "1-1c55ebc8d332c8382c7c9e7d8a8be18f"
          },
          "doc": {
            "_id": "test1",
            "_rev": "1-1c55ebc8d332c8382c7c9e7d8a8be18f",
            "name": "test1",
            "description": null,
            "type": "git",
            "owners": [],
            "versions": [],
            "keywords": [],
            "url": "git://",
            "resource": "packages",
            "ctime": "2013-08-29T20:09:08.922Z"
          }
        }
      ]
    });



  // create ddocs (couchApp)
  ddocs.forEach(function (ddocument) {

    // default attachment objects
    var doc = prepareDdoc(ddocument);
    doc.attachments_md5 = doc.attachments_md5 || {};
    doc._attachments = doc._attachments || {};

    var path = '/' + options.db.name + '/' + doc._id;

    var rev = '1-510f49198b34aeeadec0ebd28e20c20c';
    var payload = JSON.stringify(doc);
    var payloadWithRev = JSON.stringify(_.extend({}, doc, {rev: rev}));

    // get [missing] docs
    nock(url)
      .get(path)
      .reply(404, "{\"error\":\"not_found\",\"reason\":\"missing\"}\n", {
        server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
        date: couchDateNow(),
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '41',
        'cache-control': 'must-revalidate'
      });

    // put docs - no rev
    nock(url)
      .put(path, payload)
      .reply(201, "{\"ok\":true,\"id\":\"" + doc._id + "\",\"rev\":\"" + rev + "\"}\n", {
        server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
        location: url + '/' + options.db.name + '/_design/packages',
        etag: '"' + rev + '"',
        date: couchDateNow(),
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '79',
        'cache-control': 'must-revalidate'
      });

    // put docs - with rev
    nock(url)
      .put(path, payloadWithRev)
      .reply(201, "{\"ok\":true,\"id\":\"" + doc._id + "\",\"rev\":\"" + rev + "\"}\n", {
        server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
        location: url + '/' + options.db.name + '/_design/packages',
        etag: '"' + rev + '"',
        date: couchDateNow(),
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '79',
        'cache-control': 'must-revalidate'
      });

    // get [now present] docs
    nock(url)
      .get(path)
      .reply(200, payloadWithRev, {
        server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
        etag: '"' + rev + '"',
        date: couchDateNow(),
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '386',
        'cache-control': 'must-revalidate'
      });
  });
};



var couchDateNow = module.exports.couchDateNow = function () {
  return new Date().toString().replace(/GMT(.*)$/, 'GMT').replace('2013', '2015');
};

var prepareDdoc = module.exports.couchDateNow = function (ddocument) {
  var ddoc = _.extend({}, ddocument);
  var recurse = function (obj) {
    for (var key in obj) {
      var item = obj[key];
      if (typeof item === 'object') {
        recurse(item);
      }
      if (typeof item === 'function') {
        obj[key] = item.toString();
      }
    }
  };
  recurse(ddoc.views || {});
  return ddoc;
};
