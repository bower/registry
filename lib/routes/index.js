'use strict';

var app = module.parent.exports.app;

var routes = {
    root: require('./root'),
    packages: require('./packages')
};

app.get('/', function(req, res) {
  res.redirect(302, 'http://bower.io/search/');
});

app.get('/status', routes.root.status);

app.get('/packages', routes.packages.list);
app.get('/packages/:name', routes.packages.fetch);
app.get('/packages/search/:name', routes.packages.search);
app.post('/packages', routes.packages.create);
app.delete('/packages/:name', routes.packages.remove);
