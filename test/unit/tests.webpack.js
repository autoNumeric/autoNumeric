// require all test files (files that ends with .spec.js)
const testsContext = require.context('../../test/unit', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);

// require all src files for coverage.
const srcContext = require.context('../../src', true, /.*\.js$/);
srcContext.keys().forEach(srcContext);
