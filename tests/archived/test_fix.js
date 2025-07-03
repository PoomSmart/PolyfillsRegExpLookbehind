// Test the fix for complex patterns without breaking execution
console.log('=== Testing Complex Pattern Fix ===\n');

// Load polyfill (without test mode)
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('1. Testing the problematic pattern (should not throw):');
try {
    const t = 'test';
    const n = 'word';
    const pattern = `(?<!<[^>]*?)([\\s>${t}]|^)(${n})(?=[\\s<${t}]|$)(?![^<]*?>)`;
    console.log('Pattern:', pattern);
    
    const regex = new RegExp(pattern, 'g');
    console.log('✓ RegExp created successfully');
    console.log('  regex._lookbehindInfo:', regex._lookbehindInfo);
    console.log('  regex.source:', regex.source);
    
    const testString = 'This is a test word in text';
    const result = regex.exec(testString);
    console.log('✓ Exec result:', result);
    
} catch (error) {
    console.error('✗ Error with complex pattern:', error.message);
}

console.log('\n2. Testing simpler patterns still work:');
try {
    const simpleRegex = new RegExp('(?<=abc)def', 'g');
    const simpleResult = simpleRegex.exec('abcdef');
    console.log('✓ Simple pattern works:', simpleResult);
    console.log('  simpleRegex._lookbehindInfo:', simpleRegex._lookbehindInfo);
} catch (error) {
    console.error('✗ Simple pattern failed:', error.message);
}

console.log('\n3. Testing regular patterns without lookbehind:');
try {
    const normalRegex = new RegExp('test\\w+', 'g');
    const normalResult = normalRegex.exec('testing');
    console.log('✓ Normal pattern works:', normalResult);
    console.log('  normalRegex._lookbehindInfo:', normalRegex._lookbehindInfo);
} catch (error) {
    console.error('✗ Normal pattern failed:', error.message);
}

console.log('\n4. Testing that complex pattern with character classes is handled:');
try {
    const complexRegex = new RegExp('(?<!abc[def])test', 'g');
    console.log('✓ Complex character class pattern created');
    console.log('  complexRegex._lookbehindInfo:', complexRegex._lookbehindInfo);
} catch (error) {
    console.error('✗ Complex character class pattern failed:', error.message);
}
