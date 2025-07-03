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

    // Initialize regex replacements registry
    const regexReplacements = globalThis.__lookbehind_regex_replacements || [
        {
            // Complex user-agent detection pattern with negative lookbehind
            original: " Daum/| DeuSu/| splash | um-LN/|(^|\\s)Site|^&lt;|^12345|^<|^\\[|^Ace Explorer|^acoon|^ActiveBookmark|^ActiveRefresh|^ActiveWorlds|^Ad Muncher|^AHC/|^Amazon CloudFront|^Apache|^ApplicationHealthService|^asafaweb\\.com|^asynchttp|^axios/|^Azureus|^biglotron|^binlar|^Blackboard Safeassign|^BlockNote.Net|^Browsershots|^btwebclient/|^CakePHP|^Camo Asset Proxy|^ClamAV[\\s/]|^Client|^cobweb/|^coccoc|^Custom$|^DAP |^DavClnt|^Dispatch/\\d|^Disqus/|^DuckDuckGo|^eCatch/|^Embedly|^Evernote Clip Resolver|^facebook|^Faraday|^fasthttp$|^FDM \\d|^FDM/\\d|^FlashGet|^Friendica|^GetRight/|^GigablastOpenSource|^Go \\d.\\d package http|^Go-http-client|^googal|^Goose|^GreenBrowser|^GuzzleHttp|^Hatena|^Hexometer|^Hobbit|^Hotzonu|^http|^HWCDN/|^ICE Browser|^ichiro|^infoX-WISG|^INGRID/\\d|^Integrity/|^java|^Jeode/|^JetBrains|^Jetty/|^Jigsaw|^libtorrent|^libwww|^linkdex|^lua-resty-http|^lwp-|^LWP::Simple|^MailChimp\\.com$|^MetaURI|^Microsoft BITS|^Microsoft Data|^Microsoft Office Existence|^Microsoft Office Protocol Discovery|^Microsoft Windows Network Diagnostics|^Microsoft-CryptoAPI|^Microsoft-WebDAV-MiniRedir|^Monit|^MovableType|^Mozilla/4\\.0 \\(compatible;\\)$|^Mozilla/5\\.0 \\(compatible(; Optimizer)?\\)|^Mozilla/5\\.0 \\(en-us\\) AppleWebKit/525\\.13 \\(KHTML, like Gecko\\) Version/3\\.1 Safari/525\\.13|^Mozilla/5\\.0 \\(Macintosh; Intel Mac OS X 10_15\\) AppleWebKit/605\\.1\\.15 \\(KHTML, like Gecko\\) Mobile/15E148 DuckDuckGo/7|^Mozilla/5\\.0 \\(Windows; rv:\\d{2}\\.0\\) Gecko/20100101 Firefox/\\d{2}\\.0$|^Mozilla/\\d\\.\\d \\(compatible\\)$|^muCommander|^My browser$|^NaverMailApp|^NetSurf|^NING|^node-superagent|^NokiaC3-00/5\\.0|^NoteTextView|^Nuzzel|^Offline Explorer|^okhttp|^OSSProxy|^panscient|^Pcore-HTTP|^photon/|^PHP|^Postman|^postrank|^python|^RamblerMail|^raynette_httprequest|^Ruby$|^Scrapy|^selenium/|^set:|^Shareaza|^ShortLinkTranslate|^SignalR|^Sistrix|^snap$|^Snapchat|^Space Bison|^Spring |^Sprinklr|^SVN|^swcd |^T-Online Browser|^Taringa|^Test Certificate Info|^The Knowledge AI|^Thinklab|^thumb|^Traackr.com|^Transmission|^tumblr/|^Ubuntu APT-HTTP|^UCmore|^Upflow/|^USER_AGENT|^utorrent/|^vBulletin|^venus/fedoraplanet|^VSE\\/|^W3C|^WebCopier|^wget|^whatsapp|^WhatWeb|^WWW-Mechanize|^Xenu Link Sleuth|^Xymon|^Yahoo|^Yandex|^Zabbix|^ZDM/\\d|^Zend_Http_Client|^ZmEu$|adbeat\\.com|amiga|analyz|AppInsights|archive|Ask Jeeves/Teoma|BingPreview|Bluecoat DRTR|BorderManager|BrowseX|burpcollaborator|capture|Catchpoint|check|Chrome-Lighthouse|chromeframe|CloudFlare|collect|Commons-HttpClient|crawl|daemon|DareBoost|Datanyze|dataprovider|DejaClick|DMBrowser|download|Email|feed|fetch|finder|FirePHP|FreeSafeIP|fuck|ghost|GomezAgent|google|HeadlessChrome/|https?:|httrack|HubSpot Marketing Grader|Hydra|ibisBrowser|images|index|ips-agent|java/|JavaFX|JavaOs|Jorgee|library|Lucidworks-Anda|mail\\.ru/|NetcraftSurveyAgent/|news|nutch|OffByOne|org\\.eclipse\\.ui\\.ide\\.workbench|outbrain|parse|perl|phantom|Pingdom|Powermarks|PTST[/ ]\\d|reader|Rigor|rss|scan|scrape|server|SkypeUriPreview|Sogou|SpeedMode; Proxy;|spider|StatusCake|stumbleupon\\.com|SuperCleaner|synapse|synthetic|toolbar|tracemyfile|TrendsmapResolver|Twingly Recon|url|validator|WAPCHOI|Wappalyzer|Webglance|webkit2png|WinHTTP|WordPress|zgrab|(?<! cu)bot|(?<! (ya|yandex))search",
            // Simplified version without lookbehind - removes the negative lookbehind assertions
            replacement: " Daum/| DeuSu/| splash | um-LN/|(^|\\s)Site|^&lt;|^12345|^<|^\\[|^Ace Explorer|^acoon|^ActiveBookmark|^ActiveRefresh|^ActiveWorlds|^Ad Muncher|^AHC/|^Amazon CloudFront|^Apache|^ApplicationHealthService|^asafaweb\\.com|^asynchttp|^axios/|^Azureus|^biglotron|^binlar|^Blackboard Safeassign|^BlockNote.Net|^Browsershots|^btwebclient/|^CakePHP|^Camo Asset Proxy|^ClamAV[\\s/]|^Client|^cobweb/|^coccoc|^Custom$|^DAP |^DavClnt|^Dispatch/\\d|^Disqus/|^DuckDuckGo|^eCatch/|^Embedly|^Evernote Clip Resolver|^facebook|^Faraday|^fasthttp$|^FDM \\d|^FDM/\\d|^FlashGet|^Friendica|^GetRight/|^GigablastOpenSource|^Go \\d.\\d package http|^Go-http-client|^googal|^Goose|^GreenBrowser|^GuzzleHttp|^Hatena|^Hexometer|^Hobbit|^Hotzonu|^http|^HWCDN/|^ICE Browser|^ichiro|^infoX-WISG|^INGRID/\\d|^Integrity/|^java|^Jeode/|^JetBrains|^Jetty/|^Jigsaw|^libtorrent|^libwww|^linkdex|^lua-resty-http|^lwp-|^LWP::Simple|^MailChimp\\.com$|^MetaURI|^Microsoft BITS|^Microsoft Data|^Microsoft Office Existence|^Microsoft Office Protocol Discovery|^Microsoft Windows Network Diagnostics|^Microsoft-CryptoAPI|^Microsoft-WebDAV-MiniRedir|^Monit|^MovableType|^Mozilla/4\\.0 \\(compatible;\\)$|^Mozilla/5\\.0 \\(compatible(; Optimizer)?\\)|^Mozilla/5\\.0 \\(en-us\\) AppleWebKit/525\\.13 \\(KHTML, like Gecko\\) Version/3\\.1 Safari/525\\.13|^Mozilla/5\\.0 \\(Macintosh; Intel Mac OS X 10_15\\) AppleWebKit/605\\.1\\.15 \\(KHTML, like Gecko\\) Mobile/15E148 DuckDuckGo/7|^Mozilla/5\\.0 \\(Windows; rv:\\d{2}\\.0\\) Gecko/20100101 Firefox/\\d{2}\\.0$|^Mozilla/\\d\\.\\d \\(compatible\\)$|^muCommander|^My browser$|^NaverMailApp|^NetSurf|^NING|^node-superagent|^NokiaC3-00/5\\.0|^NoteTextView|^Nuzzel|^Offline Explorer|^okhttp|^OSSProxy|^panscient|^Pcore-HTTP|^photon/|^PHP|^Postman|^postrank|^python|^RamblerMail|^raynette_httprequest|^Ruby$|^Scrapy|^selenium/|^set:|^Shareaza|^ShortLinkTranslate|^SignalR|^Sistrix|^snap$|^Snapchat|^Space Bison|^Spring |^Sprinklr|^SVN|^swcd |^T-Online Browser|^Taringa|^Test Certificate Info|^The Knowledge AI|^Thinklab|^thumb|^Traackr.com|^Transmission|^tumblr/|^Ubuntu APT-HTTP|^UCmore|^Upflow/|^USER_AGENT|^utorrent/|^vBulletin|^venus/fedoraplanet|^VSE\\/|^W3C|^WebCopier|^wget|^whatsapp|^WhatWeb|^WWW-Mechanize|^Xenu Link Sleuth|^Xymon|^Yahoo|^Yandex|^Zabbix|^ZDM/\\d|^Zend_Http_Client|^ZmEu$|adbeat\\.com|amiga|analyz|AppInsights|archive|Ask Jeeves/Teoma|BingPreview|Bluecoat DRTR|BorderManager|BrowseX|burpcollaborator|capture|Catchpoint|check|Chrome-Lighthouse|chromeframe|CloudFlare|collect|Commons-HttpClient|crawl|daemon|DareBoost|Datanyze|dataprovider|DejaClick|DMBrowser|download|Email|feed|fetch|finder|FirePHP|FreeSafeIP|fuck|ghost|GomezAgent|google|HeadlessChrome/|https?:|httrack|HubSpot Marketing Grader|Hydra|ibisBrowser|images|index|ips-agent|java/|JavaFX|JavaOs|Jorgee|library|Lucidworks-Anda|mail\\.ru/|NetcraftSurveyAgent/|news|nutch|OffByOne|org\\.eclipse\\.ui\\.ide\\.workbench|outbrain|parse|perl|phantom|Pingdom|Powermarks|PTST[/ ]\\d|reader|Rigor|rss|scan|scrape|server|SkypeUriPreview|Sogou|SpeedMode; Proxy;|spider|StatusCake|stumbleupon\\.com|SuperCleaner|synapse|synthetic|toolbar|tracemyfile|TrendsmapResolver|Twingly Recon|url|validator|WAPCHOI|Wappalyzer|Webglance|webkit2png|WinHTTP|WordPress|zgrab|bot|search",
            flags: 'i'
        },
        {
            // Email validation pattern with negative lookbehind to prevent local part from ending with a dot
            original: "(?<!\\\\.)@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}",
            // Alternative without lookbehind - use word boundary and character class exclusion
            replacement: "(?:[^.]|^)@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}",
            flags: 'g'
        },
        {
            // Password validation: at least 8 chars, not starting with a number (negative lookbehind)
            original: "(?<!^\\\\d).{8,}",
            // Alternative without lookbehind - explicitly check first character is not a digit
            replacement: "(?![0-9]).{8,}",
            flags: ''
        },
        {
            // URL validation - ensuring protocol doesn't start with file:// (negative lookbehind)
            original: "(?<!file://)https?://[\\\\w.-]+",
            // Alternative without lookbehind - use negative lookahead instead
            replacement: "(?!file://)https?://[\\\\w.-]+",
            flags: 'g'
        },
        {
            // Word boundary with negative lookbehind for @ symbol (useful for mentions)
            original: "(?<!@)\\\\b\\\\w+\\\\b",
            // Alternative without lookbehind - check for non-@ character before word
            replacement: "(?:^|[^@])\\\\b\\\\w+\\\\b",
            flags: 'g'
        },
        {
            // CSS class selector that's not preceded by a period (negative lookbehind)
            original: "(?<!\\\\.)([a-zA-Z][\\\\w-]*)",
            // Alternative without lookbehind - capture classes not starting with period
            replacement: "(?:^|[^.]|\\\\s)([a-zA-Z][\\\\w-]*)",
            flags: 'g'
        },
        {
            // Decimal number not preceded by another digit (negative lookbehind)
            original: "(?<!\\\\d)\\\\d+\\\\.\\\\d+",
            // Alternative without lookbehind - use word boundary or start of string
            replacement: "(?:^|[^\\\\d])\\\\d+\\\\.\\\\d+",
            flags: 'g'
        }
    ];

    // Assign to global registry so it's accessible
    globalThis.__lookbehind_regex_replacements = regexReplacements;

    function normalizeRegexSource(source) {
        // Normalize escape sequences to ensure consistent matching
        // This handles differences in how escape sequences are represented
        // when patterns are created via RegExp constructor vs. literals
        return source
            .replace(/\\\\/g, '\\')  // Normalize double backslashes
            .replace(/\\s/g, '\\s')  // Ensure whitespace escapes are consistent
            .replace(/\\d/g, '\\d')  // Ensure digit escapes are consistent
            .replace(/\\./g, '\\.')  // Ensure dot escapes are consistent
            .replace(/\\\^/g, '\\^') // Ensure caret escapes are consistent
            .replace(/\\\$/g, '\\$') // Ensure dollar escapes are consistent
            .replace(/\\\(/g, '\\(') // Ensure parenthesis escapes are consistent
            .replace(/\\\)/g, '\\)')
            .replace(/\\\[/g, '\\[') // Ensure bracket escapes are consistent
            .replace(/\\\]/g, '\\]')
            .replace(/\\\{/g, '\\{') // Ensure brace escapes are consistent
            .replace(/\\\}/g, '\\}')
            .replace(/\\\+/g, '\\+') // Ensure plus escapes are consistent
            .replace(/\\\*/g, '\\*') // Ensure asterisk escapes are consistent
            .replace(/\\\?/g, '\\?') // Ensure question mark escapes are consistent
            .replace(/\\\|/g, '\\|'); // Ensure pipe escapes are consistent
    }

    function checkForRegexReplacement(source, flags) {
        // Check if this regex pattern should be replaced with an alternative
        const normalizedSource = normalizeRegexSource(source);

        for (const replacement of regexReplacements) {
            const normalizedOriginal = normalizeRegexSource(replacement.original);

            // Check if the normalized source matches the normalized original pattern
            if (normalizedOriginal === normalizedSource) {
                // If flags are specified in the replacement, they must match
                if (replacement.flags !== undefined && replacement.flags !== flags) {
                    continue;
                }
                return replacement.replacement;
            }
        }
        return null;
    }

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

    function safeSetProperty(obj, key, value) {
        try {
            obj[key] = value;
        } catch (e) {
            // Ignore readonly property errors
        }
    }

    function toString(value) {
        return value + ''; // Convert to string without calling String()
    }

    function copyStaticProperties() {
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
    }

    function createPropertyGetter(propName, defaultValue = undefined) {
        return function () {
            if (this._regexp) {
                return this._regexp[propName];
            }
            try {
                return Object.getOwnPropertyDescriptor(NativeRegExp.prototype, propName).get.call(this);
            } catch (e) {
                // Handle cases where this is not a RegExp instance (e.g., RegExp.prototype)
                return defaultValue;
            }
        };
    }

    function createPropertySetter(propName) {
        return function (value) {
            if (this._regexp) {
                this._regexp[propName] = value;
            } else {
                try {
                    Object.getOwnPropertyDescriptor(NativeRegExp.prototype, propName).set.call(this, value);
                } catch (e) {
                    // Handle cases where this is not a RegExp instance (e.g., RegExp.prototype)
                    // Silently ignore
                }
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
            lastParen: match[match.length - 1] || ''
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
                safeSetProperty(target, `$${i}`, match[i] || '');
            }
        }
    }

    function createPolyfillRegExpInstance(regexpObj, nativeRegExp, originalSource, flags, lookbehindInfo) {
        // Helper function to set up the common properties for polyfilled RegExp instances
        Object.defineProperty(regexpObj, '_regexp', { value: nativeRegExp });
        Object.defineProperty(regexpObj, '_originalSource', { value: originalSource });
        Object.defineProperty(regexpObj, '_flags', { value: flags });
        Object.defineProperty(regexpObj, '_lookbehindInfo', { value: lookbehindInfo });

        // Define lastIndex as a data property for is-regex compatibility
        Object.defineProperty(regexpObj, 'lastIndex', {
            value: 0,
            writable: true,
            enumerable: false,
            configurable: false
        });
    }

    function RegExp(pattern, flags) {
        if (this instanceof RegExp) {
            let source, inputFlags;

            if (pattern && typeof pattern === 'object' && pattern.constructor === NativeRegExp) {
                source = pattern.source;
                inputFlags = flags !== undefined ? flags : pattern.flags;
            } else {
                source = toString(pattern);
                inputFlags = toString(flags || '');
            }

            // Check for regex replacement first
            const replacementSource = checkForRegexReplacement(source, inputFlags);
            if (replacementSource) {
                // Use the replacement pattern instead
                const nativeRegExp = new NativeRegExp(replacementSource, inputFlags);
                createPolyfillRegExpInstance(this, nativeRegExp, source, inputFlags, null);
                return;
            }

            const lookbehindInfo = extractLookbehind(source);

            // Handle complex lookbehind by falling back to native RegExp
            if (lookbehindInfo && lookbehindInfo.isComplex) {
                try {
                    // Try to create with native RegExp (works if engine supports lookbehind)
                    const nativeRegExp = new NativeRegExp(source, inputFlags);
                    createPolyfillRegExpInstance(this, nativeRegExp, source, inputFlags, null);
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
                    createPolyfillRegExpInstance(this, nativeRegExp, source, inputFlags, null);
                    return;
                }
            }

            const sourceWithoutLB = lookbehindInfo && !lookbehindInfo.isComplex
                ? source.slice(0, lookbehindInfo.index) + source.slice(lookbehindInfo.index + lookbehindInfo.raw.length)
                : source;

            // Create the internal native RegExp
            const nativeRegExp = new NativeRegExp(sourceWithoutLB, inputFlags);

            createPolyfillRegExpInstance(this, nativeRegExp, source, inputFlags, lookbehindInfo);
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
    const regexpProperties = [
        { name: 'global', defaultValue: undefined },
        { name: 'ignoreCase', defaultValue: undefined },
        { name: 'multiline', defaultValue: undefined },
        { name: 'dotAll', defaultValue: undefined },
        { name: 'unicode', defaultValue: undefined },
        { name: 'sticky', defaultValue: undefined }
    ];

    regexpProperties.forEach(({ name, defaultValue }) => {
        Object.defineProperty(RegExp.prototype, name, {
            enumerable: true,
            get: createPropertyGetter(name, defaultValue)
        });
    });

    // Special handling for flags and source (custom logic)
    Object.defineProperty(RegExp.prototype, 'flags', {
        enumerable: true,
        get: function () {
            if (this._flags) {
                return this._flags;
            }
            try {
                return Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'flags').get.call(this);
            } catch (e) {
                // Handle cases where this is not a RegExp instance (e.g., RegExp.prototype)
                return '';
            }
        }
    });

    Object.defineProperty(RegExp.prototype, 'source', {
        enumerable: true,
        get: function () {
            if (this._originalSource) {
                return this._originalSource;
            }
            try {
                return Object.getOwnPropertyDescriptor(NativeRegExp.prototype, 'source').get.call(this);
            } catch (e) {
                // Handle cases where this is not a RegExp instance (e.g., RegExp.prototype)
                return '';
            }
        }
    });

    RegExp.prototype.toString = function () {
        return '/' + this.source + '/' + this.flags;
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
            if (match) updateRegExpStatics(match, str);
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
            const passed = info.type === '='
                ? behind.endsWith(info.pattern)
                : !behind.endsWith(info.pattern);

            if (passed) {
                match.index = i;
                match.input = str;
                // Sync back the lastIndex
                this.lastIndex = this._regexp.lastIndex;
                updateRegExpStatics(match, str);
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
        split: String.prototype.split
    };

    String.prototype.replace = function (search, replacement) {
        const str = toString(this);
        if (search instanceof RegExp && search._lookbehindInfo) {
            const re = search.global ? search : new RegExp(search.source, search.flags + 'g');
            let result = '', lastIndex = 0, match;

            while ((match = re.exec(str))) {
                const i = match.index; result += str.slice(lastIndex, i);
                result += typeof replacement === 'function'
                    ? replacement(...match, i, str)
                    : original.replace.call(toString(replacement), /\$&/g, match[0]);
                lastIndex = i + match[0].length;
                if (match[0] === '') re.lastIndex++;
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
                if (m[0] === '') pattern.lastIndex++;
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
