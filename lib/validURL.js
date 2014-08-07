module.exports = function(url, cb) {
    var spawn = require('child_process').spawn;

    spawn('git', ['ls-remote',  url]).on('exit', function(exitCode) {
        cb(exitCode === 0);
    });
};
