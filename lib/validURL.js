module.exports = function(url, cb) {
    var spawn = require('child_process').spawn;

    var git = spawn('git', ['ls-remote',  url], { stdio: 'ignore' })
    
    git.on('close', function(exitCode) {
        cb(exitCode === 0);
    });
};
