# mc.go: A pure Go driver for Memcached (binary protocol, thread-safe)

## Install

		$ go get github.com/bmizerany/mc

## Use

		import "github.com/bmizerany/mc"

		func main() {
			// Error handling omitted for demo
			cn, err := mc.Dial("tcp", "localhost:11211")
			if err != nil {
				...
			}

			// Only PLAIN SASL auth supported right now
			// See: http://code.google.com/p/memcached/wiki/SASLHowto
			err = cn.Auth("foo", "bar")
			if err != nil {
				...
			}
			

			val, cas, err = cn.Get("foo")
			if err != nil {
				...
			}

			exp = 3600 // 2 hours
			err = cn.Set("foo", "bar", cas, exp)
			if err != nil {
				...
			}

			err = cn.Del("foo")
			if err != nil {
				...
			}
		}

## Please Contribute

Not all of the commands are implemented. Only the ones I immedietly needed. Each command is
trival to implement. If you'd like add one, please do so and send a pull request.

The current commands are:

	Get, Set, Del, Incr, Decr

## Performance

Right now the mutex is by far the largest bottleneck. There are thoughts on how to reduce it's impact. Any help is always appreciated.

## LICENCE

Copyright (C) 2011 by Blake Mizerany

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 
