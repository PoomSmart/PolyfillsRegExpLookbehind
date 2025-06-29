// Test polyfill replacement
console.log('=== Testing Polyfill Replacement ===\n');

const OriginalRegExp = globalThis.RegExp;
console.log('1. Original RegExp:', OriginalRegExp.name);

eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('2. After polyfill:');
console.log('  globalThis.RegExp === OriginalRegExp:', globalThis.RegExp === OriginalRegExp);
console.log('  globalThis.RegExp.name:', globalThis.RegExp.name);
console.log('  globalThis.RegExp.toString():', globalThis.RegExp.toString());

console.log('\n3. Testing instance creation:');
const nativeStyle = /test/;
const constructorStyle = new RegExp('test');
const lookbehindStyle = new RegExp('(?<=x)test');

console.log('  /test/ instanceof OriginalRegExp:', nativeStyle instanceof OriginalRegExp);
console.log('  /test/ instanceof globalThis.RegExp:', nativeStyle instanceof globalThis.RegExp);
console.log('  /test/._regexp:', nativeStyle._regexp);

console.log('  new RegExp("test") instanceof OriginalRegExp:', constructorStyle instanceof OriginalRegExp);
console.log('  new RegExp("test") instanceof globalThis.RegExp:', constructorStyle instanceof globalThis.RegExp);
console.log('  new RegExp("test")._regexp:', constructorStyle._regexp);

console.log('  new RegExp("(?<=x)test") instanceof OriginalRegExp:', lookbehindStyle instanceof OriginalRegExp);
console.log('  new RegExp("(?<=x)test") instanceof globalThis.RegExp:', lookbehindStyle instanceof globalThis.RegExp);
console.log('  new RegExp("(?<=x)test")._regexp:', lookbehindStyle._regexp ? 'defined' : 'undefined');

console.log('\n4. Testing exec methods:');
console.log('  /test/.exec === OriginalRegExp.prototype.exec:', nativeStyle.exec === OriginalRegExp.prototype.exec);
console.log('  /test/.exec === globalThis.RegExp.prototype.exec:', nativeStyle.exec === globalThis.RegExp.prototype.exec);
