var lunr = require('lunr');

var index = lunr(function () {
    this.field('name');
    this.field('description');
    this.field('keywords');
    this.field('owners');
});

module.exports = index;
