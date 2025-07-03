// Test RegExp static properties ($1, $2, etc.)
globalThis.__isTest = true;

console.log('=== Testing RegExp Static Properties ===\n');

// Load the polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

// Test 1: Native RegExp should set static properties
console.log('1. Testing native RegExp static properties:');
const nativeRegex = /(a)(b)/;
const nativeMatch = nativeRegex.exec('abc');
console.log('  Match result:', nativeMatch);
console.log('  RegExp.$1:', RegExp.$1, '(should be "a")');
console.log('  RegExp.$2:', RegExp.$2, '(should be "b")');
console.log('  RegExp.lastMatch:', RegExp.lastMatch, '(should be "ab")');
console.log('  RegExp.input:', RegExp.input, '(should be "abc")');

// Test 2: Polyfilled RegExp should also set static properties
console.log('\n2. Testing polyfilled RegExp static properties:');
const polyfillRegex = new RegExp('(?<=x)(a)(b)');
const polyfillMatch = polyfillRegex.exec('xab');
console.log('  Match result:', polyfillMatch);
console.log('  RegExp.$1:', RegExp.$1, '(should be "a")');
console.log('  RegExp.$2:', RegExp.$2, '(should be "b")');
console.log('  RegExp.lastMatch:', RegExp.lastMatch, '(should be "ab")');
console.log('  RegExp.input:', RegExp.input, '(should be "xab")');

// Test 3: Mixed usage
console.log('\n3. Testing mixed usage:');
// First a native regex
/(x)(y)/.exec('xyz');
console.log('  After native /(x)(y)/.exec("xyz"):');
console.log('    RegExp.$1:', RegExp.$1, '(should be "x")');
console.log('    RegExp.$2:', RegExp.$2, '(should be "y")');

// Then a polyfilled regex
new RegExp('(?<=a)(m)(n)').exec('amn');
console.log('  After polyfilled /(?<=a)(m)(n)/.exec("amn"):');
console.log('    RegExp.$1:', RegExp.$1, '(should be "m")');
console.log('    RegExp.$2:', RegExp.$2, '(should be "n")');

// Test 4: String methods should also update statics
console.log('\n4. Testing string methods update statics:');
'hello world'.match(/(w)(o)(r)(l)(d)/);
console.log('  After "hello world".match(/(w)(o)(r)(l)(d)/):');
console.log('    RegExp.$1:', RegExp.$1, '(should be "w")');
console.log('    RegExp.$2:', RegExp.$2, '(should be "o")');
console.log('    RegExp.$3:', RegExp.$3, '(should be "r")');
console.log('    RegExp.$4:', RegExp.$4, '(should be "l")');
console.log('    RegExp.$5:', RegExp.$5, '(should be "d")');

console.log('\n=== RegExp static properties test complete ===');
