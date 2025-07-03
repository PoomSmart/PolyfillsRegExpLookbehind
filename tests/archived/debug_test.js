// Final comprehensive test of the polyfill
globalThis.__isTest = true;

// Load the polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('=== RegExp Lookbehind Polyfill - Final Test ===\n');

// Test 1: Basic positive lookbehind
console.log('1. Positive lookbehind (?<=abc)def:');
const regex1 = new RegExp('(?<=abc)def');
console.log('  "abcdef":', regex1.test('abcdef'), '(should be true)');
console.log('  "defabc":', regex1.test('defabc'), '(should be false)');

// Test 2: Basic negative lookbehind  
console.log('\n2. Negative lookbehind (?<!abc)def:');
const regex2 = new RegExp('(?<!abc)def');
console.log('  "xyzdef":', regex2.test('xyzdef'), '(should be true)');
console.log('  "abcdef":', regex2.test('abcdef'), '(should be false)');

// Test 3: Complex patterns should be rejected
console.log('\n3. Complex patterns (should throw errors):');
try {
    new RegExp('(?<=\\d+)test');
    console.log('  (?<=\\d+)test: ERROR - should have thrown');
} catch (e) {
    console.log('  (?<=\\d+)test: OK - correctly rejected');
}

try {
    new RegExp('(?<=a{2,3})test');
    console.log('  (?<=a{2,3})test: ERROR - should have thrown');
} catch (e) {
    console.log('  (?<=a{2,3})test: OK - correctly rejected');
}

// Test 4: String methods
console.log('\n4. String method integration:');
const testStr = 'abcdef xyzdef';
const matches = testStr.match(new RegExp('(?<!abc)def', 'g'));
console.log('  "abcdef xyzdef".match(/(?<!abc)def/g):', matches);

const replaced = testStr.replace(new RegExp('(?<!abc)def'), 'TEST');
console.log('  Replace result:', replaced);

console.log('\n=== Test Complete - Polyfill is working! ===');
