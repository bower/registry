var some = require('lodash.some');
var database = require('./database');

module.exports = function(url, cb) {
    database.getPackages(function (error, result) {
        var isDupe;
        var dupe;

        if (error) {
            return cb('Database error');
        }

        isDupe = !some(result.rows, function(row) {
          var same = url === row.url;
          if (same) {
            dupe = row;
          }
          return same;
        });

        return cb(undefined, isDupe, dupe);

    });
};
