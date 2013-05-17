/*globals before:true, after:true*/

var server = require('../../bin/dev'),
    couchapp = require('../../couchapp/testing'),
    factories = require('./factories');

module.exports = {
  before: (function() {

    'use strict';

    before(function(done) {
      this.timeout(3000);
      couchapp.setup(function(err, ok) {
        if (ok) {done();}
      });
    });

  }()),
  beforeEach: (function () {

    'use strict';

  }()),
  afterEach: (function () {

    'use strict';

    afterEach(function() {


    });
  }()),
  after: (function () {

    'use strict';

    after(function(done) {
      this.timeout(3000);
      couchapp.teardown(function(err, ok) {
        if (ok) {done();}
      });
    });

  }()),
  factories: factories
};
