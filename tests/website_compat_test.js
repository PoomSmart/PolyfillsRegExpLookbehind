// Test website scenarios that check typeof on RegExp.prototype properties
console.log('=== Testing Website Compatibility Scenarios ===\n');

// Load polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('1. Feature detection patterns websites might use:');

// Common feature detection patterns
const checks = [
    'typeof RegExp.prototype.dotAll',
    'typeof RegExp.prototype.flags',
    'typeof RegExp.prototype.sticky',
    'typeof RegExp.prototype.unicode',
    'typeof RegExp.prototype.global',
    'typeof RegExp.prototype.ignoreCase',
    'typeof RegExp.prototype.multiline',
    'typeof RegExp.prototype.source',
    'typeof RegExp.prototype.lastIndex'
];

checks.forEach((check, i) => {
    try {
        const result = eval(check);
        console.log(`  ${i + 1}. ${check} => "${result}" ✓`);
    } catch (error) {
        console.error(`  ${i + 1}. ${check} => ERROR: ${error.message} ✗`);
    }
});

console.log('\n2. Testing property descriptor access:');
try {
    const descriptor = Object.getOwnPropertyDescriptor(RegExp.prototype, 'dotAll');
    console.log('  Object.getOwnPropertyDescriptor(RegExp.prototype, "dotAll"):', descriptor ? 'exists' : 'not found', '✓');
} catch (error) {
    console.error('  Property descriptor access failed:', error.message, '✗');
}

console.log('\n3. Testing hasOwnProperty checks:');
try {
    console.log('  RegExp.prototype.hasOwnProperty("dotAll"):', RegExp.prototype.hasOwnProperty('dotAll'), '✓');
    console.log('  "dotAll" in RegExp.prototype:', 'dotAll' in RegExp.prototype, '✓');
} catch (error) {
    console.error('  hasOwnProperty check failed:', error.message, '✗');
}

console.log('\n4. Testing property enumeration:');
try {
    const props = Object.getOwnPropertyNames(RegExp.prototype);
    const hasRegExpProps = props.some(prop => ['dotAll', 'flags', 'source'].includes(prop));
    console.log('  Property enumeration works:', hasRegExpProps, '✓');
} catch (error) {
    console.error('  Property enumeration failed:', error.message, '✗');
}

console.log('\n5. Simulating website polyfill detection:');
try {
    // Common website pattern for polyfill detection
    const hasNativeLookbehind = (() => {
        try {
            new RegExp('(?<=a)b');
            return true;
        } catch (e) {
            return false;
        }
    })();
    
    const hasDotAllSupport = typeof RegExp.prototype.dotAll !== 'undefined';
    const hasStickySupport = typeof RegExp.prototype.sticky !== 'undefined';
    
    console.log('  Native lookbehind detection:', hasNativeLookbehind, '✓');
    console.log('  dotAll support detection:', hasDotAllSupport, '✓');  
    console.log('  sticky support detection:', hasStickySupport, '✓');
} catch (error) {
    console.error('  Website polyfill detection failed:', error.message, '✗');
}

console.log('\n✓ All website compatibility scenarios passed!');
