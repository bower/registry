# Bower registry [![Build Status](https://travis-ci.org/bower/registry.svg?branch=master)](https://travis-ci.org/bower/registry)

## Create package
```bash
curl http://bower.herokuapp.com/packages -v -F 'name=jquery' -F 'url=git://github.com/jquery/jquery.git'
```
## Find package
```bash
curl http://bower.herokuapp.com/packages/jquery
```
Response
```json
{"name":"jquery","url":"git://github.com/jquery/jquery.git"}
```
## Unregister package

There is no direct way to unregister a package yet. For now, you can [request a
package be unregistered](https://github.com/bower/bower/issues/120).

### Unregistering (for owners)

First, [Have access](https://dashboard.heroku.com/apps/bower/access), [Install toolbelt](https://toolbelt.heroku.com/), Then:
```sh
heroku run node --app=bower
```
```js
d = require('./lib/database');
function deletePkg(name){ d.deletePackage(name, function (err, res) { console.log('error: ', err); console.log("result: ", res); }); }
deletePkg("package-name") // and repeat as neccessary
```

## License

Copyright 2013 Twitter, Inc.

Licensed under the MIT License
