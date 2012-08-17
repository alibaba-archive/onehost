TESTS = test/*.js
REPORTER = tap
TIMEOUT = 1000
JSCOVERAGE = ./node_modules/visionmedia-jscoverage/jscoverage
MOCHA = ./node_modules/mocha/bin/mocha

test:
	@npm install
	@NODE_ENV=test $(MOCHA) \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

test-cov: lib-cov
	@TAOBAOSTATUS_COV=1 $(MAKE) test REPORTER=dot
	@TAOBAOSTATUS_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -rf ./lib-cov
	@$(JSCOVERAGE) lib $@

.PHONY: test-cov test lib-cov