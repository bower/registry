var config = require('config');

var skipValidation = config.get('skipValidation');

module.exports = function(url, cb) {

    if (skipValidation) {
        cb(true);
        return;
    }

    var spawn = require('child_process').spawn;

    var git = spawn('git', ['ls-remote',  url], { stdio: 'ignore' })

    git.on('close', function(exitCode) {
        cb(exitCode === 0);
    });

};
