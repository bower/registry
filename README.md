bower-registry
===================

bower registry with couchdb persistence layer

[![Build Status](https://travis-ci.org/bower/registry.png?branch=node_rewrite)](https://travis-ci.org/bower/registry)

[Bower Registry API v2 design doc](https://docs.google.com/a/google.com/document/d/17Nzv7onwsFYQU2ompvzNI9cCBczVHntWMiAn4zDip1w/edit#heading=h.420zy9tff5g7)

## Installing

You must have a couchdb service available to communicate with. This can be locally or with
a service such as [cloudant](https://cloudant.com/).

You must have node installed.

Clone and setup this repo:

```bash
git clone git@github.com:bower/registry.git -b node_rewrite
cd registry
npm install
```
## create database ##

Running `node bin/create-database` will create bower database.

### create user ###

Running `node bin/create-user -u username -p password` will create registry user.

## Starting your registry

Running `node bin/bower-registry` will start your registry.

## Registry Configuration

In `lib/helpers/config.js`

```json
{
    'app': {
        'port': 3333,
        'https': false,
        'host': 'localhost',
        'ssl': {
            'key' : 'config/cert/key.pem',
            'cert' : 'config/cert/certificate.pem'
        }
    },
    'couch': 'http://localhost:5984',
    'database': 'bower'
}
```

Everything should be self-explanitory except for `temporary`, which will remove
the database upon exit or if it's present upon start. 

The views to add/verify on the database are in `couchapp/ddocs.js`.

## Bower Configuration ##

If your organization wishes to maintain a private registry, you may change the `.bowerrc`.

```json
{
    "registry": "http://username:password@registry-server"
}
```

## Code Org Overview

`bin/bower-registry` creates a `Registry()` and passes that 
instance into `server()` from `server/server.js`.

`bin/create-database` creates a couchdb database.

`bin/create-user -u username -p password` creates a registry user.

`server` creates the express app, exposes routes and does the work of 
calling the appropriate functions. Namely:

`Packages` (`lib/collections/packages.js`) exposes the methods to retreive packages. It
is an array of Package (`lib/collections/package.js`). 
