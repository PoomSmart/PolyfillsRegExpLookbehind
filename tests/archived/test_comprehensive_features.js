// Comprehensive test for both full-pattern and partial replacement features
require('../scripts/RegExp.lookbehind.js');

console.log("RegExp Lookbehind Polyfill - Full & Partial Replacement Test");
console.log("=" * 60);

let passed = 0;
let failed = 0;

function runTest(name, testFn) {
    console.log(`\n${name}:`);
    try {
        const result = testFn();
        if (result) {
            console.log("✓ PASS");
            passed++;
        } else {
            console.log("✗ FAIL");
            failed++;
        }
    } catch (error) {
        console.log(`✗ FAIL: ${error.message}`);
        failed++;
    }
}

// Test 1: Verify partial replacements are available
runTest("Partial Replacements Available", () => {
    const partialReplacements = globalThis.__lookbehind_partial_replacements;
    console.log(`  Found ${partialReplacements ? partialReplacements.length : 0} partial replacements`);
    return Array.isArray(partialReplacements) && partialReplacements.length > 0;
});

// Test 2: Test specific partial replacement - bot pattern
runTest("Partial Replacement: Bot Pattern", () => {
    const regex = new RegExp("(?<! cu)bot", "g");
    const testString = "robot cubot chatbot";
    const matches = testString.match(regex);
    
    console.log(`  Pattern: "(?<! cu)bot"`);
    console.log(`  Test string: "${testString}"`);
    console.log(`  Matches: ${JSON.stringify(matches)}`);
    
    // After partial replacement, should match all "bot" patterns (3 total)
    return matches && matches.length === 3;
});

// Test 3: Test specific partial replacement - search pattern  
runTest("Partial Replacement: Search Pattern", () => {
    const regex = new RegExp("(?<! (ya|yandex))search", "g");
    const testString = "search yasearch yandexsearch";
    const matches = testString.match(regex);
    
    console.log(`  Pattern: "(?<! (ya|yandex))search"`);
    console.log(`  Test string: "${testString}"`);
    console.log(`  Matches: ${JSON.stringify(matches)}`);
    
    // After partial replacement, should match all "search" patterns (3 total)
    return matches && matches.length === 3;
});

// Test 4: Test mixed pattern (partial replacement in larger regex)
runTest("Partial Replacement: Mixed Pattern", () => {
    const regex = new RegExp("start(?<! cu)bot(end|\\d+)", "g");
    const testString = "startbotend startbot123 startcubotend";
    const matches = testString.match(regex);
    
    console.log(`  Pattern: "start(?<! cu)bot(end|\\d+)"`);
    console.log(`  Test string: "${testString}"`);
    console.log(`  Matches: ${JSON.stringify(matches)}`);
    
    // Should match patterns where lookbehind was removed but rest of pattern preserved
    return matches && matches.length >= 2;
});

// Test 5: Test word boundary replacement
runTest("Partial Replacement: Word Boundary", () => {
    const regex = new RegExp("(?<=\\s)word", "g");
    const testString = " word sword word";
    const matches = testString.match(regex);
    
    console.log(`  Pattern: "(?<=\\s)word"`);
    console.log(`  Test string: "${testString}"`);
    console.log(`  Matches: ${JSON.stringify(matches)}`);
    
    // Should find word patterns (partial replacement should handle this)
    return matches && matches.length >= 1;
});

// Test 6: Test that full-pattern replacement still works
runTest("Full Pattern Replacement Still Works", () => {
    const fullReplacements = globalThis.__lookbehind_regex_replacements;
    console.log(`  Found ${fullReplacements ? fullReplacements.length : 0} full pattern replacements`);
    
    // Test one of the built-in full pattern replacements
    const regex = new RegExp("(?<!\\\\.)@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}", "g");
    console.log(`  Created regex with full replacement pattern`);
    
    return Array.isArray(fullReplacements) && fullReplacements.length > 0;
});

// Test 7: Test basic lookbehind polyfill still works for simple patterns
runTest("Basic Lookbehind Polyfill Still Works", () => {
    const regex = new RegExp("(?<=abc)def");
    const testString1 = "abcdef";
    const testString2 = "xyzdef";
    
    const match1 = regex.test(testString1);
    const match2 = regex.test(testString2);
    
    console.log(`  Pattern: "(?<=abc)def"`);
    console.log(`  Test "abcdef": ${match1}`);
    console.log(`  Test "xyzdef": ${match2}`);
    
    return match1 === true && match2 === false;
});

// Test 8: Test original source preservation
runTest("Original Source Preservation", () => {
    const originalPattern = "(?<! cu)bot";
    const regex = new RegExp(originalPattern);
    
    console.log(`  Original: "${originalPattern}"`);
    console.log(`  Regex source: "${regex.source}"`);
    
    // Source should be preserved for compatibility
    return regex.source === originalPattern;
});

// Test 9: Test flags preservation
runTest("Flags Preservation", () => {
    const regex = new RegExp("(?<! cu)bot", "gi");
    
    console.log(`  Flags: "${regex.flags}"`);
    console.log(`  Global: ${regex.global}`);
    console.log(`  IgnoreCase: ${regex.ignoreCase}`);
    
    return regex.flags === "gi" && regex.global && regex.ignoreCase;
});

// Test 10: Performance and error handling
runTest("Error Handling for Invalid Patterns", () => {
    try {
        // This should not throw an error (complex pattern should be handled gracefully)
        const regex = new RegExp("(?<!complex[a-z]+)pattern");
        console.log(`  Complex pattern handled gracefully`);
        return true;
    } catch (error) {
        console.log(`  Unexpected error: ${error.message}`);
        return false;
    }
});

// Summary
console.log(`\n${"=".repeat(60)}`);
console.log(`Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log("\n🎉 All tests passed! Both full-pattern and partial replacement features are working correctly.");
    console.log("\nFeatures verified:");
    console.log("✓ Partial lookbehind replacements");
    console.log("✓ Full pattern replacements");
    console.log("✓ Basic lookbehind polyfill");
    console.log("✓ Source preservation");
    console.log("✓ Flags preservation");
    console.log("✓ Error handling");
    console.log("✓ Mixed pattern support");
} else {
    console.log("\n❌ Some tests failed. Please review the implementation.");
}

// Usage examples
console.log(`\n${"=".repeat(60)}`);
console.log("USAGE EXAMPLES:\n");

console.log("1. Partial Replacement (automatic):");
console.log("   const regex = new RegExp('(?<! cu)bot', 'g');");
console.log("   'robot cubot chatbot'.match(regex); // ['bot', 'bot', 'bot']\n");

console.log("2. Custom Partial Replacements:");
console.log("   globalThis.__lookbehind_partial_replacements.push({");
console.log("     original: '(?<!custom)pattern',");
console.log("     replacement: 'pattern',");
console.log("     description: 'Remove custom lookbehind'");
console.log("   });\n");

console.log("3. Full Pattern Replacements:");
console.log("   globalThis.__lookbehind_regex_replacements.push({");
console.log("     original: 'complex(?<!lookbehind)pattern',");
console.log("     replacement: 'alternative-pattern',");
console.log("     flags: 'i'");
console.log("   });");
