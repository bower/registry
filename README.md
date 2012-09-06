# Bower Server

## Create package

    curl http://twitter-nest.heroku.com/packages -v -F 'name=jquery' -F 'url=git://github.com/jquery/jquery.git'

## Find package

    curl http://twitter-nest.heroku.com/packages/jquery
      {"name":"jquery","url":"git://github.com/jquery/jquery.git"}

## License

Copyright 2012 Twitter, Inc.

Licensed under the MIT License