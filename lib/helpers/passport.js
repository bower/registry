//
// helpers/passport
//

module.exports = function (passport, registry) {

  return function (req, res, next) {

    console.log(passport, registry);

    next();

  };

};

