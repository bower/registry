# Bower registry


## Create package
```bash
curl http://bower.heroku.com/packages -v -F 'name=jquery' -F 'url=git://github.com/jquery/jquery.git'
```
## Find package
```bash
curl http://bower.heroku.com/packages/jquery
  {"name":"jquery","url":"git://github.com/jquery/jquery.git"}
```
## Unregister package

There is no direct way to unregister a package yet. For now, you can [request a
package be unregistered](https://github.com/bower/bower/issues/120).

## License

Copyright 2012 Twitter, Inc.

Licensed under the MIT License
