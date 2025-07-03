// Test functional behavior vs source property
const fs = require('fs');
const path = require('path');

const polyfillPath = path.join(__dirname, '..', 'scripts', 'RegExp.lookbehind.js');
const polyfillCode = fs.readFileSync(polyfillPath, 'utf8');
eval(polyfillCode);

console.log('=== Testing functional behavior vs source property ===\n');

// Test bot pattern
console.log('Bot pattern test:');
const botRegex = new RegExp("(?<! cu)bot", "g");
console.log('Source property:', botRegex.source);
const botMatches = "robot cubot chatbot".match(botRegex);
console.log('Matches found:', botMatches);
console.log('Match count:', botMatches ? botMatches.length : 0);
console.log('Expected behavior: should match all 3 "bot" occurrences');
console.log('Functional test:', botMatches && botMatches.length === 3 ? 'PASS' : 'FAIL');
console.log();

// Test search pattern
console.log('Search pattern test:');
const searchRegex = new RegExp("(?<! (ya|yandex))search", "g");
console.log('Source property:', searchRegex.source);
const searchMatches = "search yasearch yandexsearch".match(searchRegex);
console.log('Matches found:', searchMatches);
console.log('Match count:', searchMatches ? searchMatches.length : 0);
console.log('Expected behavior: should match all 3 "search" occurrences');
console.log('Functional test:', searchMatches && searchMatches.length === 3 ? 'PASS' : 'FAIL');
console.log();

// Test partial pattern
console.log('Partial pattern test:');
const partialRegex = new RegExp("prefix(?<! cu)botsuffix", "g");
console.log('Source property:', partialRegex.source);
const partialMatches = "prefixbotsuffix prefixcubotsuffix".match(partialRegex);
console.log('Matches found:', partialMatches);
console.log('Match count:', partialMatches ? partialMatches.length : 0);
console.log('Expected behavior: should match both occurrences');
console.log('Functional test:', partialMatches && partialMatches.length === 2 ? 'PASS' : 'FAIL');
