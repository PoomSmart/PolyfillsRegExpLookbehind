node -e "
globalThis.__isTest = true;

// Load the polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

// Load and run the tests
eval(require('fs').readFileSync('./tests/RegExp.lookbehind.test.js', 'utf8'));
"
