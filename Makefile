bootstrap:
	npm install

test:
	NODE_PATH=. npm test

.PHONY: bootstrap test
