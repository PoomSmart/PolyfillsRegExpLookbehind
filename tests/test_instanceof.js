// Test file to verify instanceof behavior after polyfill

// Test before polyfill
console.log('=== BEFORE POLYFILL ===');
const beforePolyfill = /[^A-Z0-9]+/gi;
console.log('beforePolyfill instanceof RegExp:', beforePolyfill instanceof RegExp);
console.log('beforePolyfill constructor:', beforePolyfill.constructor.name);

// Load the polyfill
require('../scripts-priority/RegExp.js');

// Test after polyfill
console.log('\n=== AFTER POLYFILL ===');
const afterPolyfill = /[^A-Z0-9]+/gi;
console.log('afterPolyfill instanceof RegExp:', afterPolyfill instanceof RegExp);
console.log('afterPolyfill constructor:', afterPolyfill.constructor.name);

// Test polyfilled RegExp constructor
const constructorRegExp = new RegExp('[^A-Z0-9]+', 'gi');
console.log('constructorRegExp instanceof RegExp:', constructorRegExp instanceof RegExp);
console.log('constructorRegExp constructor:', constructorRegExp.constructor.name);

// Test with lookbehind
const lookbehindRegExp = new RegExp('(?<=abc)def', 'gi');
console.log('lookbehindRegExp instanceof RegExp:', lookbehindRegExp instanceof RegExp);
console.log('lookbehindRegExp constructor:', lookbehindRegExp.constructor.name);

// Test edge cases
console.log('\n=== EDGE CASES ===');
console.log('null instanceof RegExp:', null instanceof RegExp);
console.log('{} instanceof RegExp:', {} instanceof RegExp);
console.log('RegExp.prototype instanceof RegExp:', RegExp.prototype instanceof RegExp);
