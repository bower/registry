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

You can unregister packages with [`bower unregister`](http://bower.io/docs/api/#unregister). You first need to authenticate with GitHub with [`bower login`](http://bower.io/docs/api/#login) to confirm you are a contributor to the package repo.

``` bash
bower login
# enter username and password
? Username:
? Password:
# unregister packages after successful login
bower unregister <package>
```

You'll likely want to [`bower cache clean`](http://bower.io/docs/api#cache-clean) after your change. Please remember it is generally considered bad behavior to remove versions of a library that others are depending on. Think twice :) If the above doesn't work for you, you can [request a package be unregistered manually](https://github.com/bower/registry/issues/).

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

## Installation

1. Install PostgreSQL database on your system and configure connections in `config` directory.
2. Create database and run migrations:

```
gulp db:create
gulp db:migrate
```

3. Run server:

```
node index.js
```

## Testing

Make sure you installed PostgreSQL and properly configured `config/test.js`, and then:

```
mocha
```

## Configuration

If the `PORT` and/or `DATABASE_URL` environment variables are not set, the registry will use the following defaults for development environment:

```
PORT=3000 DATABASE_URL=127.0.0.1/registry_development
```

And following defaults for test environment:

```
PORT=3001 DATABASE_URL=127.0.0.1/registry_test
```

In order to change either variable, set them in your environment: (i.e. linux)

```export PORT=[port]```

```export DATABASE_URL=[url]```

Registry service has timezone set to `UTC` via environmental variable `TZ`.

Postgres db `SERVER_ENCODING` is set to `UTF8`.

Registry is using [node-config](https://github.com/lorenwest/node-config/wiki/Configuration-Files) package for configuration.

## Private registry

For private registry you might be interesed in turning off options in `config/default.js`:


```
{
    // Skip URL validation? (i.e. skip checking repo via git)
    skipValidation: false,

    // Skip URL normalization? (e.g. leave ssh urls as is)
    skipNormalization: false,
}
```


## License

Copyright 2014 Twitter, Inc.

Licensed under the MIT License
