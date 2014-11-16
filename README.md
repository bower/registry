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

Package unregistering will be available via `bower unregister <package>` soon, but for now, you can unregister packages yourself using `curl`, if the package is hosted on GitHub and you're an owner or collaborator.

```sh
curl -X DELETE "https://bower.herokuapp.com/packages/PACKAGE?access_token=TOKEN"
```

* Where `PACKAGE` is the package name you want to delete and `TOKEN` is GitHub's Personal Access Token that you can fetch from here: https://github.com/settings/applications
* A default GitHub Personal Access Token will work -- no permissions necessary
* You need to be an owner or [collaborator](https://developer.github.com/v3/repos/collaborators/) of the repo and URL needs to be OK. 
* You'll likely want to `bower cache clean` after your change.
* Please remember it is generally considered bad behavior to remove versions of a library that others are depending on. Think twice :)

If the above doesn't work for you, you can [request a
package be unregistered](https://github.com/bower/bower/issues/120)

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

## Defaults

If the `PORT` and/or `DATABASE_URL` environment variables are not set, the registry will use the following defaults:

`PORT=3000` and/or `DATABASE_URL=0.0.0.0`.

In order to change either variable, set them in your environment: (i.e. linux)

```export PORT=[port]```

```export DATABASE_URL=[url]```

Registry service has timezone set to `UTC` via environmental variable `TZ`.

Postgres db `SERVER_ENCODING` is set to `UTF8`.

## License

Copyright 2014 Twitter, Inc.

Licensed under the MIT License
