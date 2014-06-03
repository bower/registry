.PHONY: all
all:
	npm install

.PHONY: test
test: 	all
	PORT=8080 node index.js &
	./node_modules/.bin/mocha
