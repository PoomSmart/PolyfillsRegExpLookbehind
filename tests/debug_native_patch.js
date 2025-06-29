// Debug the native prototype patching
console.log('=== Debugging Native Prototype Patching ===\n');

globalThis.__lookbehind_patch_native_statics = true;

const OriginalRegExp = globalThis.RegExp;
console.log('1. Before polyfill:');
console.log('  Original exec:', OriginalRegExp.prototype.exec.toString().slice(0, 100));

eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('\n2. After polyfill:');
console.log('  Native exec:', OriginalRegExp.prototype.exec.toString().slice(0, 100));
console.log('  Polyfilled exec:', globalThis.RegExp.prototype.exec.toString().slice(0, 100));

console.log('\n3. Testing which exec method is used:');
const literalRegex = /test/;
console.log('  /test/.exec === OriginalRegExp.prototype.exec:', literalRegex.exec === OriginalRegExp.prototype.exec);
console.log('  /test/.exec === globalThis.RegExp.prototype.exec:', literalRegex.exec === globalThis.RegExp.prototype.exec);

console.log('\n4. Testing execution:');
const result = literalRegex.exec('test123');
console.log('  Exec result:', result);
console.log('  RegExp.$1 after:', globalThis.RegExp.$1);
