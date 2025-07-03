// Example: How to use the regex replacement feature
// This shows practical examples of replacing complex lookbehind patterns

console.log('=== RegExp Lookbehind Polyfill - Replacement Examples ===\n');

// Define your regex replacements BEFORE loading the polyfill
globalThis.__lookbehind_regex_replacements = [
    {
        // Example 1: User agent detection with negative lookbehind
        original: '(?<! cu)bot|(?<! (ya|yandex))search',
        replacement: 'bot|search', // Simplified version - will match more broadly
        flags: 'i'
    },
    {
        // Example 2: Word boundary with context
        original: '(?<=\\s)word(?=\\s)',
        replacement: '\\bword\\b', // Use word boundaries instead of lookbehind/lookahead
        // No flags specified = applies to any flags
    },
    {
        // Example 3: HTML tag content matching
        original: '(?<=<title>).*?(?=</title>)',
        replacement: '<title>(.*?)</title>', // Capture the whole tag and extract content
        flags: 'i'
    },
    {
        // Example 4: File extension without path
        original: '(?<=/)([^/]+)\\.(js|css|html)$',
        replacement: '([^/]+)\\.(js|css|html)$', // Remove the lookbehind, match from anywhere
        // You'll need to handle the extra matches in your code
    }
];

// Load the polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('1. User Agent Bot Detection:');
try {
    const botRegex = new RegExp('(?<! cu)bot|(?<! (ya|yandex))search', 'i');
    
    const userAgents = [
        'Mozilla/5.0 Googlebot/2.1',
        'Mozilla/5.0 cubot/1.0',        // With original lookbehind: NO match
        'Mozilla/5.0 search crawler',
        'Mozilla/5.0 yandex search',    // With original lookbehind: NO match
        'Some other bot'
    ];
    
    console.log('Testing with replacement (will match more broadly):');
    userAgents.forEach(ua => {
        const match = botRegex.test(ua);
        console.log(`  "${ua}" -> ${match ? 'BOT' : 'not bot'}`);
        botRegex.lastIndex = 0; // Reset for global regex
    });
    
} catch (error) {
    console.error('Error:', error.message);
}

console.log('\\n2. Word Boundary Matching:');
try {
    const wordRegex = new RegExp('(?<=\\\\s)word(?=\\\\s)', 'g');
    const text = 'The word is important, but password is not a word match';
    
    console.log(`Text: "${text}"`);
    console.log('Matches:', text.match(wordRegex));
    
} catch (error) {
    console.error('Error:', error.message);
}

console.log('\\n3. HTML Title Extraction:');
try {
    const titleRegex = new RegExp('(?<=<title>).*?(?=</title>)', 'i');
    const html = '<html><head><title>My Page Title</title></head></html>';
    
    console.log(`HTML: ${html}`);
    console.log('Title match:', html.match(titleRegex));
    
    // Note: With the replacement, you'd get the full tag and need to extract content differently
    
} catch (error) {
    console.error('Error:', error.message);
}

console.log('\\n4. File Extension Matching:');
try {
    const fileRegex = new RegExp('(?<=/)([^/]+)\\\\.(js|css|html)$');
    const paths = [
        '/path/to/script.js',
        '/styles/main.css',
        'index.html',
        '/deep/path/page.html'
    ];
    
    console.log('File paths:');
    paths.forEach(path => {
        const match = fileRegex.exec(path);
        console.log(`  "${path}" -> ${match ? match[1] + '.' + match[2] : 'no match'}`);
    });
    
} catch (error) {
    console.error('Error:', error.message);
}

console.log('\\n5. Testing Non-Replaced Patterns (should use polyfill):');
try {
    const simpleRegex = new RegExp('(?<=abc)def');
    const testStr = 'abcdef xyzdef';
    
    console.log(`Testing "${testStr}" against (?<=abc)def:`);
    console.log('Match:', simpleRegex.exec(testStr));
    
} catch (error) {
    console.error('Error:', error.message);
}

console.log('\\n✅ Replacement examples completed!');
console.log('\\nTip: The replacement feature is most useful for:');
console.log('- Complex lookbehind patterns that are hard to polyfill');
console.log('- Performance-critical regex where you want to avoid polyfill overhead');
console.log('- Patterns that can be simplified to equivalent non-lookbehind versions');
