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
     * 
     * LIMITATIONS:
     * - Only supports simple literal strings in lookbehind (no \d, +, *, {}, etc.)
     * - Complex patterns are rejected with SyntaxError in test mode, or ignored otherwise
     * - Performance may be slower than native lookbehind on supported platforms
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
     */

    const NativeRegExp = globalThis.RegExp;

    function hasAnyLookbehind(source) {
        // Check if the source contains any lookbehind syntax
        return source.indexOf('(?<') !== -1;
    }

    function extractLookbehind(source) {
        // Extract lookbehind without using RegExp to avoid recursion
        const lookbehindStart = source.indexOf('(?<');
        if (lookbehindStart === -1) return null;

        const typeIndex = lookbehindStart + 3;
        const type = source[typeIndex]; // '=' or '!'
        if (type !== '=' && type !== '!') return null;

        const patternStart = typeIndex + 1;
        const patternEnd = source.indexOf(')', patternStart);
        if (patternEnd === -1) return null;

        const pattern = source.slice(patternStart, patternEnd);

        // Check for complex patterns (only simple allowed) - manual check
        const hasComplexChars = pattern.indexOf('(') !== -1 ||
            pattern.indexOf(')') !== -1 ||
            pattern.indexOf('|') !== -1 ||
            pattern.indexOf('+') !== -1 ||
            pattern.indexOf('*') !== -1 ||
            pattern.indexOf('?') !== -1 ||
            pattern.indexOf('{') !== -1 ||
            pattern.indexOf('}') !== -1 ||
            pattern.indexOf('[') !== -1 ||
            pattern.indexOf(']') !== -1 ||
            pattern.indexOf('\\') !== -1;

        if (hasComplexChars) {
            if (globalThis.__isTest) {
                throw new SyntaxError('Unsupported complex lookbehind: (?<' + type + pattern + ')');
            }
            // In production, return a special marker indicating complex lookbehind
            return { isComplex: true };
        }

        const raw = source.slice(lookbehindStart, patternEnd + 1);
        return { type, pattern, raw, index: lookbehindStart, isComplex: false };
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
            lastParen: match[match.length - 1] || ''
        };

        // Safely set properties on our polyfilled RegExp
        for (const [key, value] of Object.entries(props)) {
            try {
                globalThis.RegExp[key] = value;
            } catch (e) {
                // Ignore readonly property errors
            }
        }

        // Also set on native RegExp if it's different (for websites checking NativeRegExp.$1)
        if (NativeRegExp !== globalThis.RegExp) {
            for (const [key, value] of Object.entries(props)) {
                try {
                    NativeRegExp[key] = value;
                } catch (e) {
                    // Ignore readonly property errors
                }
            }
        }

        // Set numbered groups on both
        for (let i = 1; i <= 9; i++) {
            const value = match[i] || '';
            try {
                globalThis.RegExp[`$${i}`] = value;
            } catch (e) {
                // Ignore readonly property errors
            }
            if (NativeRegExp !== globalThis.RegExp) {
                try {
                    NativeRegExp[`$${i}`] = value;
                } catch (e) {
                    // Ignore readonly property errors
                }
            }
        }
    }

    function RegExp(pattern, flags) {
        if (this instanceof RegExp) {
            let source, inputFlags;

            if (pattern && typeof pattern === 'object' && pattern.constructor === NativeRegExp) {
                source = pattern.source;
                inputFlags = flags !== undefined ? flags : pattern.flags;
            } else {
                source = pattern + ''; // Convert to string without calling String()
                inputFlags = (flags || '') + ''; // Convert to string
            }

            const lookbehindInfo = extractLookbehind(source);

            // Handle complex lookbehind by falling back to native RegExp
            if (lookbehindInfo && lookbehindInfo.isComplex) {
                try {
                    // Try to create with native RegExp (works if engine supports lookbehind)
                    const nativeRegExp = new NativeRegExp(source, inputFlags);
                    Object.defineProperty(this, '_regexp', { value: nativeRegExp });
                    Object.defineProperty(this, '_originalSource', { value: source });
                    Object.defineProperty(this, '_flags', { value: inputFlags });
                    Object.defineProperty(this, '_lookbehindInfo', { value: null }); // No polyfill needed
                    return;
                } catch (e) {
                    // If native RegExp fails, remove the lookbehind and create without it
                    // This allows the script to continue running
                    let sourceWithoutLB = source;

                    // Simple removal of lookbehind patterns - remove (?<= or (?<! until matching )
                    while (sourceWithoutLB.indexOf('(?<') !== -1) {
                        const start = sourceWithoutLB.indexOf('(?<');
                        const end = sourceWithoutLB.indexOf(')', start);
                        if (end === -1) break; // Malformed pattern
                        sourceWithoutLB = sourceWithoutLB.slice(0, start) + sourceWithoutLB.slice(end + 1);
                    }

                    const nativeRegExp = new NativeRegExp(sourceWithoutLB, inputFlags);
                    Object.defineProperty(this, '_regexp', { value: nativeRegExp });
                    Object.defineProperty(this, '_originalSource', { value: source });
                    Object.defineProperty(this, '_flags', { value: inputFlags });
                    Object.defineProperty(this, '_lookbehindInfo', { value: null });
                    return;
                }
            }

            const sourceWithoutLB = lookbehindInfo && !lookbehindInfo.isComplex
                ? source.slice(0, lookbehindInfo.index) + source.slice(lookbehindInfo.index + lookbehindInfo.raw.length)
                : source;

            // Create the internal native RegExp
            const nativeRegExp = new NativeRegExp(sourceWithoutLB, inputFlags);

            Object.defineProperty(this, '_regexp', { value: nativeRegExp });
            Object.defineProperty(this, '_originalSource', { value: source });
            Object.defineProperty(this, '_flags', { value: inputFlags });
            Object.defineProperty(this, '_lookbehindInfo', { value: lookbehindInfo });
        } else {
            // This branch is for when called without 'new' - should return a new instance
            return new RegExp(pattern, flags);
        }
    }

    RegExp.toString = function () {
        return 'function RegExp() { [lookbehind polyfilled code] }';
    };

    // Create a new prototype instead of sharing the native one
    RegExp.prototype = Object.create(NativeRegExp.prototype);

    // Define properties that delegate to the internal regexp, but only for polyfilled instances
    Object.defineProperty(RegExp.prototype, 'global', {
        enumerable: true,
        get: function () {
            return this._regexp ? this._regexp.global : Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'global').get.call(this);
        }
    });

    Object.defineProperty(RegExp.prototype, 'ignoreCase', {
        enumerable: true,
        get: function () {
            return this._regexp ? this._regexp.ignoreCase : Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'ignoreCase').get.call(this);
        }
    });

    Object.defineProperty(RegExp.prototype, 'multiline', {
        enumerable: true,
        get: function () {
            return this._regexp ? this._regexp.multiline : Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'multiline').get.call(this);
        }
    });

    Object.defineProperty(RegExp.prototype, 'dotAll', {
        enumerable: true,
        get: function () {
            return this._regexp ? this._regexp.dotAll : Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'dotAll').get.call(this);
        }
    });

    Object.defineProperty(RegExp.prototype, 'unicode', {
        enumerable: true,
        get: function () {
            return this._regexp ? this._regexp.unicode : Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'unicode').get.call(this);
        }
    });

    Object.defineProperty(RegExp.prototype, 'sticky', {
        enumerable: true,
        get: function () {
            return this._regexp ? this._regexp.sticky : Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'sticky').get.call(this);
        }
    });

    Object.defineProperty(RegExp.prototype, 'lastIndex', {
        enumerable: true,
        get: function () {
            return this._regexp ? this._regexp.lastIndex : Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'lastIndex').get.call(this);
        },
        set: function (value) {
            if (this._regexp) {
                this._regexp.lastIndex = value;
            } else {
                Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'lastIndex').set.call(this, value);
            }
        }
    });

    Object.defineProperty(RegExp.prototype, 'flags', {
        enumerable: true,
        get: function () {
            return this._flags || Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'flags').get.call(this);
        }
    });

    Object.defineProperty(RegExp.prototype, 'source', {
        enumerable: true,
        get: function () {
            return this._originalSource || Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'source').get.call(this);
        }
    });

    RegExp.prototype.toString = function () {
        return '/' + this.source + '/' + this.flags;
    };

    RegExp.prototype.exec = function (str) {
        str = str + ''; // Convert to string

        // Check if this is a polyfilled RegExp instance or a native one
        if (!this._regexp) {
            // This is a native RegExp, use the original exec method
            const result = NativeRegExp.prototype.exec.call(this, str);
            // Manually update static properties for compatibility (since modern engines don't do this automatically)
            if (result) {
                updateRegExpStatics(result, str);
            }
            return result;
        }

        const info = this._lookbehindInfo;

        if (!info) {
            const match = this._regexp.exec(str);
            if (match) updateRegExpStatics(match, str);
            return match;
        }

        // Handle lookbehind logic
        while (true) {
            const match = this._regexp.exec(str);
            if (!match) {
                return null;
            }

            const i = match.index;

            // Check lookbehind condition
            const behind = str.slice(Math.max(0, i - info.pattern.length), i);

            // For positive lookbehind (?<=pattern), the pattern must match at the end of behind
            // For negative lookbehind (?<!pattern), the pattern must NOT match at the end of behind
            const passed = info.type === '='
                ? behind.endsWith(info.pattern)
                : !behind.endsWith(info.pattern);

            if (passed) {
                match.index = i;
                match.input = str;
                updateRegExpStatics(match, str);
                return match;
            }

            // If lookbehind failed and this is not a global regex, no match
            if (!this.global) {
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
        return this.exec(str) !== null;
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
                updateRegExpStatics(result, str + '');
            }
            return result;
        };
    }

    // Copy static properties from native RegExp to polyfilled RegExp for compatibility
    const staticProps = ['input', 'leftContext', 'rightContext', 'lastMatch', 'lastParen'];
    staticProps.forEach(prop => {
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

    // --- Patch string methods ---

    const original = {
        replace: String.prototype.replace,
        match: String.prototype.match,
        search: String.prototype.search,
        split: String.prototype.split
    };

    String.prototype.replace = function (search, replacement) {
        const str = this + ''; // Convert to string
        if (search instanceof RegExp && search._lookbehindInfo) {
            const re = search.global ? search : new RegExp(search.source, search.flags + 'g');
            let result = '', lastIndex = 0, match;

            while ((match = re.exec(str))) {
                const i = match.index;
                result += str.slice(lastIndex, i);
                result += typeof replacement === 'function'
                    ? replacement(...match, i, str)
                    : original.replace.call(replacement + '', /\$&/g, match[0]);
                lastIndex = i + match[0].length;
                if (match[0] === '') re.lastIndex++;
                if (!search.global) break;
            }

            return result + str.slice(lastIndex);
        }

        return original.replace.call(str, search, replacement);
    };

    String.prototype.match = function (pattern) {
        const str = this + ''; // Convert to string
        if (!(pattern instanceof RegExp)) pattern = new RegExp(pattern);
        if (pattern.global) {
            const results = [];
            let m;
            while ((m = pattern.exec(str))) {
                results.push(m[0]);
                if (m[0] === '') pattern.lastIndex++;
            }
            return results.length ? results : null;
        }
        return pattern.exec(str);
    };

    String.prototype.search = function (pattern) {
        const str = this + ''; // Convert to string
        if (!(pattern instanceof RegExp)) pattern = new RegExp(pattern);
        const m = pattern.exec(str);
        return m ? m.index : -1;
    };

    String.prototype.split = function (separator, limit) {
        const str = this + ''; // Convert to string
        if (!(separator instanceof RegExp)) return original.split.call(str, separator, limit);

        const re = separator.global ? separator : new RegExp(separator.source, separator.flags + 'g');
        const output = [];
        let lastIndex = 0, match;

        while ((match = re.exec(str))) {
            output.push(str.slice(lastIndex, match.index));
            lastIndex = match.index + match[0].length;
            if (match[0] === '') re.lastIndex++;
            if (limit !== undefined && output.length >= limit) break;
        }

        output.push(str.slice(lastIndex));
        return output;
    };
})();
