module.exports = function () {
    return function (req, res, next) {
        if ('OPTIONS' === req.method) {
            res.send(200);
        } else {
            next();
        }
    };
};
