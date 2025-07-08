// Test partial replacement functionality
// This test verifies that when a registry pattern is found as a substring,
// only the matched substring is replaced, not the entire pattern

const fs = require('fs');
const path = require('path');

// Load the polyfill
const polyfillPath = path.join(__dirname, '..', 'scripts', 'RegExp.js');
const polyfillCode = fs.readFileSync(polyfillPath, 'utf8');
eval(polyfillCode);

// Test partial replacement with user-defined patterns
globalThis.__lookbehind_regex_replacements.push({
    original: '(?<=x)',
    replacement: '(?:(?<=x)|^)',
    description: 'Test partial replacement for lookbehind after x'
});

function testPartialReplacement() {
    console.log('Testing partial replacement functionality...\n');

    // Test 1: Pattern contains the registry pattern as a substring
    const pattern1 = 'start(?<=x)end';
    const regex1 = new RegExp(pattern1);
    console.log('Test 1 - Pattern with substring:');
    console.log('Original pattern:', pattern1);
    console.log('Expected result: start(?:(?<=x)|^)end');
    console.log('Actual result:  ', regex1.source);
    console.log('Match:', regex1.source === 'start(?:(?<=x)|^)end' ? '✓ PASS' : '✗ FAIL');
    console.log();

    // Test 2: Pattern exactly matches the registry pattern
    const pattern2 = '(?<=x)';
    const regex2 = new RegExp(pattern2);
    console.log('Test 2 - Exact match:');
    console.log('Original pattern:', pattern2);
    console.log('Expected result: (?:(?<=x)|^)');
    console.log('Actual result:  ', regex2.source);
    console.log('Match:', regex2.source === '(?:(?<=x)|^)' ? '✓ PASS' : '✗ FAIL');
    console.log();

    // Test 3: Pattern with multiple occurrences
    const pattern3 = '(?<=x)middle(?<=x)';
    const regex3 = new RegExp(pattern3);
    console.log('Test 3 - Multiple occurrences (should only replace first):');
    console.log('Original pattern:', pattern3);
    console.log('Expected result: (?:(?<=x)|^)middle(?<=x)');
    console.log('Actual result:  ', regex3.source);
    console.log('Match:', regex3.source === '(?:(?<=x)|^)middle(?<=x)' ? '✓ PASS' : '✗ FAIL');
    console.log();

    // Test 4: Test with built-in user-agent pattern (with correct flags)
    const pattern4 = 'prefix(?<! cu)botsuffix';
    const regex4 = new RegExp(pattern4, 'gi');
    console.log('Test 4 - Built-in pattern as substring:');
    console.log('Original pattern:', pattern4);
    console.log('Expected result: prefix(?:^|[^u]|[^c]u)botsuffix');
    console.log('Actual result:  ', regex4.source);
    console.log('Match:', regex4.source.includes('(?:^|[^u]|[^c]u)bot') ? '✓ PASS' : '✗ FAIL');
    console.log();

    // Test 5: Pattern that doesn't match any registry pattern
    const pattern5 = 'nomatch(?<=z)nomatch';
    const regex5 = new RegExp(pattern5);
    console.log('Test 5 - No match (should remain unchanged):');
    console.log('Original pattern:', pattern5);
    console.log('Expected result: nomatch(?<=z)nomatch');
    console.log('Actual result:  ', regex5.source);
    console.log('Match:', regex5.source === 'nomatch(?<=z)nomatch' ? '✓ PASS' : '✗ FAIL');
    console.log();
}

// Run the test
testPartialReplacement();

console.log('Partial replacement test completed!');
