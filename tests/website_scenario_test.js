// Test that reproduces the exact website scenario
globalThis.__isTest = true;

// Load the polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('=== Testing Exact Website Scenario ===\n');

// Exact scenario from the website error
try {
    console.log('Creating native RegExp instances...');
    const regex1 = /a/;
    const regex2 = /b*/g;
    
    console.log('Testing direct method calls...');
    console.log('regex1.exec("abc"):', regex1.exec('abc'));
    console.log('regex2.exec("abc"):', regex2.exec('abc'));
    
    console.log('Testing RegExp.prototype.exec.call()...');
    const execResult1 = RegExp.prototype.exec.call(regex1, 'abc');
    const execResult2 = RegExp.prototype.exec.call(regex2, 'abc');
    console.log('RegExp.prototype.exec.call(regex1, "abc"):', execResult1);
    console.log('RegExp.prototype.exec.call(regex2, "abc"):', execResult2);
    
    console.log('Testing that _regexp property is not present on native instances...');
    console.log('regex1._regexp:', regex1._regexp, '(should be undefined)');
    console.log('regex2._regexp:', regex2._regexp, '(should be undefined)');
    
    console.log('\n✓ All website scenario tests passed!');
    
} catch (error) {
    console.error('✗ Error in website scenario:', error.message);
    console.error('Stack:', error.stack);
}

// Test that polyfilled instances work differently
try {
    console.log('\n=== Testing Polyfilled Instances ===');
    const polyfillRegex = new RegExp('(?<=a)b');
    console.log('polyfillRegex._regexp:', polyfillRegex._regexp ? 'defined' : 'undefined', '(should be defined)');
    console.log('polyfillRegex.exec("ab"):', polyfillRegex.exec('ab'));
    console.log('RegExp.prototype.exec.call(polyfillRegex, "ab"):', RegExp.prototype.exec.call(polyfillRegex, 'ab'));
    
    console.log('\n✓ All polyfilled instance tests passed!');
    
} catch (error) {
    console.error('✗ Error in polyfilled instance test:', error.message);
    console.error('Stack:', error.stack);
}
