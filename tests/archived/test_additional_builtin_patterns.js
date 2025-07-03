#!/usr/bin/env node

/**
 * Test additional built-in regex patterns for common use cases
 */

// Load the polyfill
require('../scripts/RegExp.lookbehind.js');

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        return true;
    } catch (error) {
        console.log(`✗ ${name}: ${error.message}`);
        return false;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

console.log('Testing additional built-in regex pattern replacements...\n');

let passed = 0;
let total = 0;

// Test 1: Email validation pattern replacement
total++;
passed += test('Email validation pattern is replaced', () => {
    // This pattern would use negative lookbehind in the original
    const emailPattern = new RegExp('(?<!\\\\.)@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}', 'g');
    
    // Check that the source was replaced
    const expectedReplacement = '(?:[^.]|^)@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}';
    assert(emailPattern.source === expectedReplacement, 
           `Expected source to be replaced. Got: ${emailPattern.source}, Expected: ${expectedReplacement}`);
    
    // Test that it works for valid emails
    const testText = 'Contact us at support@example.com or admin@test.org';
    const matches = testText.match(emailPattern);
    assert(matches && matches.length === 2, 'Should find 2 email matches');
});

// Test 2: Password validation pattern replacement
total++;
passed += test('Password validation pattern is replaced', () => {
    // This pattern would use negative lookbehind in the original
    const passwordPattern = new RegExp('(?<!^\\d).{8,}');
    
    // Check that the source was replaced with lookahead
    const expectedReplacement = '(?![0-9]).{8,}';
    assert(passwordPattern.source === expectedReplacement,
           `Expected source to be replaced: ${passwordPattern.source}`);
    
    // Test that it works correctly
    assert(passwordPattern.test('password123'), 'Should match password starting with letter');
    assert(passwordPattern.test('MySecurePass'), 'Should match password with mixed case');
    assert(!passwordPattern.test('123password'), 'Should not match password starting with number');
    assert(!passwordPattern.test('short'), 'Should not match short password');
});

// Test 3: Verify original user-agent pattern still works
total++;
passed += test('Original user-agent pattern replacement still works', () => {
    // Test that the existing user-agent pattern is also properly replaced
    const originalPattern = " Daum/| DeuSu/| splash | um-LN/|(^|\\s)Site|^&lt;|^12345|^<|^\\[|^Ace Explorer|^acoon|^ActiveBookmark|^ActiveRefresh|^ActiveWorlds|^Ad Muncher|^AHC/|^Amazon CloudFront|^Apache|^ApplicationHealthService|^asafaweb\\.com|^asynchttp|^axios/|^Azureus|^biglotron|^binlar|^Blackboard Safeassign|^BlockNote.Net|^Browsershots|^btwebclient/|^CakePHP|^Camo Asset Proxy|^ClamAV[\\s/]|^Client|^cobweb/|^coccoc|^Custom$|^DAP |^DavClnt|^Dispatch/\\d|^Disqus/|^DuckDuckGo|^eCatch/|^Embedly|^Evernote Clip Resolver|^facebook|^Faraday|^fasthttp$|^FDM \\d|^FDM/\\d|^FlashGet|^Friendica|^GetRight/|^GigablastOpenSource|^Go \\d.\\d package http|^Go-http-client|^googal|^Goose|^GreenBrowser|^GuzzleHttp|^Hatena|^Hexometer|^Hobbit|^Hotzonu|^http|^HWCDN/|^ICE Browser|^ichiro|^infoX-WISG|^INGRID/\\d|^Integrity/|^java|^Jeode/|^JetBrains|^Jetty/|^Jigsaw|^libtorrent|^libwww|^linkdex|^lua-resty-http|^lwp-|^LWP::Simple|^MailChimp\\.com$|^MetaURI|^Microsoft BITS|^Microsoft Data|^Microsoft Office Existence|^Microsoft Office Protocol Discovery|^Microsoft Windows Network Diagnostics|^Microsoft-CryptoAPI|^Microsoft-WebDAV-MiniRedir|^Monit|^MovableType|^Mozilla/4\\.0 \\(compatible;\\)$|^Mozilla/5\\.0 \\(compatible(; Optimizer)?\\)|^Mozilla/5\\.0 \\(en-us\\) AppleWebKit/525\\.13 \\(KHTML, like Gecko\\) Version/3\\.1 Safari/525\\.13|^Mozilla/5\\.0 \\(Macintosh; Intel Mac OS X 10_15\\) AppleWebKit/605\\.1\\.15 \\(KHTML, like Gecko\\) Mobile/15E148 DuckDuckGo/7|^Mozilla/5\\.0 \\(Windows; rv:\\d{2}\\.0\\) Gecko/20100101 Firefox/\\d{2}\\.0$|^Mozilla/\\d\\.\\d \\(compatible\\)$|^muCommander|^My browser$|^NaverMailApp|^NetSurf|^NING|^node-superagent|^NokiaC3-00/5\\.0|^NoteTextView|^Nuzzel|^Offline Explorer|^okhttp|^OSSProxy|^panscient|^Pcore-HTTP|^photon/|^PHP|^Postman|^postrank|^python|^RamblerMail|^raynette_httprequest|^Ruby$|^Scrapy|^selenium/|^set:|^Shareaza|^ShortLinkTranslate|^SignalR|^Sistrix|^snap$|^Snapchat|^Space Bison|^Spring |^Sprinklr|^SVN|^swcd |^T-Online Browser|^Taringa|^Test Certificate Info|^The Knowledge AI|^Thinklab|^thumb|^Traackr.com|^Transmission|^tumblr/|^Ubuntu APT-HTTP|^UCmore|^Upflow/|^USER_AGENT|^utorrent/|^vBulletin|^venus/fedoraplanet|^VSE\\/|^W3C|^WebCopier|^wget|^whatsapp|^WhatWeb|^WWW-Mechanize|^Xenu Link Sleuth|^Xymon|^Yahoo|^Yandex|^Zabbix|^ZDM/\\d|^Zend_Http_Client|^ZmEu$|adbeat\\.com|amiga|analyz|AppInsights|archive|Ask Jeeves/Teoma|BingPreview|Bluecoat DRTR|BorderManager|BrowseX|burpcollaborator|capture|Catchpoint|check|Chrome-Lighthouse|chromeframe|CloudFlare|collect|Commons-HttpClient|crawl|daemon|DareBoost|Datanyze|dataprovider|DejaClick|DMBrowser|download|Email|feed|fetch|finder|FirePHP|FreeSafeIP|fuck|ghost|GomezAgent|google|HeadlessChrome/|https?:|httrack|HubSpot Marketing Grader|Hydra|ibisBrowser|images|index|ips-agent|java/|JavaFX|JavaOs|Jorgee|library|Lucidworks-Anda|mail\\.ru/|NetcraftSurveyAgent/|news|nutch|OffByOne|org\\.eclipse\\.ui\\.ide\\.workbench|outbrain|parse|perl|phantom|Pingdom|Powermarks|PTST[/ ]\\d|reader|Rigor|rss|scan|scrape|server|SkypeUriPreview|Sogou|SpeedMode; Proxy;|spider|StatusCake|stumbleupon\\.com|SuperCleaner|synapse|synthetic|toolbar|tracemyfile|TrendsmapResolver|Twingly Recon|url|validator|WAPCHOI|Wappalyzer|Webglance|webkit2png|WinHTTP|WordPress|zgrab|(?<! cu)bot|(?<! (ya|yandex))search";
    
    const userAgentRegex = new RegExp(originalPattern, 'i');
    
    // Should be replaced with version without lookbehind
    const expectedReplacement = " Daum/| DeuSu/| splash | um-LN/|(^|\\s)Site|^&lt;|^12345|^<|^\\[|^Ace Explorer|^acoon|^ActiveBookmark|^ActiveRefresh|^ActiveWorlds|^Ad Muncher|^AHC/|^Amazon CloudFront|^Apache|^ApplicationHealthService|^asafaweb\\.com|^asynchttp|^axios/|^Azureus|^biglotron|^binlar|^Blackboard Safeassign|^BlockNote.Net|^Browsershots|^btwebclient/|^CakePHP|^Camo Asset Proxy|^ClamAV[\\s/]|^Client|^cobweb/|^coccoc|^Custom$|^DAP |^DavClnt|^Dispatch/\\d|^Disqus/|^DuckDuckGo|^eCatch/|^Embedly|^Evernote Clip Resolver|^facebook|^Faraday|^fasthttp$|^FDM \\d|^FDM/\\d|^FlashGet|^Friendica|^GetRight/|^GigablastOpenSource|^Go \\d.\\d package http|^Go-http-client|^googal|^Goose|^GreenBrowser|^GuzzleHttp|^Hatena|^Hexometer|^Hobbit|^Hotzonu|^http|^HWCDN/|^ICE Browser|^ichiro|^infoX-WISG|^INGRID/\\d|^Integrity/|^java|^Jeode/|^JetBrains|^Jetty/|^Jigsaw|^libtorrent|^libwww|^linkdex|^lua-resty-http|^lwp-|^LWP::Simple|^MailChimp\\.com$|^MetaURI|^Microsoft BITS|^Microsoft Data|^Microsoft Office Existence|^Microsoft Office Protocol Discovery|^Microsoft Windows Network Diagnostics|^Microsoft-CryptoAPI|^Microsoft-WebDAV-MiniRedir|^Monit|^MovableType|^Mozilla/4\\.0 \\(compatible;\\)$|^Mozilla/5\\.0 \\(compatible(; Optimizer)?\\)|^Mozilla/5\\.0 \\(en-us\\) AppleWebKit/525\\.13 \\(KHTML, like Gecko\\) Version/3\\.1 Safari/525\\.13|^Mozilla/5\\.0 \\(Macintosh; Intel Mac OS X 10_15\\) AppleWebKit/605\\.1\\.15 \\(KHTML, like Gecko\\) Mobile/15E148 DuckDuckGo/7|^Mozilla/5\\.0 \\(Windows; rv:\\d{2}\\.0\\) Gecko/20100101 Firefox/\\d{2}\\.0$|^Mozilla/\\d\\.\\d \\(compatible\\)$|^muCommander|^My browser$|^NaverMailApp|^NetSurf|^NING|^node-superagent|^NokiaC3-00/5\\.0|^NoteTextView|^Nuzzel|^Offline Explorer|^okhttp|^OSSProxy|^panscient|^Pcore-HTTP|^photon/|^PHP|^Postman|^postrank|^python|^RamblerMail|^raynette_httprequest|^Ruby$|^Scrapy|^selenium/|^set:|^Shareaza|^ShortLinkTranslate|^SignalR|^Sistrix|^snap$|^Snapchat|^Space Bison|^Spring |^Sprinklr|^SVN|^swcd |^T-Online Browser|^Taringa|^Test Certificate Info|^The Knowledge AI|^Thinklab|^thumb|^Traackr.com|^Transmission|^tumblr/|^Ubuntu APT-HTTP|^UCmore|^Upflow/|^USER_AGENT|^utorrent/|^vBulletin|^venus/fedoraplanet|^VSE\\/|^W3C|^WebCopier|^wget|^whatsapp|^WhatWeb|^WWW-Mechanize|^Xenu Link Sleuth|^Xymon|^Yahoo|^Yandex|^Zabbix|^ZDM/\\d|^Zend_Http_Client|^ZmEu$|adbeat\\.com|amiga|analyz|AppInsights|archive|Ask Jeeves/Teoma|BingPreview|Bluecoat DRTR|BorderManager|BrowseX|burpcollaborator|capture|Catchpoint|check|Chrome-Lighthouse|chromeframe|CloudFlare|collect|Commons-HttpClient|crawl|daemon|DareBoost|Datanyze|dataprovider|DejaClick|DMBrowser|download|Email|feed|fetch|finder|FirePHP|FreeSafeIP|fuck|ghost|GomezAgent|google|HeadlessChrome/|https?:|httrack|HubSpot Marketing Grader|Hydra|ibisBrowser|images|index|ips-agent|java/|JavaFX|JavaOs|Jorgee|library|Lucidworks-Anda|mail\\.ru/|NetcraftSurveyAgent/|news|nutch|OffByOne|org\\.eclipse\\.ui\\.ide\\.workbench|outbrain|parse|perl|phantom|Pingdom|Powermarks|PTST[/ ]\\d|reader|Rigor|rss|scan|scrape|server|SkypeUriPreview|Sogou|SpeedMode; Proxy;|spider|StatusCake|stumbleupon\\.com|SuperCleaner|synapse|synthetic|toolbar|tracemyfile|TrendsmapResolver|Twingly Recon|url|validator|WAPCHOI|Wappalyzer|Webglance|webkit2png|WinHTTP|WordPress|zgrab|bot|search";
    
    assert(userAgentRegex.source === expectedReplacement,
           'User-agent pattern should be replaced with non-lookbehind version');
    
    // Test that it works
    assert(userAgentRegex.test('Googlebot'), 'Should match bot user agents');
    assert(userAgentRegex.test('search engine'), 'Should match search engines');
});

// Test 4: Ensure the registry is properly accessible
total++;
passed += test('Registry is accessible and contains built-in patterns', () => {
    // Check that the global registry exists and contains our patterns
    assert(globalThis.__lookbehind_regex_replacements, 'Global registry should exist');
    assert(Array.isArray(globalThis.__lookbehind_regex_replacements), 'Registry should be an array');
    assert(globalThis.__lookbehind_regex_replacements.length >= 3, 'Should contain at least 3 built-in patterns');
    
    // Check for specific patterns
    const patterns = globalThis.__lookbehind_regex_replacements;
    const emailPattern = patterns.find(p => p.original.includes('(?<!\\.)@'));
    const passwordPattern = patterns.find(p => p.original.includes('(?<!^\\d)'));
    const userAgentPattern = patterns.find(p => p.original.includes('(?<! cu)bot'));
    
    assert(emailPattern, 'Should contain email validation pattern');
    assert(passwordPattern, 'Should contain password validation pattern');
    assert(userAgentPattern, 'Should contain user-agent pattern');
});

// Test 5: Test patterns with different flags
total++;
passed += test('Pattern replacements respect flag specifications', () => {
    // Test that email pattern only applies with 'g' flag
    const emailGlobal = new RegExp('(?<!\\.)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'g');
    const emailNoFlag = new RegExp('(?<!\\.)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
    
    // Both should be replaced since we're looking for patterns that contain lookbehind
    assert(emailGlobal.source === '(?:[^.]|^)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
           'Email pattern with g flag should be replaced');
    assert(emailNoFlag.source === '(?:[^.]|^)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
           'Email pattern without flag should also be replaced');
});

console.log(`\nResults: ${passed}/${total} tests passed`);

if (passed === total) {
    console.log('All additional built-in pattern tests passed! ✓');
    process.exit(0);
} else {
    console.log('Some tests failed! ✗');
    process.exit(1);
}
