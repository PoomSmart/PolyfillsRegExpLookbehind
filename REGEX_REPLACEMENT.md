# RegExp Lookbehind Polyfill - Regex Replacement Feature

This polyfill now includes a **Regex Replacement Feature** that allows you to replace complex lookbehind patterns with simpler alternatives.

## Why Use Regex Replacement?

Some lookbehind patterns are too complex to polyfill efficiently:
- `(?<! cu)bot` - negative lookbehind with space
- `(?<! (ya|yandex))search` - negative lookbehind with alternation
- Patterns with multiple lookbehind assertions
- Performance-critical regex that you want to run natively

## How to Use

### 1. Define Replacements (before loading polyfill)

```javascript
globalThis.__lookbehind_regex_replacements = [
  {
    // The exact original pattern (must match exactly)
    original: '(?<! cu)bot|(?<! (ya|yandex))search',
    
    // Your replacement pattern (without lookbehind)
    replacement: 'bot|search',
    
    // Optional: only apply for specific flags
    flags: 'i'
  },
  {
    original: '(?<=\\s)word(?=\\s)',
    replacement: '\\bword\\b',  // Use word boundaries instead
    // No flags = applies to any flags
  }
];
```

### 2. Load the Polyfill

```javascript
// In Node.js
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

// In browser
<script src="RegExp.lookbehind.js"></script>
```

### 3. Use Your Regex Normally

```javascript
// This will use the replacement pattern instead of attempting to polyfill
const regex = new RegExp('(?<! cu)bot|(?<! (ya|yandex))search', 'i');

// The .source property still shows the original pattern
console.log(regex.source); // '(?<! cu)bot|(?<! (ya|yandex))search'

// But internally it uses the replacement pattern
regex.test('somebot'); // true (would be false with proper negative lookbehind)
```

## Replacement Strategy Examples

### User Agent Detection
```javascript
{
  // Original: complex negative lookbehind
  original: '(?<! cu)bot|(?<! (ya|yandex))search',
  
  // Replacement: simplified (will match more broadly)
  replacement: 'bot|search',
  
  // Consider: Add post-processing to filter false positives
}
```

### Word Boundaries
```javascript
{
  // Original: lookbehind/lookahead for whitespace
  original: '(?<=\\s)word(?=\\s)',
  
  // Replacement: use word boundaries
  replacement: '\\bword\\b'
}
```

### HTML Content Extraction
```javascript
{
  // Original: extract content between tags
  original: '(?<=<title>).*?(?=</title>)',
  
  // Replacement: capture the whole tag
  replacement: '<title>(.*?)</title>',
  
  // Note: You'll need to use match[1] instead of match[0]
}
```

## Important Notes

1. **Exact Match Required**: The `original` pattern must match the regex source exactly
2. **Flag Matching**: If `flags` is specified, it must match exactly
3. **Behavior Changes**: Replacement patterns may behave differently than the original
4. **Testing**: Always test your replacement patterns thoroughly
5. **Performance**: Replacements use native regex (faster than polyfilled lookbehind)

## When to Use Replacements vs Polyfill

**Use Replacements For:**
- Complex lookbehind patterns (`(?<! cu)bot`)
- Performance-critical code
- Patterns you can simplify equivalently

**Use Polyfill For:**
- Simple lookbehind patterns (`(?<=abc)def`)
- When you need exact lookbehind behavior
- Development/testing scenarios

## Testing Your Replacements

```javascript
// Test file example
globalThis.__lookbehind_regex_replacements = [
  { original: 'your-pattern', replacement: 'simpler-pattern' }
];

eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

const regex = new RegExp('your-pattern');
// Test with various inputs to ensure replacement works correctly
```
