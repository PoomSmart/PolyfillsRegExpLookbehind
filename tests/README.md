# RegExp Lookbehind Polyfill - Test Suite

This directory contains the test suite for the RegExp Lookbehind Polyfill.

## Main Test Files

### Core Tests
- **`test_all.js`** - Comprehensive test suite covering all polyfill features
- **`test_basic_usage.js`** - Simple usage examples and basic functionality
- **`test_advanced.js`** - Advanced features and custom replacements

### Debug Scripts
- **`debug_validation.js`** - Validation and verification scripts
- **`debug_step_by_step.js`** - Step-by-step debugging for complex issues
- **`debug_internal.js`** - Internal state debugging
- **`debug_lookbehind.js`** - Lookbehind-specific debugging

## Usage

Run the comprehensive test suite:
```bash
node tests/test_all.js
```

Run basic usage examples:
```bash
node tests/test_basic_usage.js
```

Run advanced feature tests:
```bash
node tests/test_advanced.js
```

## Test Coverage

The test suite covers:
- ✅ Basic positive and negative lookbehind patterns
- ✅ Global pattern matching
- ✅ String method integration (match, replace, search, split)
- ✅ Partial lookbehind replacements
- ✅ Full pattern replacements
- ✅ Property preservation (source, flags, lastIndex)
- ✅ Error handling and edge cases
- ✅ RegExp constructor compatibility
- ✅ Unicode flag support
- ✅ Complex pattern graceful handling

## Archived Files

The `archived/` directory contains older test files that have been superseded by the current test suite. These are kept for historical reference but are no longer actively maintained.

## Test Results

All tests should pass with the current polyfill implementation. If any tests fail, please check:
1. The pattern is supported (only simple literal lookbehind patterns work)
2. The polyfill script is loaded correctly
3. No conflicting polyfills are present
