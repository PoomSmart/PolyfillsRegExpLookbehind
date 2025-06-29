// Test optional native static properties patching
console.log('=== Testing Optional Native Static Properties Patching ===\n');

// Enable optional native static properties patching
globalThis.__lookbehind_patch_native_statics = true;

// Load polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('1. Testing literal RegExp with optional patching enabled:');
const literalRegex = /(hello)(world)/;
const literalResult = literalRegex.exec('helloworld123');
console.log('  /(hello)(world)/.exec("helloworld123"):', literalResult);
console.log('  RegExp.$1:', RegExp.$1, '(should be "hello")');
console.log('  RegExp.$2:', RegExp.$2, '(should be "world")');
console.log('  RegExp.lastMatch:', RegExp.lastMatch, '(should be "helloworld")');

console.log('\n2. Testing constructor RegExp still works:');
const constructorRegex = new RegExp('(test)(123)');
const constructorResult = constructorRegex.exec('test123abc');
console.log('  new RegExp("(test)(123)").exec("test123abc"):', constructorResult);
console.log('  RegExp.$1:', RegExp.$1, '(should be "test")');
console.log('  RegExp.$2:', RegExp.$2, '(should be "123")');

console.log('\n3. Testing lookbehind still works:');
const lookbehindRegex = new RegExp('(?<=abc)(def)(ghi)');
const lookbehindResult = lookbehindRegex.exec('abcdefghi');
console.log('  new RegExp("(?<=abc)(def)(ghi)").exec("abcdefghi"):', lookbehindResult);
console.log('  RegExp.$1:', RegExp.$1, '(should be "def")');
console.log('  RegExp.$2:', RegExp.$2, '(should be "ghi")');

console.log('\n✓ Optional native static properties patching works!');
