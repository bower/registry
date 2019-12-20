# Bower registry [![Build Status](https://travis-ci.org/bower/registry.svg?branch=master)](https://travis-ci.org/bower/registry)

## Find package

```bash
curl https://registry.bower.io/packages/jquery
```

Response

```json
{ "name": "jquery", "url": "git://github.com/jquery/jquery.git" }
```

## List all packages

```bash
curl https://registry.bower.io/packages
```

## Usage

```
node index.js
```

## Editing

Registry can be modified directly by editing `db/packages.json` file.

## License

Copyright Twitter, Inc. Licensed under the MIT License
