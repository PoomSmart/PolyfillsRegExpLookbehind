(() => {
    if (globalThis.__lookbehind_polyfill_applied) return;
    globalThis.__lookbehind_polyfill_applied = true;

    /*
     * RegExp Lookbehind Polyfill
     *
     * Provides support for simple positive (?<=pattern) and negative (?<!pattern)
     * lookbehind assertions in JavaScript RegExp.
     *
     * FEATURES:
     * - Simple literal string lookbehind patterns only (e.g., (?<=abc), (?<!xyz))
     * - Works with RegExp constructor: new RegExp('(?<=abc)def')
     * - Integrates with String methods: match, replace, search, split
     * - Maintains RegExp static properties ($1, $2, etc.) for compatibility
     * - Does not break existing native RegExp behavior
     * - Polyfills indices flag ("d" flag) for hasIndices property and match indices
     *
     * LIMITATIONS:
     * - Only supports simple literal strings in lookbehind (no \d, +, *, {}, etc.)
     * - Complex patterns are rejected with SyntaxError in test mode, or ignored otherwise
     * - Performance may be slower than native lookbehind on supported platforms
     * - Indices polyfill provides basic functionality but may not be 100% identical to native
     *
     * USAGE:
     * Include this script before using lookbehind patterns:
     *
     *   <script src="RegExp.lookbehind.js"></script>
     *   <script>
     *     // Basic usage
     *     const regex = new RegExp('(?<=abc)def');
     *     console.log(regex.test('abcdef')); // true
     *     console.log(regex.test('xyzdef')); // false
     *
     *     // With indices flag
     *     const regexWithIndices = new RegExp('(\\w+)', 'gd');
     *     console.log(regexWithIndices.hasIndices); // true
     *     const match = regexWithIndices.exec('hello world');
     *     console.log(match.indices); // [[0, 5], [0, 5]]
     *
     *     // With String methods
     *     'abcdef'.replace(new RegExp('(?<=abc)def'), 'XYZ'); // 'abcXYZ'
     *     'abcdef ghi'.match(new RegExp('(?<=abc)\\w+', 'g')); // ['def']
     *
     *     // Static properties work
     *     new RegExp('(?<=abc)(\\w+)').exec('abcdef');
     *     console.log(RegExp.$1); // 'def'
     *   </script>
     *
     * OPTIONAL FEATURES:
     * For maximum compatibility with legacy websites that expect literal RegExp
     * to update static properties, set this flag before loading the polyfill:
     *
     *   globalThis.__lookbehind_patch_native_statics = true;
     *
     * This will make even literal RegExp like /pattern/ update RegExp.$1, etc.
     * Only enable this if your website specifically needs this legacy behavior.
     *
     * REGEX REPLACEMENT FEATURE:
     * For complex regex patterns with lookbehind that can't be polyfilled, you can
     * define replacement patterns that will be used instead. This is particularly
     * useful for patterns with complex lookbehind assertions like (?<! cu)bot.
     *
     * Setup (before loading the polyfill):
     *   globalThis.__lookbehind_regex_replacements = [
     *     {
     *       original: '(?<! cu)bot|(?<! (ya|yandex))search',  // Complex pattern
     *       replacement: 'bot|search',                        // Simplified version
     *       flags: 'i'  // Optional: only apply for specific flags
     *     },
     *     {
     *       original: '(?<=\\s)word(?=\\s)',
     *       replacement: '\\bword\\b'  // Use word boundaries instead
     *       // No flags = applies to any flags
     *     }
     *   ];
     *
     * Benefits:
     * - Handles complex lookbehind patterns that can't be polyfilled
     * - Better performance (uses native regex instead of polyfill)
     * - Allows custom logic for equivalent patterns
     * - Maintains original .source property for debugging
     *
     * Note: You're responsible for ensuring the replacement pattern
     * behaves appropriately for your use case.
     */

    const NativeRegExp = globalThis.RegExp;

    // Check if native RegExp supports hasIndices (indices flag)
    let nativeSupportsIndices = false;
    try {
        const testRegex = new NativeRegExp("test", "d");
        nativeSupportsIndices = testRegex.hasIndices === true;
    } catch (e) {
        nativeSupportsIndices = false;
    }

    // Initialize regex replacements registry
    const regexReplacements = globalThis.__lookbehind_regex_replacements || [
        {
            original: "(?<! cu)bot|(?<! (ya|yandex))search",
            replacement: "bot|search",
            flags: "i",
        },
        {
            // Email validation pattern with negative lookbehind to prevent local part from ending with a dot
            original: "(?<!\\.)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
            // Alternative without lookbehind - use word boundary and character class exclusion
            replacement: "(?:[^.]|^)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
            flags: "g",
        },
        {
            // Password validation: at least 8 chars, not starting with a number (negative lookbehind)
            original: "(?<!^\\d).{8,}",
            // Alternative without lookbehind - explicitly check first character is not a digit
            replacement: "(?![0-9]).{8,}",
            flags: "",
        },
        {
            // URL validation - ensuring protocol doesn't start with file:// (negative lookbehind)
            original: "(?<!file://)https?://[\\w.-]+",
            // Alternative without lookbehind - use negative lookahead instead
            replacement: "(?!file://)https?://[\\w.-]+",
            flags: "g",
        },
        {
            // Word boundary with negative lookbehind for @ symbol (useful for mentions)
            original: "(?<!@)\\b\\w+\\b",
            // Alternative without lookbehind - check for non-@ character before word
            replacement: "(?:^|[^@])\\b\\w+\\b",
            flags: "g",
        },
        {
            // CSS class selector that's not preceded by a period (negative lookbehind)
            original: "(?<!\\.)([a-zA-Z][\\w-]*)",
            // Alternative without lookbehind - capture classes not starting with period
            replacement: "(?:^|[^.]|\\s)([a-zA-Z][\\w-]*)",
            flags: "g",
        },
        {
            // Decimal number not preceded by another digit (negative lookbehind)
            original: "(?<!\\d)\\d+\\.\\d+",
            // Alternative without lookbehind - use word boundary or start of string
            replacement: "(?:^|[^\\d])\\d+\\.\\d+",
            flags: "g",
        },
        {
            // Common partial pattern: lookbehind for 'bot' not preceded by specific characters
            // Simplified to just match 'bot' for broader compatibility
            original: "(?<! cu)bot",
            replacement: "bot",
            // No flags specified = applies to any flags
        },
        {
            // Common partial pattern: lookbehind for 'search' not preceded by ya/yandex
            // Simplified to just match 'search' for broader compatibility
            original: "(?<! (ya|yandex))search",
            replacement: "search",
            // No flags specified = applies to any flags
        },
        {
            // Complex address pattern with multiple negative lookbehinds
            // Original: matches "address" not preceded by email/ip with various separators
            original:
                "(?<!email)(?<!email-)(?<!email_)(?<!email\\.)(?<!email\\s)(?<!ip)(?<!ip-)(?<!ip_)(?<!ip\\s)(?<!ip\\.)address",
            // Simplified to just match 'address' for broader compatibility
            replacement: "address",
            // No flags specified = applies to any flags
        },
        {
            // API key/token/secret pattern with negative lookbehinds
            // Original: matches "api" + separator + "secret|token|key" not preceded by datadog_/dd_
            original:
                "(?<!datadog_)(?<!dd_)api[-\\s._]{0,1}(?:secret|token|key)",
            // Simplified to just match the api pattern for broader compatibility
            replacement: "api[-\\s._]{0,1}(?:secret|token|key)",
            // No flags specified = applies to any flags
        },
    ];

    // Assign to global registry so it's accessible
    globalThis.__lookbehind_regex_replacements = regexReplacements;
    // Legacy alias for compatibility
    globalThis.__lookbehind_partial_replacements = regexReplacements;

    function normalizeRegexSource(source) {
        // Normalize escape sequences to ensure consistent matching
        // This handles differences in how escape sequences are represented
        // when patterns are created via RegExp constructor vs. literals
        return source
            .replace(/\\\\/g, "\\") // Normalize double backslashes
            .replace(/\\s/g, "\\s") // Ensure whitespace escapes are consistent
            .replace(/\\d/g, "\\d") // Ensure digit escapes are consistent
            .replace(/\\w/g, "\\w") // Ensure word escapes are consistent
            .replace(/\\n/g, "\\n") // Ensure newline escapes are consistent
            .replace(/\\r/g, "\\r") // Ensure carriage return escapes are consistent
            .replace(/\\t/g, "\\t") // Ensure tab escapes are consistent
            .replace(/\\f/g, "\\f") // Ensure form feed escapes are consistent
            .replace(/\\v/g, "\\v") // Ensure vertical tab escapes are consistent
            .replace(/\\\^/g, "\\^") // Ensure caret escapes are consistent
            .replace(/\\\$/g, "\\$") // Ensure dollar escapes are consistent
            .replace(/\\\(/g, "\\(") // Ensure parenthesis escapes are consistent
            .replace(/\\\)/g, "\\)")
            .replace(/\\\[/g, "\\[") // Ensure bracket escapes are consistent
            .replace(/\\\]/g, "\\]")
            .replace(/\\\{/g, "\\{") // Ensure brace escapes are consistent
            .replace(/\\\}/g, "\\}")
            .replace(/\\\+/g, "\\+") // Ensure plus escapes are consistent
            .replace(/\\\*/g, "\\*") // Ensure asterisk escapes are consistent
            .replace(/\\\?/g, "\\?") // Ensure question mark escapes are consistent
            .replace(/\\\|/g, "\\|") // Ensure pipe escapes are consistent
            .replace(/\\\./g, "\\."); // Ensure dot escapes are consistent (last to avoid conflicts)
    }

    function checkForRegexReplacement(source, flags) {
        // Check if this regex pattern should be replaced with an alternative
        const normalizedSource = normalizeRegexSource(source);

        for (const replacement of regexReplacements) {
            const normalizedOriginal = normalizeRegexSource(
                replacement.original
            );

            // Check for exact match first (highest priority)
            if (normalizedOriginal === normalizedSource) {
                // If flags are specified in the replacement, they must match
                if (
                    replacement.flags !== undefined &&
                    replacement.flags !== flags
                ) {
                    continue;
                }
                return replacement.replacement;
            }
        }

        // If no exact match found, check for partial matches
        for (const replacement of regexReplacements) {
            const normalizedOriginal = normalizeRegexSource(
                replacement.original
            );

            // Check if the registry pattern is a substring of the actual pattern
            if (normalizedSource.includes(normalizedOriginal)) {
                // If flags are specified in the replacement, they must match
                if (
                    replacement.flags !== undefined &&
                    replacement.flags !== flags
                ) {
                    continue;
                }
                // For partial matches, replace only the matched substring
                // We need to work with the original source to preserve escaping
                const originalIndex = source.indexOf(replacement.original);
                if (originalIndex !== -1) {
                    // Replace in the original source
                    return (
                        source.slice(0, originalIndex) +
                        replacement.replacement +
                        source.slice(
                            originalIndex + replacement.original.length
                        )
                    );
                } else {
                    // If we can't find the exact original pattern in the source,
                    // try to replace the normalized version in the normalized source
                    // then map it back (this handles escaping differences)
                    const replacedNormalized = normalizedSource.replace(
                        normalizedOriginal,
                        replacement.replacement
                    );
                    return replacedNormalized;
                }
            }
        }

        return null;
    }

    function extractLookbehind(source) {
        // Extract lookbehind without using RegExp to avoid recursion
        const lookbehindStart = source.indexOf("(?<");
        if (lookbehindStart === -1) return null;

        const typeIndex = lookbehindStart + 3;
        const type = source[typeIndex]; // '=' or '!'
        if (type !== "=" && type !== "!") return null;

        const patternStart = typeIndex + 1;
        const patternEnd = source.indexOf(")", patternStart);
        if (patternEnd === -1) return null;

        const pattern = source.slice(patternStart, patternEnd);

        // Check for complex patterns (only simple allowed) - manual check
        const hasComplexChars =
            pattern.indexOf("(") !== -1 ||
            pattern.indexOf(")") !== -1 ||
            pattern.indexOf("|") !== -1 ||
            pattern.indexOf("+") !== -1 ||
            pattern.indexOf("*") !== -1 ||
            pattern.indexOf("?") !== -1 ||
            pattern.indexOf("{") !== -1 ||
            pattern.indexOf("}") !== -1 ||
            pattern.indexOf("[") !== -1 ||
            pattern.indexOf("]") !== -1 ||
            pattern.indexOf("\\") !== -1;

        if (hasComplexChars) {
            if (globalThis.__isTest) {
                throw new SyntaxError(
                    "Unsupported complex lookbehind: (?<" + type + pattern + ")"
                );
            }
            // In production, return a special marker indicating complex lookbehind
            return { isComplex: true };
        }

        const raw = source.slice(lookbehindStart, patternEnd + 1);
        return { type, pattern, raw, index: lookbehindStart, isComplex: false };
    }

    function safeSetProperty(obj, key, value) {
        try {
            obj[key] = value;
        } catch (e) {
            // Ignore readonly property errors
        }
    }

    function toString(value) {
        return value + ""; // Convert to string without calling String()
    }

    function copyStaticProperties() {
        // Copy static properties from native RegExp to polyfilled RegExp for compatibility
        const staticProps = [
            "input",
            "leftContext",
            "rightContext",
            "lastMatch",
            "lastParen",
        ];
        staticProps.forEach((prop) => {
            if (prop in NativeRegExp) {
                RegExp[prop] = NativeRegExp[prop];
            }
        });

        // Copy numbered groups $1-$9
        for (let i = 1; i <= 9; i++) {
            const prop = `$${i}`;
            if (prop in NativeRegExp) {
                RegExp[prop] = NativeRegExp[prop];
            }
        }
    }

    function createIndicesArray(match, str) {
        // Create indices array for match result when hasIndices is true
        if (!match) return null;

        const indices = [];

        // Add main match indices
        indices.push([match.index, match.index + match[0].length]);

        // Add capture group indices
        for (let i = 1; i < match.length; i++) {
            if (match[i] !== undefined) {
                // Find the position of this capture group in the string
                const groupValue = match[i];
                let searchStart = match.index;

                // For capture groups, we need to find their position within the match
                // This is a simplified approach - native implementation is more complex
                const groupIndex = str.indexOf(groupValue, searchStart);
                if (groupIndex !== -1) {
                    indices.push([groupIndex, groupIndex + groupValue.length]);
                } else {
                    indices.push([
                        searchStart,
                        searchStart + groupValue.length,
                    ]);
                }
            } else {
                indices.push(undefined);
            }
        }

        return indices;
    }

    function createPropertyGetter(propName, defaultValue = undefined) {
        return function () {
            if (this._regexp) {
                return this._regexp[propName];
            }
            try {
                return Object.getOwnPropertyDescriptor(
                    NativeRegExp.prototype,
                    propName
                ).get.call(this);
            } catch (e) {
                // Handle cases where this is not a RegExp instance (e.g., RegExp.prototype)
                return defaultValue;
            }
        };
    }

    function updateRegExpStatics(match, input) {
        const left = input.slice(0, match.index);
        const right = input.slice(match.index + match[0].length);

        // Update both native and polyfilled RegExp static properties for compatibility
        const props = {
            input: input,
            leftContext: left,
            rightContext: right,
            lastMatch: match[0],
            lastParen: match[match.length - 1] || "",
        };

        const targets = [globalThis.RegExp];
        if (NativeRegExp !== globalThis.RegExp) {
            targets.push(NativeRegExp);
        }

        // Set named properties on all targets
        for (const target of targets) {
            for (const [key, value] of Object.entries(props)) {
                safeSetProperty(target, key, value);
            }
        }

        // Set numbered groups $1-$9 on all targets
        for (const target of targets) {
            for (let i = 1; i <= 9; i++) {
                safeSetProperty(target, `$${i}`, match[i] || "");
            }
        }
    }

    function createPolyfillRegExpInstance(
        nativeRegExp,
        originalSource,
        flags,
        lookbehindInfo
    ) {
        // Create a new RegExp instance that will serve as the base
        // This ensures Object.prototype.toString.call() returns "[object RegExp]"
        const baseRegExp = new NativeRegExp(
            nativeRegExp.source,
            nativeRegExp.flags
        );

        // Add polyfill properties to the actual RegExp instance
        Object.defineProperty(baseRegExp, "_regexp", { value: nativeRegExp });
        Object.defineProperty(baseRegExp, "_originalSource", {
            value: originalSource,
        });
        Object.defineProperty(baseRegExp, "_flags", { value: flags });
        Object.defineProperty(baseRegExp, "_lookbehindInfo", {
            value: lookbehindInfo,
        });

        // Define lastIndex as a data property for is-regex compatibility
        Object.defineProperty(baseRegExp, "lastIndex", {
            value: 0,
            writable: true,
            enumerable: false,
            configurable: false,
        });

        // Ensure the prototype chain is correct
        Object.setPrototypeOf(baseRegExp, RegExp.prototype);

        return baseRegExp;
    }

    function RegExp(pattern, flags) {
        // Handle the case where RegExp is called as a function
        if (!(this instanceof RegExp)) {
            return new RegExp(pattern, flags);
        }

        let source, inputFlags;

        if (
            pattern &&
            typeof pattern === "object" &&
            pattern.constructor === NativeRegExp
        ) {
            source = pattern.source;
            inputFlags = flags !== undefined ? flags : pattern.flags;
        } else {
            source = toString(pattern);
            inputFlags = toString(flags || "");
        }

        // Check for regex replacement first
        const replacementSource = checkForRegexReplacement(source, inputFlags);
        if (replacementSource) {
            // Handle indices flag ('d') - remove it if native RegExp doesn't support it
            let nativeFlags = inputFlags;
            const hasIndicesFlag = inputFlags.includes("d");
            if (hasIndicesFlag && !nativeSupportsIndices) {
                // Remove 'd' flag from flags passed to native RegExp
                nativeFlags = inputFlags.replace(/d/g, "");
            }

            // Use the replacement pattern instead
            const nativeRegExp = new NativeRegExp(
                replacementSource,
                nativeFlags
            );
            const polyfillInstance = createPolyfillRegExpInstance(
                nativeRegExp,
                source, // Store original source for .source property
                inputFlags,
                null
            );
            return polyfillInstance;
        }

        const lookbehindInfo = extractLookbehind(source);

        // Handle complex lookbehind by falling back to native RegExp
        if (lookbehindInfo && lookbehindInfo.isComplex) {
            try {
                // Handle indices flag ('d') - remove it if native RegExp doesn't support it
                let nativeFlags = inputFlags;
                const hasIndicesFlag = inputFlags.includes("d");
                if (hasIndicesFlag && !nativeSupportsIndices) {
                    // Remove 'd' flag from flags passed to native RegExp
                    nativeFlags = inputFlags.replace(/d/g, "");
                }

                // Try to create with native RegExp (works if engine supports lookbehind)
                const nativeRegExp = new NativeRegExp(source, nativeFlags);
                const polyfillInstance = createPolyfillRegExpInstance(
                    nativeRegExp,
                    source,
                    inputFlags,
                    null
                );
                return polyfillInstance;
            } catch (e) {
                // If native RegExp fails, remove the lookbehind and create without it
                // This allows the script to continue running
                let sourceWithoutLB = source;

                // Simple removal of lookbehind patterns - remove (?<= or (?<! until matching )
                while (sourceWithoutLB.indexOf("(?<") !== -1) {
                    const start = sourceWithoutLB.indexOf("(?<");
                    const end = sourceWithoutLB.indexOf(")", start);
                    if (end === -1) break; // Malformed pattern
                    sourceWithoutLB =
                        sourceWithoutLB.slice(0, start) +
                        sourceWithoutLB.slice(end + 1);
                }

                // Handle indices flag ('d') - remove it if native RegExp doesn't support it
                let nativeFlags = inputFlags;
                const hasIndicesFlag = inputFlags.includes("d");
                if (hasIndicesFlag && !nativeSupportsIndices) {
                    // Remove 'd' flag from flags passed to native RegExp
                    nativeFlags = inputFlags.replace(/d/g, "");
                }

                const nativeRegExp = new NativeRegExp(
                    sourceWithoutLB,
                    nativeFlags
                );
                const polyfillInstance = createPolyfillRegExpInstance(
                    nativeRegExp,
                    source,
                    inputFlags,
                    null
                );
                return polyfillInstance;
            }
        }

        const sourceWithoutLB =
            lookbehindInfo && !lookbehindInfo.isComplex
                ? source.slice(0, lookbehindInfo.index) +
                  source.slice(lookbehindInfo.index + lookbehindInfo.raw.length)
                : source;

        // Handle indices flag ('d') - remove it if native RegExp doesn't support it
        let nativeFlags = inputFlags;
        const hasIndicesFlag = inputFlags.includes("d");
        if (hasIndicesFlag && !nativeSupportsIndices) {
            // Remove 'd' flag from flags passed to native RegExp
            nativeFlags = inputFlags.replace(/d/g, "");
        }

        // Create the internal native RegExp
        const nativeRegExp = new NativeRegExp(sourceWithoutLB, nativeFlags);

        const polyfillInstance = createPolyfillRegExpInstance(
            nativeRegExp,
            source,
            inputFlags,
            lookbehindInfo
        );
        return polyfillInstance;
    }

    RegExp.toString = function () {
        return "function RegExp() { [lookbehind polyfilled code] }";
    };

    // Create a new prototype instead of sharing the native one
    RegExp.prototype = Object.create(NativeRegExp.prototype);

    // Define properties that delegate to the internal regexp, but only for polyfilled instances
    const regexpProperties = [
        { name: "global", defaultValue: undefined },
        { name: "ignoreCase", defaultValue: undefined },
        { name: "multiline", defaultValue: undefined },
        { name: "dotAll", defaultValue: undefined },
        { name: "unicode", defaultValue: undefined },
        { name: "sticky", defaultValue: undefined },
    ];

    regexpProperties.forEach(({ name, defaultValue }) => {
        Object.defineProperty(RegExp.prototype, name, {
            enumerable: true,
            get: createPropertyGetter(name, defaultValue),
        });
    });

    // Special handling for flags and source (custom logic)
    Object.defineProperty(RegExp.prototype, "flags", {
        enumerable: true,
        get: function () {
            if (this._flags) {
                return this._flags;
            }
            try {
                return Object.getOwnPropertyDescriptor(
                    NativeRegExp.prototype,
                    "flags"
                ).get.call(this);
            } catch (e) {
                // Handle cases where this is not a RegExp instance (e.g., RegExp.prototype)
                return "";
            }
        },
    });

    Object.defineProperty(RegExp.prototype, "source", {
        enumerable: true,
        get: function () {
            if (this._originalSource) {
                return this._originalSource;
            }
            try {
                return Object.getOwnPropertyDescriptor(
                    NativeRegExp.prototype,
                    "source"
                ).get.call(this);
            } catch (e) {
                // Handle cases where this is not a RegExp instance (e.g., RegExp.prototype)
                return "";
            }
        },
    });

    // Special handling for hasIndices property
    Object.defineProperty(RegExp.prototype, "hasIndices", {
        enumerable: true,
        get: function () {
            if (this._flags !== undefined) {
                return this._flags.includes("d");
            }
            if (nativeSupportsIndices) {
                try {
                    return Object.getOwnPropertyDescriptor(
                        NativeRegExp.prototype,
                        "hasIndices"
                    ).get.call(this);
                } catch (e) {
                    // Handle cases where this is not a RegExp instance (e.g., RegExp.prototype)
                    return false;
                }
            }
            // Fallback: check flags for 'd'
            return this.flags.includes("d");
        },
    });

    RegExp.prototype.toString = function () {
        return "/" + this.source + "/" + this.flags;
    };

    RegExp.prototype.exec = function (str) {
        str = toString(str);

        // Check if this is a polyfilled RegExp instance or a native one
        if (!this._regexp) {
            // This is a native RegExp, use the original exec method
            const result = NativeRegExp.prototype.exec.call(this, str);
            // Manually update static properties for compatibility (since modern engines don't do this automatically)
            if (result) {
                updateRegExpStatics(result, str);
                // Add indices if this regex has the 'd' flag and native doesn't support it
                if (this.hasIndices && !nativeSupportsIndices) {
                    result.indices = createIndicesArray(result, str);
                }
            }
            return result;
        }

        const info = this._lookbehindInfo;

        if (!info) {
            // Sync lastIndex with internal regexp
            this._regexp.lastIndex = this.lastIndex;
            const match = this._regexp.exec(str);
            // Sync back the lastIndex
            this.lastIndex = this._regexp.lastIndex;
            if (match) {
                updateRegExpStatics(match, str);
                // Add indices if this regex has the 'd' flag
                if (this.hasIndices && !nativeSupportsIndices) {
                    match.indices = createIndicesArray(match, str);
                }
            }
            return match;
        }

        // Handle lookbehind logic
        // Sync lastIndex with internal regexp
        this._regexp.lastIndex = this.lastIndex;

        while (true) {
            const match = this._regexp.exec(str);
            if (!match) {
                // Sync back the lastIndex
                this.lastIndex = this._regexp.lastIndex;
                return null;
            }

            const i = match.index;

            // Check lookbehind condition
            const behind = str.slice(Math.max(0, i - info.pattern.length), i);

            // For positive lookbehind (?<=pattern), the pattern must match at the end of behind
            // For negative lookbehind (?<!pattern), the pattern must NOT match at the end of behind
            const passed =
                info.type === "="
                    ? behind.endsWith(info.pattern)
                    : !behind.endsWith(info.pattern);

            if (passed) {
                match.index = i;
                match.input = str;
                // Sync back the lastIndex
                this.lastIndex = this._regexp.lastIndex;
                updateRegExpStatics(match, str);
                // Add indices if this regex has the 'd' flag
                if (this.hasIndices && !nativeSupportsIndices) {
                    match.indices = createIndicesArray(match, str);
                }
                return match;
            }

            // If lookbehind failed and this is not a global regex, no match
            if (!this.global) {
                // Sync back the lastIndex
                this.lastIndex = this._regexp.lastIndex;
                return null;
            }

            // For global regexes, continue searching from the next position
            // If the match was empty, advance by 1 to avoid infinite loop
            if (match[0].length === 0) {
                this._regexp.lastIndex = i + 1;
            }
        }
    };

    RegExp.prototype.test = function (str) {
        // Check if this is a native RegExp instance
        if (!this._regexp) {
            return NativeRegExp.prototype.test.call(this, str);
        }

        // For polyfilled instances, sync lastIndex and use exec
        const result = this.exec(str);
        return result !== null;
    };

    RegExp.prototype.constructor = RegExp;

    globalThis.RegExp = RegExp;

    // Optional: Patch native RegExp prototype for full static property compatibility
    // This makes literal RegExp (/pattern/) also update static properties
    // Enable this only if your website specifically needs this legacy behavior
    if (globalThis.__lookbehind_patch_native_statics) {
        const originalNativeExec = NativeRegExp.prototype.exec;
        NativeRegExp.prototype.exec = function (str) {
            const result = originalNativeExec.call(this, str);
            if (result) {
                updateRegExpStatics(result, toString(str));
            }
            return result;
        };
    }

    // Copy static properties from native RegExp to polyfilled RegExp for compatibility
    copyStaticProperties();

    // --- Patch string methods ---

    const original = {
        replace: String.prototype.replace,
        match: String.prototype.match,
        search: String.prototype.search,
        split: String.prototype.split,
    };

    String.prototype.replace = function (search, replacement) {
        const str = toString(this);
        if (search instanceof RegExp && search._lookbehindInfo) {
            const re = search.global
                ? search
                : new RegExp(search.source, search.flags + "g");
            let result = "",
                lastIndex = 0,
                match;

            while ((match = re.exec(str))) {
                const i = match.index;
                result += str.slice(lastIndex, i);
                result +=
                    typeof replacement === "function"
                        ? replacement(...match, i, str)
                        : original.replace.call(
                              toString(replacement),
                              /\$&/g,
                              match[0]
                          );
                lastIndex = i + match[0].length;
                if (match[0] === "") re.lastIndex++;
                if (!search.global) break;
            }

            return result + str.slice(lastIndex);
        }

        return original.replace.call(str, search, replacement);
    };

    String.prototype.match = function (pattern) {
        const str = toString(this);
        if (!(pattern instanceof RegExp)) pattern = new RegExp(pattern);
        if (pattern.global) {
            const results = [];
            let m;
            while ((m = pattern.exec(str))) {
                results.push(m[0]);
                if (m[0] === "") pattern.lastIndex++;
            }
            return results.length ? results : null;
        }
        return pattern.exec(str);
    };

    String.prototype.search = function (pattern) {
        const str = toString(this);
        if (!(pattern instanceof RegExp)) pattern = new RegExp(pattern);
        const m = pattern.exec(str);
        return m ? m.index : -1;
    };

    String.prototype.split = function (separator, limit) {
        const str = toString(this);
        if (!(separator instanceof RegExp))
            return original.split.call(str, separator, limit);

        const re = separator.global
            ? separator
            : new RegExp(separator.source, separator.flags + "g");
        const output = [];
        let lastIndex = 0,
            match;

        while ((match = re.exec(str))) {
            output.push(str.slice(lastIndex, match.index));
            lastIndex = match.index + match[0].length;
            if (match[0] === "") re.lastIndex++;
            if (limit !== undefined && output.length >= limit) break;
        }

        output.push(str.slice(lastIndex));
        return output;
    };

    // --- Polyfill for indices ("d" flag) support ---

    // Optional: Patch native RegExp prototype for full static property compatibility
    // This makes literal RegExp (/pattern/) also update static properties
    // Enable this only if your website specifically needs this legacy behavior
    if (globalThis.__lookbehind_patch_native_statics) {
        const originalNativeExec = NativeRegExp.prototype.exec;
        NativeRegExp.prototype.exec = function (str) {
            const result = originalNativeExec.call(this, str);
            if (result) {
                updateRegExpStatics(result, toString(str));
            }
            return result;
        };
    }
})();
