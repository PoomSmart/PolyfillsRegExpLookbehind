// Simple test demonstrating basic usage of the RegExp Lookbehind Polyfill

// Load the polyfill
require('../scripts-priority/RegExp.js');

console.log("RegExp Lookbehind Polyfill - Basic Usage Examples");
console.log("=".repeat(50));

// Example 1: Basic positive lookbehind
console.log("\n1. Basic Positive Lookbehind:");
const regex1 = new RegExp('(?<=abc)def');
console.log(`   Pattern: ${regex1.source}`);
console.log(`   Test "abcdef": ${regex1.test('abcdef')}`);  // true
console.log(`   Test "xyzdef": ${regex1.test('xyzdef')}`);  // false

// Example 2: Basic negative lookbehind
console.log("\n2. Basic Negative Lookbehind:");
const regex2 = new RegExp('(?<!abc)def');
console.log(`   Pattern: ${regex2.source}`);
console.log(`   Test "abcdef": ${regex2.test('abcdef')}`);  // false
console.log(`   Test "xyzdef": ${regex2.test('xyzdef')}`);  // true

// Example 3: Partial replacement - removes lookbehind automatically
console.log("\n3. Partial Replacement (automatic):");
const regex3 = new RegExp('(?<! cu)bot', 'g');
const text3 = "robot cubot chatbot";
const matches3 = text3.match(regex3);
console.log(`   Pattern: ${regex3.source}`);
console.log(`   Text: "${text3}"`);
console.log(`   Matches: ${JSON.stringify(matches3)}`);  // All "bot" patterns

// Example 4: String method integration
console.log("\n4. String Method Integration:");
const result4 = "abcdef".replace(new RegExp('(?<=abc)def'), 'XYZ');
console.log(`   "abcdef".replace(/(?<=abc)def/, 'XYZ')`);
console.log(`   Result: "${result4}"`);  // "abcXYZ"

// Example 5: Global patterns
console.log("\n5. Global Pattern:");
const regex5 = new RegExp('(?<=a)b', 'g');
const text5 = "abaabab";
const matches5 = text5.match(regex5);
console.log(`   Pattern: ${regex5.source}`);
console.log(`   Text: "${text5}"`);
console.log(`   Matches: ${JSON.stringify(matches5)}`);

// Example 6: Complex pattern with mixed replacement
console.log("\n6. Mixed Pattern (partial replacement):");
const regex6 = new RegExp('start(?<! cu)bot(end|\\d+)', 'g');
const text6 = "startbotend startbot123 startcubotend";
const matches6 = text6.match(regex6);
console.log(`   Pattern: ${regex6.source}`);
console.log(`   Text: "${text6}"`);
console.log(`   Matches: ${JSON.stringify(matches6)}`);

console.log("\n" + "=".repeat(50));
console.log("✓ Basic functionality demonstration complete!");
console.log("\n💡 The polyfill automatically:");
console.log("   • Polyfills simple lookbehind patterns");
console.log("   • Applies partial replacements for complex patterns");
console.log("   • Preserves original source and flags");
console.log("   • Integrates with String methods");
