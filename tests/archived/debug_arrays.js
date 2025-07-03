// Debug test to check the state of both replacement arrays
require('../scripts/RegExp.lookbehind.js');

console.log("Debugging Replacement Arrays");
console.log("=" * 40);

console.log("Full Pattern Replacements:");
console.log("Available:", typeof globalThis.__lookbehind_regex_replacements);
console.log("Is Array:", Array.isArray(globalThis.__lookbehind_regex_replacements));
console.log("Length:", globalThis.__lookbehind_regex_replacements ? globalThis.__lookbehind_regex_replacements.length : 'undefined');

if (globalThis.__lookbehind_regex_replacements) {
    console.log("First few entries:");
    globalThis.__lookbehind_regex_replacements.slice(0, 3).forEach((item, index) => {
        console.log(`  ${index + 1}. Original length: ${item.original ? item.original.length : 'undefined'}`);
        console.log(`     Replacement length: ${item.replacement ? item.replacement.length : 'undefined'}`);
        console.log(`     Has flags: ${item.flags !== undefined}`);
    });
}

console.log("\nPartial Replacements:");
console.log("Available:", typeof globalThis.__lookbehind_partial_replacements);
console.log("Is Array:", Array.isArray(globalThis.__lookbehind_partial_replacements));
console.log("Length:", globalThis.__lookbehind_partial_replacements ? globalThis.__lookbehind_partial_replacements.length : 'undefined');

if (globalThis.__lookbehind_partial_replacements) {
    console.log("All entries:");
    globalThis.__lookbehind_partial_replacements.forEach((item, index) => {
        console.log(`  ${index + 1}. "${item.original}" → "${item.replacement}"`);
    });
}
