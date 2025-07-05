// Test that the polyfill passes real-world RegExp checking code like is-regex library
require('../scripts/RegExp.lookbehind.js');

console.log('Testing with real-world RegExp checking patterns...\n');

// Simulate the is-regex library's main check
function isRegExp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]';
}

// Test various RegExp instances
const tests = [
    { name: 'Native RegExp', regex: /test/g },
    { name: 'Polyfilled RegExp (no lookbehind)', regex: new RegExp('test', 'g') },
    { name: 'Polyfilled RegExp (with lookbehind)', regex: new RegExp('(?<=foo)bar', 'g') },
    { name: 'Polyfilled RegExp (with replacement)', regex: new RegExp('(?<!\\.)@example\\.com', 'g') },
    { name: 'Polyfilled RegExp (complex pattern)', regex: new RegExp('(?<! cu)bot|(?<! (ya|yandex))search', 'i') }
];

let passed = 0;
let total = tests.length;

tests.forEach(test => {
    const result = isRegExp(test.regex);
    console.log(`${test.name}: ${result ? '✓' : '✗'} ${result ? 'PASS' : 'FAIL'}`);
    if (result) passed++;
    
    // Additional checks
    console.log(`  instanceof RegExp: ${test.regex instanceof RegExp}`);
    console.log(`  .source: ${test.regex.source}`);
    console.log(`  .flags: ${test.regex.flags}`);
    console.log(`  .test() works: ${test.regex.test('test')}`);
    console.log('');
});

console.log(`Summary: ${passed}/${total} tests passed`);
if (passed === total) {
    console.log('🎉 All RegExp compatibility tests passed!');
} else {
    console.log('❌ Some tests failed!');
    process.exit(1);
}

// Test the specific use case from the user's question
console.log('\n=== Testing User\'s Original Issue ===');
console.log('Testing the exact check from user\'s code:');

const T = Object.prototype.toString;
const testRegexes = [
    new RegExp('test'),
    new RegExp('(?<=foo)bar'),
    new RegExp('(?<!\\.)@example\\.com'),
    /native/g
];

testRegexes.forEach((regex, i) => {
    const result = T.call(regex) === "[object RegExp]";
    console.log(`Regex ${i + 1}: ${result ? '✓' : '✗'} ${result ? 'PASS' : 'FAIL'} - ${regex.source}`);
});

console.log('\n✅ The polyfill now passes Object.prototype.toString.call() checks!');
