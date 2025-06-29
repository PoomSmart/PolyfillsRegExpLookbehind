console.log('Starting test...');

// Load polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('Polyfill loaded, testing complex pattern...');

try {
    const pattern = '(?<!<[^>]*?)test';
    console.log('Creating RegExp with pattern:', pattern);
    
    const regex = new RegExp(pattern, 'g');
    console.log('RegExp created successfully');
    console.log('Source:', regex.source);
    
} catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
}
