// Debug updateRegExpStatics function
console.log('=== Debugging updateRegExpStatics Function ===\n');

globalThis.__lookbehind_patch_native_statics = true;

eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('1. Testing updateRegExpStatics directly:');
// Simulate a match result
const mockMatch = ['test123', 'test', '123'];
mockMatch.index = 0;
mockMatch.input = 'test123abc';

console.log('  Before manual updateRegExpStatics:');
console.log('    RegExp.$1:', RegExp.$1);
console.log('    RegExp.$2:', RegExp.$2);

// We need to access the updateRegExpStatics function
// Let's create a test polyfilled RegExp to trigger it
console.log('\n2. Testing via polyfilled RegExp:');
const polyfillTest = new RegExp('(manual)(test)');
const polyfillResult = polyfillTest.exec('manualtest');
console.log('  After polyfilled exec:');
console.log('    RegExp.$1:', RegExp.$1);
console.log('    RegExp.$2:', RegExp.$2);

console.log('\n3. Testing via native RegExp with patching:');
const nativeTest = /(native)(test)/;
const nativeResult = nativeTest.exec('nativetest');
console.log('  After native exec:');
console.log('    RegExp.$1:', RegExp.$1);
console.log('    RegExp.$2:', RegExp.$2);
console.log('    Match result:', nativeResult);
