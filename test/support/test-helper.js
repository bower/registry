/*globals before:true, after:true*/

var opts = require('../../config/testing.json');
var cfg = opts.app;
var url = cfg.protocol + '://' + cfg.host + ':' + cfg.port + '/';

module.exports = {
  before: (function () {

    'use strict';

    before(function () {
      console.log('before');
    });

  }()),
  beforeEach: (function () {

    'use strict';

  }()),
  afterEach: (function () {

    'use strict';

    afterEach(function () {


    });
  }()),
  after: (function () {

    'use strict';

    after(function () {
    });

  }()),
  url: url
};
