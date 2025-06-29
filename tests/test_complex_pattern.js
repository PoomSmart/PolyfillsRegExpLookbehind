// Test the complex pattern from the user
globalThis.__isTest = true;

console.log('=== Testing Complex Pattern ===\n');

// Load polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

// Test the user's pattern
console.log('1. Testing the problematic pattern:');
try {
    const t = 'test';
    const n = 'word';
    const pattern = `(?<!<[^>]*?)([\\s>${t}]|^)(${n})(?=[\\s<${t}]|$)(?![^<]*?>)`;
    console.log('Pattern:', pattern);
    
    const regex = new RegExp(pattern, 'g');
    console.log('✓ RegExp created successfully');
    
    const testString = 'This is a test word in text';
    const result = regex.exec(testString);
    console.log('✓ Exec result:', result);
    
} catch (error) {
    console.error('✗ Error with complex pattern:', error.message);
    console.error('Stack:', error.stack);
}

console.log('\n2. Testing simpler patterns still work:');
try {
    const simpleRegex = new RegExp('(?<=abc)def', 'g');
    const simpleResult = simpleRegex.exec('abcdef');
    console.log('✓ Simple pattern works:', simpleResult);
} catch (error) {
    console.error('✗ Simple pattern failed:', error.message);
}
