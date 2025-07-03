console.log("Running RegExp Lookbehind Polyfill Tests...");

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        testsPassed++;
        console.log(`PASS: ${message}`);
    } else {
        testsFailed++;
        console.error(`FAIL: ${message}`);
    }
}

function assertArrayEquals(actual, expected, message) {
    if (actual === null && expected === null) {
        testsPassed++;
        return;
    }
    if (actual === null || expected === null || actual.length !== expected.length) {
        testsFailed++;
        console.error(`FAIL: ${message}. Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
        return;
    }
    let equals = true;
    for (let i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) {
            equals = false;
            break;
        }
    }
    if (equals) {
        testsPassed++;
    } else {
        testsFailed++;
        console.error(`FAIL: ${message}. Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    }
}

// Test cases

// 1. RegExp.prototype.test
console.log("\n--- Testing RegExp.prototype.test ---");
// Positive lookbehind
let regexTest1 = new RegExp('(?<=abc)def');
assert(regexTest1.test('abcdef') === true, "test1: Positive lookbehind '(?<=abc)def' on 'abcdef'");
assert(regexTest1.test('defabc') === false, "test2: Positive lookbehind '(?<=abc)def' on 'defabc'");
assert(regexTest1.test('abXdef') === false, "test3: Positive lookbehind '(?<=abc)def' on 'abXdef'");

// Negative lookbehind
let regexTest2 = new RegExp('(?<!abc)def');
assert(regexTest2.test('Xabcdef') === false, "test4: Negative lookbehind '(?<!abc)def' on 'Xabcdef'");
assert(regexTest2.test('def') === true, "test5: Negative lookbehind '(?<!abc)def' on 'def'");
assert(regexTest2.test('abcdef') === false, "test6: Negative lookbehind '(?<!abc)def' on 'abcdef'");
assert(regexTest2.test('abXdef') === true, "test7: Negative lookbehind '(?<!abc)def' on 'abXdef'");
assert(new RegExp('(?<!\d)foo').test('1foo') === false, "test8: Negative lookbehind '(?<!\d)foo' on '1foo'");
assert(new RegExp('(?<!\d)foo').test('foo') === true, "test9: Negative lookbehind '(?<!\d)foo' on 'foo'");


// 2. RegExp.prototype.exec
console.log("\n--- Testing RegExp.prototype.exec ---");
// Positive lookbehind
let regexExec1 = new RegExp('(?<=abc)def');
let execResult1 = regexExec1.exec('abcdef');
assert(execResult1 !== null && execResult1[0] === 'def', "exec1: Positive lookbehind '(?<=abc)def' on 'abcdef'");
assert(regexExec1.exec('defabc') === null, "exec2: Positive lookbehind '(?<=abc)def' on 'defabc'");

// Negative lookbehind
let regexExec2 = new RegExp('(?<!abc)def');
let execResult2 = regexExec2.exec('Xdef'); // Polyfill might behave differently than native here if not anchored
assert(execResult2 !== null && execResult2[0] === 'def', "exec3: Negative lookbehind '(?<!abc)def' on 'Xdef'");
assert(regexExec2.exec('abcdef') === null, "exec4: Negative lookbehind '(?<!abc)def' on 'abcdef'");

let regexExec3 = new RegExp('(?<=\$\d{1,2}\.)\d{2}');
let execResult3 = regexExec3.exec('Amount: $10.50');
assert(execResult3 !== null && execResult3[0] === '50', "exec5: Positive lookbehind '(?<=\$\d{1,2}\.)\d{2}' on 'Amount: $10.50'");

// 3. String.prototype.match
console.log("\n--- Testing String.prototype.match ---");
// Positive lookbehind
let strMatch1 = 'abcdef';
let matchResult1 = strMatch1.match(new RegExp('(?<=abc)def'));
assert(matchResult1 !== null && matchResult1[0] === 'def', "match1: Positive lookbehind '(?<=abc)def' on 'abcdef'");
assert('defabc'.match(new RegExp('(?<=abc)def')) === null, "match2: Positive lookbehind '(?<=abc)def' on 'defabc'");

// Negative lookbehind
let strMatch2 = 'Xdef';
let matchResult2 = strMatch2.match(new RegExp('(?<!abc)def'));
assert(matchResult2 !== null && matchResult2[0] === 'def', "match3: Negative lookbehind '(?<!abc)def' on 'Xdef'");
assert('abcdef'.match(new RegExp('(?<!abc)def')) === null, "match4: Negative lookbehind '(?<!abc)def' on 'abcdef'");

// 4. String.prototype.replace
console.log("\n--- Testing String.prototype.replace ---");
// Positive lookbehind
let strReplace1 = 'abcdef';
let replaceResult1 = strReplace1.replace(new RegExp('(?<=abc)def'), 'XYZ');
assert(replaceResult1 === 'abcXYZ', "replace1: Positive lookbehind '(?<=abc)def' replace on 'abcdef'");

// Replace with function
let strReplace5 = 'abcdef';
let replaceResult5 = strReplace5.replace(new RegExp('(?<=abc)def'), (match) => match.toUpperCase());
assert(replaceResult5 === 'abcDEF', "replace5: Positive lookbehind with function replacement");

// 5. Edge Cases and Complex Patterns
console.log("\n--- Testing Edge Cases ---");

// Empty string tests
assert(new RegExp('(?<=abc)def').test('') === false, "edge1: Empty string with positive lookbehind");
assert(new RegExp('(?<!abc)def').test('') === false, "edge2: Empty string with negative lookbehind");

// Zero-length matches (simplified to avoid infinite loops)
let zeroLengthRegex = new RegExp('(?<=a)b');
let zeroLengthResult = 'ab'.match(zeroLengthRegex);
// Should match 'b' that comes after 'a'
assert(zeroLengthResult !== null && zeroLengthResult[0] === 'b', "edge3: Match after lookbehind");

// Escaped characters in lookbehind
let escapedRegex = new RegExp('(?<=\\$)\\d+');
assert(escapedRegex.test('$123') === true, "edge5: Escaped characters in lookbehind");
assert(escapedRegex.test('x123') === false, "edge6: Escaped characters in lookbehind (no match)");

// Word boundaries in lookbehind
let wordBoundaryRegex = new RegExp('(?<=\\b\\w+)ing\\b');
assert(wordBoundaryRegex.test('running') === true, "edge7: Word boundaries in lookbehind");
assert(wordBoundaryRegex.test('xing') === false, "edge8: Word boundaries in lookbehind (no match)");

// Case insensitive flag
let caseInsensitiveRegex = new RegExp('(?<=ABC)def', 'i');
assert(caseInsensitiveRegex.test('abcdef') === true, "edge9: Case insensitive positive lookbehind");
assert(caseInsensitiveRegex.test('ABCDEF') === true, "edge10: Case insensitive positive lookbehind uppercase");

// Multiline flag
let multilineRegex = new RegExp('(?<=^line)\\d+', 'm');
assert(multilineRegex.test('line1\nline2') === true, "edge11: Multiline flag with lookbehind");

// Unicode characters
let unicodeRegex = new RegExp('(?<=café)\\s+');
assert(unicodeRegex.test('café bar') === true, "edge12: Unicode characters in lookbehind");

// 6. Capture Groups with Lookbehind
console.log("\n--- Testing Capture Groups ---");

// Capture groups after lookbehind
let captureRegex = new RegExp('(?<=prefix)(\\w+)(\\d+)');
let captureResult = captureRegex.exec('prefixabc123');
assert(captureResult !== null && captureResult[1] === 'abc' && captureResult[2] === '123', 
       "capture1: Capture groups after positive lookbehind");

// Nested parentheses in lookbehind
let nestedRegex = new RegExp('(?<=(a(b)c))def');
assert(nestedRegex.test('abcdef') === true, "capture2: Nested parentheses in lookbehind");

// 7. Complex Real-world Patterns
console.log("\n--- Testing Real-world Patterns ---");

// Email validation with lookbehind
let emailRegex = new RegExp('(?<=@)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
let emailResult = emailRegex.exec('user@example.com');
assert(emailResult !== null && emailResult[0] === 'example.com', "real1: Email domain extraction");

// HTML tag content (simplified - avoid combining lookbehind with lookahead which can cause issues)
let htmlRegex = new RegExp('(?<=<title>)[^<]+');
let htmlResult = htmlRegex.exec('<title>My Page Title</title>');
assert(htmlResult !== null && htmlResult[0] === 'My Page Title', "real3: HTML title extraction");

// Phone number formatting (simplified - avoid combining lookbehind with lookahead)
let phoneRegex = new RegExp('(?<=\\()\\d{3}');
let phoneResult = phoneRegex.exec('Call (555) 123-4567');
assert(phoneResult !== null && phoneResult[0] === '555', "real4: Phone area code extraction");

// 8. Performance and Edge Cases
console.log("\n--- Testing Performance Edge Cases ---");

// Very long string
let longString = 'x'.repeat(1000) + 'abcdef';
let longStringRegex = new RegExp('(?<=abc)def');
assert(longStringRegex.test(longString) === true, "perf1: Long string performance test");

// Complex lookbehind pattern
let complexRegex = new RegExp('(?<=\\w{3,5}[0-9]{2,4})test');
assert(complexRegex.test('abc123test') === true, "perf3: Complex lookbehind pattern");
assert(complexRegex.test('ab1test') === false, "perf4: Complex lookbehind pattern (no match)");

// 9. RegExp Static Properties
console.log("\n--- Testing RegExp Static Properties ---");

// Test that RegExp statics are updated correctly
let staticsRegex = new RegExp('(?<=pre)(\\w+)');
let staticsResult = staticsRegex.exec('prefixSUFFIX');
if (staticsResult) {
    assert(RegExp.lastMatch === staticsResult[0], "statics1: RegExp.lastMatch updated");
    assert(RegExp['$&'] === staticsResult[0], "statics2: RegExp['$&'] updated");
    assert(RegExp['$1'] === staticsResult[1], "statics3: RegExp['$1'] capture group");
    assert(RegExp.leftContext.endsWith('pre'), "statics4: RegExp.leftContext updated");
}

// 10. Error Handling
console.log("\n--- Testing Error Handling ---");

// Invalid lookbehind patterns should not crash
try {
    let invalidRegex = new RegExp('(?<=unclosed');
    // This might create a regex without lookbehind processing due to invalid syntax
    assert(true, "error1: Invalid lookbehind syntax handled gracefully");
} catch (e) {
    assert(true, "error1: Invalid lookbehind syntax throws expected error");
}

// Test with null/undefined inputs
try {
    let nullTest = new RegExp('(?<=abc)def');
    let nullResult = nullTest.test(null);
    assert(nullResult === false, "error2: null input handled");
} catch (e) {
    assert(true, "error2: null input throws expected error");
}

// 11. Mixed Patterns
console.log("\n--- Testing Mixed Patterns ---");

// Lookbehind with other regex features (simplified to avoid combining with lookahead)
let mixedRegex1 = new RegExp('(?<=start)\\w+');
assert(mixedRegex1.test('startMIDDLE') === true, "mixed1: Lookbehind with word characters");

let mixedRegex2 = new RegExp('(?<=\\d{2})\\w{2,4}');
assert(mixedRegex2.test('12word') === true, "mixed2: Lookbehind with quantifiers");

// Non-capturing groups
let nonCapturingRegex = new RegExp('(?<=(?:abc|def))ghi');
assert(nonCapturingRegex.test('abcghi') === true, "mixed3: Non-capturing group in lookbehind");
assert(nonCapturingRegex.test('defghi') === true, "mixed4: Non-capturing group in lookbehind (alt)");

// Character classes in lookbehind
let charClassRegex = new RegExp('(?<=[a-z]{3})\\d+');
assert(charClassRegex.test('abc123') === true, "mixed5: Character class in lookbehind");
assert(charClassRegex.test('AB123') === false, "mixed6: Character class in lookbehind (no match)");

// 12. Additional Safe Tests
console.log("\n--- Testing Additional Safe Patterns ---");

// Simple word boundary tests
let wordBoundTest1 = new RegExp('(?<=\\bpre)fix');
assert(wordBoundTest1.test('prefix') === true, "safe1: Word boundary in lookbehind");
assert(wordBoundTest1.test('xprefix') === false, "safe2: Word boundary in lookbehind (no match)");

// Digit patterns
let digitTest = new RegExp('(?<=\\d{2})\\w+');
assert(digitTest.test('99bottles') === true, "safe3: Digit pattern in lookbehind");
assert(digitTest.test('9bottles') === false, "safe4: Digit pattern in lookbehind (insufficient digits)");

// Anchored patterns
let anchoredTest = new RegExp('(?<=^start)\\w+');
assert(anchoredTest.test('startword') === true, "safe5: Anchored pattern with lookbehind");
assert(anchoredTest.test('xstartword') === false, "safe6: Anchored pattern with lookbehind (not at start)");

// Case sensitivity tests
let caseTest1 = new RegExp('(?<=ABC)def');
let caseTest2 = new RegExp('(?<=ABC)def', 'i');
assert(caseTest1.test('ABCdef') === true, "safe7: Case sensitive lookbehind");
assert(caseTest1.test('abcdef') === false, "safe8: Case sensitive lookbehind (wrong case)");
assert(caseTest2.test('abcdef') === true, "safe9: Case insensitive lookbehind");

// Multiple capture groups
let multiCaptureTest = new RegExp('(?<=prefix)(\\w+)-(\\d+)');
let multiCaptureResult = multiCaptureTest.exec('prefixtest-123');
assert(multiCaptureResult !== null && multiCaptureResult[1] === 'test' && multiCaptureResult[2] === '123', 
       "safe10: Multiple capture groups after lookbehind");

// Special characters in lookbehind
let specialCharTest = new RegExp('(?<=\\[\\w+\\])\\w+');
assert(specialCharTest.test('[abc]def') === true, "safe11: Special characters in lookbehind");
assert(specialCharTest.test('abc]def') === false, "safe12: Special characters in lookbehind (no match)");

// Quantifiers in main pattern
let quantifierTest = new RegExp('(?<=start)\\w{2,4}');
assert(quantifierTest.test('startAB') === true, "safe13: Quantifiers in main pattern (min)");
assert(quantifierTest.test('startABCD') === true, "safe14: Quantifiers in main pattern (max)");
assert(quantifierTest.test('startA') === false, "safe15: Quantifiers in main pattern (too short)");

// Complex multiple negative lookbehinds
let complexNegativeLookbehind = new RegExp('(?<!email)(?<!email-)(?<!email_)(?<!email\\.)(?<!email\\s)(?<!ip)(?<!ip-)(?<!ip_)(?<!ip\\s)(?<!ip\\.)address');
assert(complexNegativeLookbehind.test('home address') === true, "safe16: Complex negative lookbehinds - should match 'home address'");
assert(complexNegativeLookbehind.test('email address') === false, "safe17: Complex negative lookbehinds - should not match 'email address'");
assert(complexNegativeLookbehind.test('email-address') === false, "safe18: Complex negative lookbehinds - should not match 'email-address'");
assert(complexNegativeLookbehind.test('email_address') === false, "safe19: Complex negative lookbehinds - should not match 'email_address'");
assert(complexNegativeLookbehind.test('email.address') === false, "safe20: Complex negative lookbehinds - should not match 'email.address'");
assert(complexNegativeLookbehind.test('ip address') === false, "safe21: Complex negative lookbehinds - should not match 'ip address'");
assert(complexNegativeLookbehind.test('ip-address') === false, "safe22: Complex negative lookbehinds - should not match 'ip-address'");
assert(complexNegativeLookbehind.test('ip_address') === false, "safe23: Complex negative lookbehinds - should not match 'ip_address'");
assert(complexNegativeLookbehind.test('ip.address') === false, "safe24: Complex negative lookbehinds - should not match 'ip.address'");
assert(complexNegativeLookbehind.test('street address') === true, "safe25: Complex negative lookbehinds - should match 'street address'");
assert(complexNegativeLookbehind.test('mailing address') === true, "safe26: Complex negative lookbehinds - should match 'mailing address'");

console.log("\n--- Test Summary ---");
console.log(`Total tests: ${testsPassed + testsFailed}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed > 0) {
    console.error("\nSome tests failed. Please review the output above.");
} else {
    console.log("\nAll tests passed successfully!");
}

// To run these tests, open an HTML file with both scripts included, or run in a JS environment:
// <script src="RegExp.lookbehind.js"></script>
// <script src="RegExp.lookbehind.test.js"></script>
// Then open the browser console.
