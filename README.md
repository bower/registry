node-bower-registry
===================

bower registry with couchdb persistence layer

[![Build Status](https://travis-ci.org/bower/registry.png?branch=node_rewrite)](https://travis-ci.org/bower/registry)

## Installing

You must have a couchdb service available to communicate with. This can be locally or with
a service such as [cloudant](https://cloudant.com/).

You must have node installed.

Clone and setup this repo:

```
git clone git@github.com:bower/registry.git -b node_rewrite
cd registry
npm install
```

## Starting your registry

Running `node bin/app` will start the app using the testing.json settings
file in the config directory. 

To use a different file, e.g., development.json,  in the config directory:

```
node bin/app development
```

To use any file:

```
node bin/app /path/to/the/settings/file.json
```

Or lastly, pass the JSON settings in directly:

```
node bin/app $(cat easier/than/typing/it.json)
```

## Configuration

```
{
  "port": 5984,
  "protocol": "http",
  "host": "localhost",
  "password": "",
  "username": "",
  "database": "bower-registry-testing",
  "temporary": true
}
```

Everything should be self-explanitory except for `temporary`, which will remove
the database upon exit or if it's present upon start. 

The views to add/verify on the database are in `couchapp/ddocs.js`.

## Code Org Overview

`bin/app` gets the settings data, creates a `Registry()` and passes that 
instance into `server()` from `server/server.js`.

`server` creates the express app, exposes routes and does the work of 
calling the appropriate functions. Namely:

`Packages` (`lib/collections/packages.js`) exposes the methods to retreive packages. It
is an array of Package (`lib/collections/package.js`). 




