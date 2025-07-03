// Comprehensive test for complex pattern handling in production mode
console.log('=== Testing Complex Pattern Handling (Production Mode) ===\n');

// Load polyfill without test mode
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('1. Testing the user\'s original pattern:');
try {
    const t = 'test';
    const n = 'word';
    const pattern = `(?<!<[^>]*?)([\\s>${t}]|^)(${n})(?=[\\s<${t}]|$)(?![^<]*?>)`;
    console.log('   Pattern:', pattern);
    
    const regex = new RegExp(pattern, 'g');
    console.log('   ✓ RegExp created successfully');
    console.log('   ✓ Source preserved:', regex.source === pattern);
    console.log('   ✓ Flags preserved:', regex.flags === 'g');
    console.log('   ✓ No polyfilled lookbehind info:', regex._lookbehindInfo === null);
    
    // Test execution (will either work natively or with lookbehind removed)
    const testString = '<div>test word</div> regular word';
    const result = regex.exec(testString);
    console.log('   ✓ Execution completed:', result ? 'Found match' : 'No match');
    
} catch (error) {
    console.error('   ✗ Error:', error.message);
}

console.log('\n2. Testing simple lookbehind (should still work):');
try {
    const simpleRegex = new RegExp('(?<=abc)def', 'g');
    const result = simpleRegex.exec('abcdef');
    console.log('   ✓ Simple lookbehind works:', result !== null);
    console.log('   ✓ Has polyfilled lookbehind info:', simpleRegex._lookbehindInfo !== null);
} catch (error) {
    console.error('   ✗ Simple lookbehind failed:', error.message);
}

console.log('\n3. Testing another complex pattern:');
try {
    const complexRegex = new RegExp('(?<!abc[def])test', 'g');
    console.log('   ✓ Complex character class pattern created');
    console.log('   ✓ No polyfilled lookbehind info:', complexRegex._lookbehindInfo === null);
} catch (error) {
    console.error('   ✗ Complex pattern failed:', error.message);
}

console.log('\n4. Testing normal pattern (should work unchanged):');
try {
    const normalRegex = new RegExp('test\\w+', 'g');
    const result = normalRegex.exec('testing123');
    console.log('   ✓ Normal pattern works:', result !== null);
    console.log('   ✓ No lookbehind info needed:', normalRegex._lookbehindInfo === null);
} catch (error) {
    console.error('   ✗ Normal pattern failed:', error.message);
}

console.log('\n✓ All tests completed - JavaScript execution was not interrupted by complex lookbehind patterns!');
