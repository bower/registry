# Bower registry

## Create package

    curl http://bower.heroku.com/packages -v -F 'name=jquery' -F 'url=git://github.com/jquery/jquery.git'

## Find package

    curl http://bower.heroku.com/packages/jquery
      {"name":"jquery","url":"git://github.com/jquery/jquery.git"}

## License

Copyright 2012 Twitter, Inc.

Licensed under the MIT License
