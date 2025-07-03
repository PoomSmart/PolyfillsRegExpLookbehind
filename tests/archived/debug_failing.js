// Debug failing tests
require('../scripts/RegExp.lookbehind.js');

console.log("Debugging failing tests:");

// Test String.match
console.log("\n1. String.match test:");
const matches = "abcdef ghi".match(new RegExp("(?<=abc)\\w+", "g"));
console.log(`   Result: ${JSON.stringify(matches)}`);
console.log(`   Expected: ["def"]`);
console.log(`   Test passes: ${matches && matches[0] === "def"}`);

// Test RegExp constructor from RegExp
console.log("\n2. RegExp constructor from RegExp:");
const original = new RegExp("(?<=abc)def", "g");
console.log(`   Original: source="${original.source}", flags="${original.flags}"`);
const copy = new RegExp(original);
console.log(`   Copy: source="${copy.source}", flags="${copy.flags}"`);
console.log(`   Source match: ${copy.source === original.source}`);
console.log(`   Global flag: ${copy.global}`);

// Test RegExp static properties
console.log("\n3. RegExp static properties:");
const regex = new RegExp("(?<=abc)(\\w+)");
const match = regex.exec("abcdef");
console.log(`   Match result: ${JSON.stringify(match)}`);
console.log(`   RegExp.$1: "${RegExp.$1}"`);
console.log(`   Test passes: ${match && match[1] === "def"}`);
