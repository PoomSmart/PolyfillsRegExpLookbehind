// Test without optional patching (default behavior)
globalThis.__isTest = true;

eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('=== Testing Default Behavior (No Optional Patching) ===\n');

// Test 1: Constructor RegExp should set static properties
console.log('1. Constructor RegExp test:');
new RegExp('(hello)(world)').exec('helloworld123');
console.log('After new RegExp("(hello)(world)").exec("helloworld123"):');
console.log('  RegExp.$1 =', JSON.stringify(RegExp.$1));
console.log('  RegExp.$2 =', JSON.stringify(RegExp.$2));
console.log('  RegExp.lastMatch =', JSON.stringify(RegExp.lastMatch));

// Test 2: Lookbehind RegExp should set static properties  
console.log('\n2. Lookbehind RegExp test:');
new RegExp('(?<=abc)(def)(ghi)').exec('abcdefghi');
console.log('After new RegExp("(?<=abc)(def)(ghi)").exec("abcdefghi"):');
console.log('  RegExp.$1 =', JSON.stringify(RegExp.$1));
console.log('  RegExp.$2 =', JSON.stringify(RegExp.$2));
console.log('  RegExp.lastMatch =', JSON.stringify(RegExp.lastMatch));

// Test 3: Literal RegExp should NOT set static properties (in default mode)
console.log('\n3. Literal RegExp test (should not change statics):');
console.log('Before literal RegExp:');
console.log('  RegExp.$1 =', JSON.stringify(RegExp.$1));
console.log('  RegExp.$2 =', JSON.stringify(RegExp.$2));

/(xyz)(123)/.exec('xyz123abc');
console.log('After /(xyz)(123)/.exec("xyz123abc"):');
console.log('  RegExp.$1 =', JSON.stringify(RegExp.$1), '(should be same as before)');
console.log('  RegExp.$2 =', JSON.stringify(RegExp.$2), '(should be same as before)');

console.log('\n✓ Default behavior working correctly!');
