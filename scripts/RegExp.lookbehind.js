// ChatGPT
(() => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname === 'x.com') {
        return;
    }

    if (typeof window !== 'undefined' && window.__regExpLookbehindPatched) {
        return;
    }

    const NativeRegExp = RegExp;
    const nativeExec = RegExp.prototype.exec;
    const nativeTest = RegExp.prototype.test;
    const nativeStringReplace = String.prototype.replace;
    const nativeStringMatch = String.prototype.match;

    let disablePatch = false;
    let isInitializing = false;

    function updateRegExpStatics(match, input) {
        if (!match) {
            return;
        }

        // Update RegExp static properties
        RegExp.lastMatch = RegExp.$_ = RegExp['$&'] = match[0] || '';
        RegExp.leftContext = RegExp['$`'] = input.slice(0, match.index) || '';
        RegExp.rightContext = RegExp["$'"] = input.slice(match.index + match[0].length) || '';
        RegExp.lastParen = RegExp['$+'] = '';

        // Clear all numbered capture groups first
        for (let i = 1; i <= 9; i++) {
            RegExp['$' + i] = '';
        }

        // Set capture groups and find last non-empty one
        for (let i = 1; i < match.length && i <= 9; i++) {
            RegExp['$' + i] = match[i] || '';
            if (match[i]) {
                RegExp.lastParen = RegExp['$+'] = match[i];
            }
        }
    }

    function containsLookbehind(pattern) {
        if (typeof pattern !== 'string') return false;
        for (let i = 0; i < pattern.length - 3; i++) {
            if (pattern[i] === '\\') {
                i++; // Skip escaped char
                continue;
            }
            if (
                pattern[i] === '(' &&
                pattern[i + 1] === '?' &&
                pattern[i + 2] === '<' &&
                (pattern[i + 3] === '=' || pattern[i + 3] === '!')
            ) {
                return true;
            }
        }
        return false;
    }

    function extractLookbehind(pattern) {
        let lbMatch;
        try {
            disablePatch = true;
            lbMatch = nativeExec.call(/^(\(\?<([=!])((?:\\.|[^\\()])*)\))/, pattern);
        } finally {
            disablePatch = false;
        }
        if (!lbMatch) return null;

        const rest = pattern.slice(lbMatch[1].length);

        // If the rest starts with an OR (|) or contains OR with more lookbehinds,
        // this is too complex for our simple polyfill
        if (rest.includes('(?<=') || rest.includes('(?<!')) {
            return null; // Fall back to native behavior for complex patterns
        }

        return {
            full: lbMatch[1],
            type: lbMatch[2],    // "=" or "!"
            pattern: lbMatch[3], // the inner lookbehind
            rest: rest,
        };
    }

    function emulateExec(str) {
        if (disablePatch) return nativeExec.call(this, str);

        // Convert to string to match native RegExp behavior
        str = String(str);

        const parsed = this.__lookbehind;
        if (!parsed) {
            const result = nativeExec.call(this, str);
            // Ensure static properties are updated even for non-lookbehind patterns
            if (result) {
                updateRegExpStatics(result, str);
            }
            return result;
        }

        let lbRe, mainRe;
        try {
            disablePatch = true;
            lbRe = new NativeRegExp(parsed.pattern + "$", this.__originalFlags.replace("g", ""));
            // Always remove global flag to prevent state issues
            mainRe = new NativeRegExp(parsed.rest, this.__originalFlags.replace("g", ""));
        } catch (e) {
            disablePatch = false;
            return null;
        } finally {
            disablePatch = false;
        }

        // Add safety limit to prevent infinite loops
        const maxIterations = Math.min(str.length + 100, 5000); // More conservative limit
        let iterationCount = 0;

        for (let pos = 0; pos <= str.length && iterationCount < maxIterations; pos++) {
            iterationCount++;

            // Circuit breaker for very long strings or complex patterns
            if (iterationCount % 1000 === 0 && str.length > 1000) {
                // For very long strings, be more selective about positions to check
                if (pos < str.length - 100) {
                    pos += 10; // Skip ahead for performance
                }
            }

            let mainMatch;
            try {
                disablePatch = true;
                // Reset lastIndex to 0 to ensure clean state
                mainRe.lastIndex = 0;
                mainMatch = mainRe.exec(str.slice(pos));
            } finally {
                disablePatch = false;
            }

            if (!mainMatch || mainMatch.index !== 0) continue;

            const prefix = str.slice(0, pos);

            let lbMatchFound;
            try {
                disablePatch = true;
                lbMatchFound = lbRe.test(prefix);
            } finally {
                disablePatch = false;
            }

            if ((parsed.type === "=" && lbMatchFound) || (parsed.type === "!" && !lbMatchFound)) {
                mainMatch.index = pos;
                mainMatch.input = str;
                updateRegExpStatics(mainMatch, str);
                return mainMatch;
            }
        }

        updateRegExpStatics(null, str);
        return null;
    }

    function emulateTest(str) {
        if (disablePatch) return nativeTest.call(this, str);

        // Convert to string to match native RegExp behavior
        str = String(str);

        const result = emulateExec.call(this, str);
        // emulateExec already updates RegExp static properties, so we just return the boolean
        return result !== null;
    }

    // Patch RegExp constructor
    function PatchedRegExp(pattern, flags) {
        const patternStr = typeof pattern === 'string' ? pattern : (pattern ? pattern.source : "");
        const flagsStr = flags ?? (pattern && pattern.flags) ?? "";

        if (!containsLookbehind(patternStr)) {
            return new NativeRegExp(patternStr, flagsStr);
        }

        const parsed = extractLookbehind(patternStr);
        if (!parsed) {
            return new NativeRegExp(patternStr, flagsStr);
        }

        const fakePattern = parsed.rest;
        const re = new NativeRegExp(fakePattern, flagsStr);

        // Store data safely to avoid recursive access
        re.__lookbehind = parsed;
        re.__originalFlags = flagsStr;

        re.exec = emulateExec;
        re.test = emulateTest;

        return re;
    }

    // Preserve prototype chain
    PatchedRegExp.prototype = NativeRegExp.prototype;
    PatchedRegExp.prototype.constructor = PatchedRegExp;

    // Replace global RegExp
    RegExp = PatchedRegExp;

    // Also patch RegExp.prototype.exec/test for native regexes
    RegExp.prototype.exec = function patchedExec(str) {
        if (disablePatch) return nativeExec.call(this, str);

        // Convert to string to match native RegExp behavior
        str = String(str);

        const patternStr = this.source;
        const flagsStr = this.flags;

        if (!containsLookbehind(patternStr)) {
            const result = nativeExec.call(this, str);
            // Native exec already updates static properties
            return result;
        }

        const parsed = extractLookbehind(patternStr);
        if (!parsed) {
            return nativeExec.call(this, str);
        }

        // Create a temporary wrapper RegExp object
        const fake = new NativeRegExp(parsed.rest, flagsStr);
        fake.__lookbehind = parsed;
        fake.__originalFlags = flagsStr;
        const result = emulateExec.call(fake, str);
        return result;
    };

    RegExp.prototype.test = function patchedTest(str) {
        if (disablePatch) return nativeTest.call(this, str);

        // Convert to string to match native RegExp behavior
        str = String(str);

        const patternStr = this.source;
        const flagsStr = this.flags;

        if (!containsLookbehind(patternStr)) {
            // Use exec instead of test to ensure static properties are updated
            const result = nativeExec.call(this, str);
            // Manually update static properties for non-lookbehind patterns
            if (result) {
                updateRegExpStatics(result, str);
            }
            return result !== null;
        }

        const parsed = extractLookbehind(patternStr);
        if (!parsed) {
            // Use exec instead of test to ensure static properties are updated
            const result = nativeExec.call(this, str);
            // Manually update static properties for non-lookbehind patterns
            if (result) {
                updateRegExpStatics(result, str);
            }
            return result !== null;
        }

        const fake = new NativeRegExp(parsed.rest, flagsStr);
        fake.__lookbehind = parsed;
        fake.__originalFlags = flagsStr;
        // Use emulateExec to get the full match result and update static properties
        const result = emulateExec.call(fake, str);
        return result !== null;
    };

    // Patch String.prototype.replace to handle lookbehind RegExp
    String.prototype.replace = function patchedReplace(searchValue, replaceValue) {
        if (disablePatch || isInitializing) return nativeStringReplace.call(this, searchValue, replaceValue);

        // If searchValue is not a RegExp, use native replace
        if (!(searchValue instanceof RegExp) && !(searchValue instanceof NativeRegExp)) {
            return nativeStringReplace.call(this, searchValue, replaceValue);
        }

        const patternStr = searchValue.source;
        const flagsStr = searchValue.flags;

        // If no lookbehind, use native replace
        if (!containsLookbehind(patternStr)) {
            return nativeStringReplace.call(this, searchValue, replaceValue);
        }

        const parsed = extractLookbehind(patternStr);
        if (!parsed) {
            return nativeStringReplace.call(this, searchValue, replaceValue);
        }

        const str = String(this);
        const isGlobal = flagsStr.includes('g');
        const isFunction = typeof replaceValue === 'function';

        // TEMPORARY FIX: Global lookbehind processing is prone to infinite loops
        // Fall back to native behavior for global patterns
        if (isGlobal) {
            console.warn('Global lookbehind replace falls back to native behavior');
            return nativeStringReplace.call(this, searchValue, replaceValue);
        }

        let result = str;
        let lastIndex = 0;
        let offset = 0;

        // Create a patched RegExp for matching
        const patchedRegExp = new NativeRegExp(parsed.rest, flagsStr.replace('g', '')); // Remove global flag to control iteration manually
        patchedRegExp.__lookbehind = parsed;
        patchedRegExp.__originalFlags = flagsStr.replace('g', '');

        // Add safety limits
        const maxIterations = Math.max(str.length + 100, 1000);
        let iterationCount = 0;

        while (lastIndex < str.length && iterationCount < maxIterations) {
            iterationCount++;

            let match;
            try {
                isInitializing = true;
                match = emulateExec.call(patchedRegExp, str.slice(lastIndex));
            } finally {
                isInitializing = false;
            }

            if (!match) break;

            const actualIndex = lastIndex + match.index;
            const matchStr = match[0];

            // Prevent infinite loop on zero-length matches at same position
            if (matchStr.length === 0 && lastIndex === actualIndex) {
                lastIndex = actualIndex + 1;
                continue;
            }

            let replacement;
            if (isFunction) {
                // Call the function with match, capture groups, index, and full string
                const args = [matchStr, ...match.slice(1), actualIndex, str];
                replacement = String(replaceValue.apply(undefined, args));
            } else {
                // Handle replacement string with special patterns like $1, $&, etc.
                replacement = nativeStringReplace.call(String(replaceValue), /\$(\$|&|`|'|\d+)/g, (_, p1) => {
                    if (p1 === '$') return '$';
                    if (p1 === '&') return matchStr;
                    if (p1 === '`') return str.slice(0, actualIndex);
                    if (p1 === "'") return str.slice(actualIndex + matchStr.length);
                    const num = parseInt(p1, 10);
                    return match[num] || '';
                });
            }

            // Replace the match in the result string
            result = result.slice(0, actualIndex + offset) +
                     replacement +
                     result.slice(actualIndex + offset + matchStr.length);

            offset += replacement.length - matchStr.length;

            // Calculate next position for search
            const nextPos = actualIndex + matchStr.length;

            // Prevent infinite loop on zero-length matches
            lastIndex = matchStr.length === 0 ? Math.max(nextPos, actualIndex + 1) : nextPos;

            // If not global, only replace first match
            if (!isGlobal) break;
        }

        return result;
    };

    // Patch String.prototype.match to handle lookbehind RegExp
    String.prototype.match = function patchedMatch(regexp) {
        if (disablePatch || isInitializing) return nativeStringMatch.call(this, regexp);

        // If regexp is not a RegExp, use native match
        if (!(regexp instanceof RegExp) && !(regexp instanceof NativeRegExp)) {
            return nativeStringMatch.call(this, regexp);
        }

        const patternStr = regexp.source;
        const flagsStr = regexp.flags;

        // If no lookbehind, use native match
        if (!containsLookbehind(patternStr)) {
            return nativeStringMatch.call(this, regexp);
        }

        const parsed = extractLookbehind(patternStr);
        if (!parsed) {
            return nativeStringMatch.call(this, regexp);
        }

        const str = String(this);
        const isGlobal = flagsStr.includes('g');

        // Create a patched RegExp for matching
        const patchedRegExp = new NativeRegExp(parsed.rest, flagsStr.replace('g', '')); // Remove global flag to control iteration manually
        patchedRegExp.__lookbehind = parsed;
        patchedRegExp.__originalFlags = flagsStr.replace('g', '');

        if (isGlobal) {
            // TEMPORARY FIX: Global lookbehind processing is prone to infinite loops
            // Fall back to native behavior for global patterns
            console.warn('Global lookbehind patterns fall back to native behavior');
            return nativeStringMatch.call(this, regexp);
        } else {
            // For non-global matches, return the first match with all capture groups
            let match;
            try {
                isInitializing = true;
                match = emulateExec.call(patchedRegExp, str);
            } finally {
                isInitializing = false;
            }
            return match;
        }
    };

    // Mark as patched
    if (typeof window !== 'undefined') {
        window.__regExpLookbehindPatched = true;
    }
})();
