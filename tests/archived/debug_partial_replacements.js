// Debug test for partial replacement functionality
require('../scripts/RegExp.lookbehind.js');

console.log("Debugging Partial Replacements");
console.log("=" * 40);

// Test the applyPartialReplacements function directly
const testPatterns = [
    "(?<! cu)bot",
    "(?<! (ya|yandex))search",
    "start(?<! cu)bot(end|\\d+)",
    "(?<=\\s)word"
];

console.log("Available partial replacements:");
globalThis.__lookbehind_partial_replacements.forEach((replacement, index) => {
    console.log(`  ${index + 1}. "${replacement.original}" → "${replacement.replacement}"`);
});

console.log("\nTesting pattern replacements:");
testPatterns.forEach((pattern, index) => {
    console.log(`\nTest ${index + 1}: "${pattern}"`);
    
    // Check if the pattern contains any of our replacement targets
    let foundMatch = false;
    globalThis.__lookbehind_partial_replacements.forEach((replacement) => {
        if (pattern.indexOf(replacement.original) !== -1) {
            console.log(`  Found match with: "${replacement.original}"`);
            foundMatch = true;
        }
    });
    
    if (!foundMatch) {
        console.log(`  No matches found`);
    }
    
    // Try creating a RegExp and see what happens
    try {
        const regex = new RegExp(pattern);
        console.log(`  Result source: "${regex.source}"`);
        console.log(`  Changed: ${regex.source !== pattern}`);
    } catch (e) {
        console.log(`  Error: ${e.message}`);
    }
});

// Test specific replacement cases manually
console.log("\nManual replacement tests:");
const testSource = "(?<! cu)bot";
console.log(`Original: "${testSource}"`);

let processedSource = testSource;
globalThis.__lookbehind_partial_replacements.forEach((replacement) => {
    const originalPattern = replacement.original;
    const replacementPattern = replacement.replacement;
    console.log(`Trying to replace "${originalPattern}" with "${replacementPattern}"`);
    
    if (processedSource.indexOf(originalPattern) !== -1) {
        console.log(`  Found "${originalPattern}" in source`);
        processedSource = processedSource.replace(originalPattern, replacementPattern);
        console.log(`  After replacement: "${processedSource}"`);
    } else {
        console.log(`  "${originalPattern}" not found in "${processedSource}"`);
    }
});

console.log(`Final result: "${processedSource}"`);
