// Test file to verify that polyfilled RegExp instances pass Object.prototype.toString.call() checks
const fs = require('fs');
const path = require('path');

// Load the polyfill
const polyfillPath = path.join(__dirname, '..', 'scripts', 'RegExp.lookbehind.js');
const polyfillCode = fs.readFileSync(polyfillPath, 'utf8');

// Execute the polyfill in a new context
const vm = require('vm');
const context = {
    console: console,
    require: require,
    __dirname: __dirname,
    __filename: __filename,
    module: module,
    exports: exports,
    process: process,
    Buffer: Buffer,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    global: global
};

// Store original RegExp
const OriginalRegExp = RegExp;

// Execute polyfill
vm.createContext(context);
vm.runInContext(polyfillCode, context);

// Now use the polyfilled RegExp
const PolyfillRegExp = context.RegExp || RegExp;

console.log('Testing Object.prototype.toString.call() compatibility...\n');

// Test 1: Native RegExp (should work)
const nativeRegExp = new OriginalRegExp('test');
console.log('Native RegExp:');
console.log('  Object.prototype.toString.call(nativeRegExp):', Object.prototype.toString.call(nativeRegExp));
console.log('  Expected: "[object RegExp]"');
console.log('  Pass:', Object.prototype.toString.call(nativeRegExp) === '[object RegExp]');

// Test 2: Polyfilled RegExp without lookbehind (should now work)
const polyfillRegExp = new PolyfillRegExp('test');
console.log('\nPolyfilled RegExp (no lookbehind):');
console.log('  Object.prototype.toString.call(polyfillRegExp):', Object.prototype.toString.call(polyfillRegExp));
console.log('  Expected: "[object RegExp]"');
console.log('  Pass:', Object.prototype.toString.call(polyfillRegExp) === '[object RegExp]');

// Test 3: Polyfilled RegExp with lookbehind (should now work)
const lookbehindRegExp = new PolyfillRegExp('(?<=foo)bar');
console.log('\nPolyfilled RegExp (with lookbehind):');
console.log('  Object.prototype.toString.call(lookbehindRegExp):', Object.prototype.toString.call(lookbehindRegExp));
console.log('  Expected: "[object RegExp]"');
console.log('  Pass:', Object.prototype.toString.call(lookbehindRegExp) === '[object RegExp]');

// Test 4: Polyfilled RegExp with pattern replacement (should now work)
const userAgentRegExp = new PolyfillRegExp('(?<=User-Agent: ).*');
console.log('\nPolyfilled RegExp (with pattern replacement):');
console.log('  Object.prototype.toString.call(userAgentRegExp):', Object.prototype.toString.call(userAgentRegExp));
console.log('  Expected: "[object RegExp]"');
console.log('  Pass:', Object.prototype.toString.call(userAgentRegExp) === '[object RegExp]');

// Test 5: Check that instanceof still works
console.log('\ninstanceof checks:');
console.log('  nativeRegExp instanceof RegExp:', nativeRegExp instanceof OriginalRegExp);
console.log('  polyfillRegExp instanceof RegExp:', polyfillRegExp instanceof PolyfillRegExp);
console.log('  lookbehindRegExp instanceof RegExp:', lookbehindRegExp instanceof PolyfillRegExp);

// Test 6: Check that the polyfilled RegExp instances have the right properties
console.log('\nProperty checks:');
console.log('  polyfillRegExp.source:', polyfillRegExp.source);
console.log('  polyfillRegExp.flags:', polyfillRegExp.flags);
console.log('  polyfillRegExp.global:', polyfillRegExp.global);
console.log('  polyfillRegExp.lastIndex:', polyfillRegExp.lastIndex);

// Test 7: Check functionality still works
console.log('\nFunctionality checks:');
console.log('  polyfillRegExp.test("test"):', polyfillRegExp.test('test'));
console.log('  polyfillRegExp.exec("test"):', polyfillRegExp.exec('test'));

// Test 8: Check that the .source property shows the original pattern
console.log('  userAgentRegExp.source (should show original):', userAgentRegExp.source);

// Summary
const allTests = [
    Object.prototype.toString.call(nativeRegExp) === '[object RegExp]',
    Object.prototype.toString.call(polyfillRegExp) === '[object RegExp]',
    Object.prototype.toString.call(lookbehindRegExp) === '[object RegExp]',
    Object.prototype.toString.call(userAgentRegExp) === '[object RegExp]',
];

console.log('\n' + '='.repeat(50));
console.log('SUMMARY:');
console.log('Tests passed:', allTests.filter(Boolean).length + '/' + allTests.length);
console.log('All toString tests pass:', allTests.every(Boolean));
console.log('='.repeat(50));
