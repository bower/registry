module.exports = function() {

  "use strict";

  return function(req, res, next) {

    res.removeHeader("X-Powered-By");

    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.header("Content-Type", "application/json; charset=utf-8");
    res.header("Pragma", "no-cache");
    next();

  };

};
