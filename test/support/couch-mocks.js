var nock = require('nock');
var _ = require('lodash');

module.exports = function(url, options, ddocs) {

  // delete attempt
  nock(url)
    .delete('/' + options.database)
    .reply(404, "{\"error\":\"not_found\",\"reason\":\"missing\"}\n", { server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
    date: couchDateNow(),
    'content-type': 'application/json',
    'content-length': '41',
    'cache-control': 'must-revalidate' });

  // creation of db
  nock(url)
    .put('/' + options.database)
    .reply(201, "{\"ok\":true}\n", { server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
    location: url + '/' + options.database,
    date: couchDateNow(),
    'content-type': 'application/json',
    'content-length': '12',
    'cache-control': 'must-revalidate' });

  // create ddocs (couchApp)
  ddocs.forEach(function(ddocument) {
 
    // default attachment objects
    var doc = prepareDdoc(ddocument);
    doc['attachments_md5'] = doc['attachments_md5'] || {};
    doc._attachments = doc._attachments || {};

    var path = '/' + options.database + '/' + doc['_id'];

    var rev = '1-510f49198b34aeeadec0ebd28e20c20c';
    var put = JSON.stringify(doc);
    var get = JSON.stringify(_.extend({}, doc, {rev: rev}));

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

    // put docs
    nock(url)
      .put(path, put)
      .reply(201, "{\"ok\":true,\"id\":\"" + doc['_id'] + "\",\"rev\":\"" + rev + "\"}\n", { 
        server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
        location: url + '/' + options.database + '/_design/packages',
        etag: '"' + rev + '"',
        date: couchDateNow(),
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '79',
        'cache-control': 'must-revalidate' 
      });

    // get [now present] docs
    nock(url)
      .get(path)
      .reply(200, get, {
        server: 'CouchDB/1.3.1 (Erlang OTP/R15B03)',
        etag: '"' + rev + '"',
        date: couchDateNow(),
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '386',
        'cache-control': 'must-revalidate' 
      });
  });
};



var couchDateNow = module.exports.couchDateNow = function() {
  return new Date().toString().replace(/GMT(.*)$/, 'GMT').replace('2013', '2015');
};

var prepareDdoc = module.exports.couchDateNow = function(ddocument) {
  var ddoc = _.extend({}, ddocument);
  var recurse = function(obj) {
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
}
