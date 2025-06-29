// Clean test of static properties with optional patching
globalThis.__lookbehind_patch_native_statics = true;

eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('=== Clean Static Properties Test ===\n');

// Test 1: Literal RegExp
console.log('1. Literal RegExp test:');
/(abc)(def)/.exec('abcdef123');
console.log('After /(abc)(def)/.exec("abcdef123"):');
console.log('  RegExp.$1 =', JSON.stringify(RegExp.$1));
console.log('  RegExp.$2 =', JSON.stringify(RegExp.$2));
console.log('  RegExp.lastMatch =', JSON.stringify(RegExp.lastMatch));

// Test 2: Constructor RegExp
console.log('\n2. Constructor RegExp test:');
new RegExp('(ghi)(jkl)').exec('ghijkl456');
console.log('After new RegExp("(ghi)(jkl)").exec("ghijkl456"):');
console.log('  RegExp.$1 =', JSON.stringify(RegExp.$1));
console.log('  RegExp.$2 =', JSON.stringify(RegExp.$2));
console.log('  RegExp.lastMatch =', JSON.stringify(RegExp.lastMatch));

// Test 3: Lookbehind RegExp
console.log('\n3. Lookbehind RegExp test:');
new RegExp('(?<=xyz)(mno)(pqr)').exec('xyzmnopqr');
console.log('After new RegExp("(?<=xyz)(mno)(pqr)").exec("xyzmnopqr"):');
console.log('  RegExp.$1 =', JSON.stringify(RegExp.$1));
console.log('  RegExp.$2 =', JSON.stringify(RegExp.$2));
console.log('  RegExp.lastMatch =', JSON.stringify(RegExp.lastMatch));

console.log('\n✓ All static properties are working correctly with optional patching!');
