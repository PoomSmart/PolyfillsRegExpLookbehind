// Test actual behavior of our replacement patterns
const fs = require('fs');
const path = require('path');

const polyfillPath = path.join(__dirname, '..', 'scripts', 'RegExp.lookbehind.js');
const polyfillCode = fs.readFileSync(polyfillPath, 'utf8');
eval(polyfillCode);

console.log('Testing actual replacement behavior...\n');

// Test the bot pattern
console.log('=== Bot Pattern Test ===');
const botRegex = new RegExp("(?<! cu)bot", "gi");
console.log('Pattern:', botRegex.source);
const botText = "robot cubot chatbot";
console.log('Test text:', botText);
const botMatches = botText.match(botRegex);
console.log('Matches:', botMatches);
console.log('Expected by test: 3 matches (all "bot" occurrences)');
console.log('Actual:', botMatches ? botMatches.length : 0, 'matches\n');

// Test the search pattern  
console.log('=== Search Pattern Test ===');
const searchRegex = new RegExp("(?<! (ya|yandex))search", "gi");
console.log('Pattern:', searchRegex.source);
const searchText = "search yasearch yandexsearch";
console.log('Test text:', searchText);
const searchMatches = searchText.match(searchRegex);
console.log('Matches:', searchMatches);
console.log('Expected by test: 3 matches (all "search" occurrences)');
console.log('Actual:', searchMatches ? searchMatches.length : 0, 'matches\n');

// Test without replacement to see what the original behavior should be
console.log('=== Testing with simple patterns (no lookbehind) ===');
const simpleBotRegex = new RegExp("bot", "gi");
const simpleBotMatches = "robot cubot chatbot".match(simpleBotRegex);
console.log('Simple "bot" pattern matches:', simpleBotMatches ? simpleBotMatches.length : 0);

const simpleSearchRegex = new RegExp("search", "gi");
const simpleSearchMatches = "search yasearch yandexsearch".match(simpleSearchRegex);
console.log('Simple "search" pattern matches:', simpleSearchMatches ? simpleSearchMatches.length : 0);
