// Test native RegExp compatibility
globalThis.__isTest = true;

// Load the polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('=== Testing Native RegExp Compatibility ===\n');

// Test 1: Native RegExp should still work
console.log('1. Testing native RegExp instances:');
const nativeRegex = /a/g;
console.log('  /a/g.test("abc"):', nativeRegex.test('abc'), '(should be true)');
console.log('  /a/g.exec("abc"):', nativeRegex.exec('abc'), '(should be match array)');
console.log('  /a/g.global:', nativeRegex.global, '(should be true)');
console.log('  /a/g.source:', nativeRegex.source, '(should be "a")');

// Test 2: RegExp.prototype.exec.call() should work (like in the website code)
console.log('\n2. Testing RegExp.prototype.exec.call():');
const execMethod = RegExp.prototype.exec;
const testMethod = RegExp.prototype.test;

const nativeRegex2 = /b*/g;
console.log('  RegExp.prototype.exec.call(/b*/g, "abc"):', execMethod.call(nativeRegex2, 'abc'));
console.log('  RegExp.prototype.test.call(/a/, "abc"):', testMethod.call(/a/, 'abc'), '(should be true)');

// Test 3: Polyfilled RegExp should still work
console.log('\n3. Testing polyfilled RegExp instances:');
const polyfillRegex = new RegExp('(?<=abc)def', 'g');
console.log('  new RegExp("(?<=abc)def", "g").test("abcdef"):', polyfillRegex.test('abcdef'), '(should be true)');
console.log('  new RegExp("(?<=abc)def", "g").test("defabc"):', polyfillRegex.test('defabc'), '(should be false)');
console.log('  new RegExp("(?<=abc)def", "g").global:', polyfillRegex.global, '(should be true)');
console.log('  new RegExp("(?<=abc)def", "g").source:', polyfillRegex.source, '(should be "(?<=abc)def")');

// Test 4: Property access on native vs polyfilled
console.log('\n4. Testing property access:');
const nativeFlags = /abc/gi;
const polyfillFlags = new RegExp('(?<=x)abc', 'gi');
console.log('  /abc/gi.flags:', nativeFlags.flags, '(should be "gi")');
console.log('  /abc/gi.ignoreCase:', nativeFlags.ignoreCase, '(should be true)');
console.log('  new RegExp("(?<=x)abc", "gi").flags:', polyfillFlags.flags, '(should be "gi")');
console.log('  new RegExp("(?<=x)abc", "gi").ignoreCase:', polyfillFlags.ignoreCase, '(should be true)');

// Test 5: Mixed usage
console.log('\n5. Testing mixed native and polyfilled:');
const mixedTest1 = /test/.test('testing');
const mixedTest2 = new RegExp('(?<!x)test').test('testing');
console.log('  /test/.test("testing"):', mixedTest1, '(should be true)');
console.log('  new RegExp("(?<!x)test").test("testing"):', mixedTest2, '(should be true)');

console.log('\n=== All tests completed successfully! ===');
