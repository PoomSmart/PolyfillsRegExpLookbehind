// Test the exact user scenario
console.log('=== Testing User\'s Exact Scenario ===\n');

// Load polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('Testing the user\'s exact RegExp pattern...');

// User's exact pattern
function createRegexPattern(t, n) {
    return new RegExp(`(?<!<[^>]*?)([\\s>${t}]|^)(${n})(?=[\\s<${t}]|$)(?![^<]*?>)`, "g");
}

try {
    const t = 'div';
    const n = 'highlight';
    
    console.log('Creating regex with t="' + t + '" and n="' + n + '"');
    const regex = createRegexPattern(t, n);
    
    console.log('✓ RegExp created successfully');
    console.log('✓ Pattern:', regex.source);
    console.log('✓ Flags:', regex.flags);
    
    // Test with some sample HTML-like content
    const testHTML = '<div>Some highlight text</div> highlight outside';
    console.log('\\nTesting against:', testHTML);
    
    let match;
    let matches = [];
    regex.lastIndex = 0; // Reset for global regex
    
    while ((match = regex.exec(testHTML)) !== null) {
        matches.push({
            match: match[0],
            index: match.index,
            groups: [match[1], match[2]]
        });
        if (matches.length > 10) break; // Safety
    }
    
    console.log('✓ Found', matches.length, 'matches:');
    matches.forEach((m, i) => {
        console.log('  Match', i + 1 + ':', JSON.stringify(m));
    });
    
    console.log('\\n✓ JavaScript execution completed without errors!');
    console.log('✓ The polyfill gracefully handled the complex lookbehind pattern');
    
} catch (error) {
    console.error('✗ Error:', error.message);
    console.error(error.stack);
}
