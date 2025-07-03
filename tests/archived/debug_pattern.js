// Debug the specific failing pattern
require('../scripts/RegExp.lookbehind.js');

console.log("Debugging (?<=abc)\\w+ pattern:");

const source = "(?<=abc)\\w+";
console.log(`Original source: ${source}`);

// Check what partial replacements do
function testPartialReplacements(source) {
    let processedSource = source;
    const partialReplacements = globalThis.__lookbehind_partial_replacements;
    
    console.log(`\nPartial replacements (${partialReplacements.length}):`);
    for (const replacement of partialReplacements) {
        console.log(`  "${replacement.original}" → "${replacement.replacement}"`);
        if (processedSource.indexOf(replacement.original) !== -1) {
            console.log(`    Found match in source!`);
        }
    }
    
    return processedSource;
}

const processedSource = testPartialReplacements(source);
console.log(`\nProcessed source: ${processedSource}`);

// Check lookbehind extraction
function testExtractLookbehind(source) {
    const lookbehindStart = source.indexOf('(?<');
    if (lookbehindStart === -1) return null;

    const typeIndex = lookbehindStart + 3;
    const type = source[typeIndex]; // '=' or '!'
    if (type !== '=' && type !== '!') return null;

    const patternStart = typeIndex + 1;
    const patternEnd = source.indexOf(')', patternStart);
    if (patternEnd === -1) return null;

    const pattern = source.slice(patternStart, patternEnd);
    console.log(`\nLookbehind pattern: "${pattern}"`);
    
    const raw = source.slice(lookbehindStart, patternEnd + 1);
    console.log(`Raw lookbehind: "${raw}"`);
    
    return { type, pattern, raw, index: lookbehindStart };
}

const lookbehindInfo = testExtractLookbehind(processedSource);

if (lookbehindInfo) {
    const sourceWithoutLB = processedSource.slice(0, lookbehindInfo.index) + 
                           processedSource.slice(lookbehindInfo.index + lookbehindInfo.raw.length);
    console.log(`Source without lookbehind: "${sourceWithoutLB}"`);
    
    // Try creating the internal regex
    try {
        const testRegex = new RegExp(sourceWithoutLB, 'g');
        console.log(`Internal regex created successfully`);
        const testResult = testRegex.exec("abcdef ghi");
        console.log(`Internal regex test: ${JSON.stringify(testResult)}`);
    } catch (e) {
        console.log(`Internal regex error: ${e.message}`);
    }
}
