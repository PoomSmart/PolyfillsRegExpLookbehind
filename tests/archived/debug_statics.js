// Debug RegExp static properties behavior
console.log('=== Debugging RegExp Static Properties ===\n');

// Test without polyfill first
console.log('1. Testing native RegExp behavior (before polyfill):');
const beforeMatch = /(test)(123)/.exec('test123abc');
console.log('  Match result:', beforeMatch);
console.log('  Native RegExp.$1:', RegExp.$1);
console.log('  Native RegExp.$2:', RegExp.$2);
console.log('  Native RegExp.input:', RegExp.input);
console.log('  Native RegExp has $1 property:', '$1' in RegExp);

// Now load polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('\n2. Testing after polyfill loaded:');
console.log('  RegExp === NativeRegExp:', RegExp === RegExp);
console.log('  RegExp.$1:', RegExp.$1);
console.log('  RegExp has $1 property:', '$1' in RegExp);

console.log('\n3. Testing native regex after polyfill:');
const afterMatch = /(hello)(world)/.exec('helloworld!');
console.log('  Match result:', afterMatch);
console.log('  RegExp.$1:', RegExp.$1);
console.log('  RegExp.$2:', RegExp.$2);

console.log('\n4. Testing polyfilled regex:');
const polyfillMatch = new RegExp('(?<=x)(a)(b)').exec('xab');
console.log('  Match result:', polyfillMatch);
console.log('  RegExp.$1:', RegExp.$1);
console.log('  RegExp.$2:', RegExp.$2);

console.log('\n5. Manual property setting test:');
RegExp.$1 = 'manual1';
RegExp.$2 = 'manual2';
console.log('  After manual setting:');
console.log('  RegExp.$1:', RegExp.$1);
console.log('  RegExp.$2:', RegExp.$2);
