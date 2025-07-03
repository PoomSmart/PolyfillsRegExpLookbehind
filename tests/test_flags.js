// Test with correct flags
const fs = require('fs');
const path = require('path');

const polyfillPath = path.join(__dirname, '..', 'scripts', 'RegExp.lookbehind.js');
const polyfillCode = fs.readFileSync(polyfillPath, 'utf8');
eval(polyfillCode);

console.log('Testing exact built-in pattern with correct flags:');
const exactPattern = '(?<! cu)bot';
const exactRegex = new RegExp(exactPattern, 'gi');
console.log('Pattern:', exactPattern);
console.log('Flags: gi');
console.log('Result:', exactRegex.source);
console.log('Changed:', exactRegex.source !== exactPattern);

console.log('\nTesting partial pattern with correct flags:');
const partialPattern = 'prefix(?<! cu)botsuffix';
const partialRegex = new RegExp(partialPattern, 'gi');
console.log('Pattern:', partialPattern);
console.log('Flags: gi');
console.log('Result:', partialRegex.source);
console.log('Changed:', partialRegex.source !== partialPattern);
