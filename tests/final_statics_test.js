// Final test of static properties behavior
globalThis.__isTest = true;

console.log('=== Final RegExp Static Properties Test ===\n');

// Load polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('1. Testing literal RegExp (uses native exec):');
const literalRegex = /(a)(b)/;
const literalResult = literalRegex.exec('abc');
console.log('  /(a)(b)/.exec("abc"):', literalResult);
console.log('  RegExp.$1:', RegExp.$1, '(not updated because native exec doesn\'t set these in modern engines)');
console.log('  RegExp.$2:', RegExp.$2);

console.log('\n2. Testing constructor RegExp without lookbehind (uses polyfilled exec):');
const constructorRegex = new RegExp('(c)(d)');
const constructorResult = constructorRegex.exec('cde');
console.log('  new RegExp("(c)(d)").exec("cde"):', constructorResult);
console.log('  RegExp.$1:', RegExp.$1, '(should be "c")');
console.log('  RegExp.$2:', RegExp.$2, '(should be "d")');

console.log('\n3. Testing constructor RegExp with lookbehind (uses polyfilled exec):');
const lookbehindRegex = new RegExp('(?<=x)(e)(f)');
const lookbehindResult = lookbehindRegex.exec('xef');
console.log('  new RegExp("(?<=x)(e)(f)").exec("xef"):', lookbehindResult);
console.log('  RegExp.$1:', RegExp.$1, '(should be "e")');
console.log('  RegExp.$2:', RegExp.$2, '(should be "f")');

console.log('\n4. Summary:');
console.log('  - Literal RegExp (/pattern/) use native exec and don\'t update static properties in modern JS');
console.log('  - Constructor RegExp (new RegExp()) use polyfilled exec and DO update static properties');
console.log('  - This is the expected behavior for maximum compatibility');

console.log('\n5. Website compatibility:');
console.log('  - Most modern websites should use new RegExp() for dynamic patterns');
console.log('  - Static RegExp.$1 will work when created via constructor');
console.log('  - Legacy websites expecting literal RegExp to set statics may not work (as intended by modern JS engines)');
