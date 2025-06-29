// Test the typeof RegExp.prototype.dotAll issue
console.log('=== Testing typeof RegExp.prototype.dotAll Issue ===\n');

console.log('1. Before loading polyfill:');
try {
    console.log('  typeof RegExp.prototype.dotAll:', typeof RegExp.prototype.dotAll);
    console.log('  ✓ Works before polyfill');
} catch (error) {
    console.error('  ✗ Error before polyfill:', error.message);
}

// Load polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('\n2. After loading polyfill:');
try {
    console.log('  typeof RegExp.prototype.dotAll:', typeof RegExp.prototype.dotAll);
    console.log('  ✓ Works after polyfill');
} catch (error) {
    console.error('  ✗ Error after polyfill:', error.message);
}

console.log('\n3. Testing other properties too:');
try {
    console.log('  typeof RegExp.prototype.global:', typeof RegExp.prototype.global);
    console.log('  typeof RegExp.prototype.ignoreCase:', typeof RegExp.prototype.ignoreCase);
    console.log('  typeof RegExp.prototype.multiline:', typeof RegExp.prototype.multiline);
    console.log('  typeof RegExp.prototype.unicode:', typeof RegExp.prototype.unicode);
    console.log('  typeof RegExp.prototype.sticky:', typeof RegExp.prototype.sticky);
    console.log('  typeof RegExp.prototype.flags:', typeof RegExp.prototype.flags);
    console.log('  typeof RegExp.prototype.source:', typeof RegExp.prototype.source);
    console.log('  typeof RegExp.prototype.lastIndex:', typeof RegExp.prototype.lastIndex);
    console.log('  ✓ All property typeof checks work');
} catch (error) {
    console.error('  ✗ Error with property typeof:', error.message);
}

console.log('\n4. Testing with actual RegExp instances:');
try {
    const regex = /test/gimsuy;
    console.log('  regex.dotAll:', regex.dotAll);
    console.log('  regex.global:', regex.global);
    console.log('  regex.ignoreCase:', regex.ignoreCase);
    console.log('  ✓ Properties work on actual RegExp instances');
} catch (error) {
    console.error('  ✗ Error with RegExp instance properties:', error.message);
}

console.log('\n5. Testing with polyfilled RegExp:');
try {
    const polyfilled = new RegExp('(?<=abc)test', 'gi');
    console.log('  polyfilled.dotAll:', polyfilled.dotAll);
    console.log('  polyfilled.global:', polyfilled.global);
    console.log('  polyfilled.ignoreCase:', polyfilled.ignoreCase);
    console.log('  ✓ Properties work on polyfilled RegExp instances');
} catch (error) {
    console.error('  ✗ Error with polyfilled RegExp properties:', error.message);
}

console.log('\n✓ All tests completed!');
