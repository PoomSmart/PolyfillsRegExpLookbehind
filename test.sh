#!/bin/bash
echo "Running RegExp Lookbehind Polyfill Test Suite"
echo "=============================================="

echo -e "\n1. Comprehensive Test Suite:"
node tests/test_all.js

echo -e "\n2. Basic Usage Examples:"
node tests/test_basic_usage.js

echo -e "\n3. Advanced Features Test:"
node tests/test_advanced.js

echo -e "\nAll tests completed!"
