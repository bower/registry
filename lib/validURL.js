module.exports = function(url, cb) {
    var exec = require('child_process').exec;

    exec('git ls-remote ' +  url).on('exit', function(exitCode) {
        cb(exitCode === 0);
    });
};
