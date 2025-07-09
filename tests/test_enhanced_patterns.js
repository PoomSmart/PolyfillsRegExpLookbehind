// Test enhanced pattern matching and new built-in patterns

// Load the polyfill
require('../scripts-priority/RegExp.js');

console.log('Testing enhanced pattern matching and new built-in patterns...\n');

let passed = 0;
let total = 0;

function test(description, condition) {
    total++;
    if (condition) {
        console.log(`✓ ${description}`);
        passed++;
    } else {
        console.log(`✗ ${description}`);
    }
}

// Test normalized pattern matching
console.log('1. Testing normalized pattern matching:');

// Test email pattern with different escape representations
const emailPattern1 = new RegExp('(?<!\\.)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'g');
const emailPattern2 = new RegExp('(?<!\\\\.)@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}', 'g');

test('Email pattern 1 should use replacement', emailPattern1._regexp && emailPattern1._regexp.source !== emailPattern1.source);
test('Email pattern 2 should use replacement', emailPattern2._regexp && emailPattern2._regexp.source !== emailPattern2.source);

// Test password validation pattern
console.log('\n2. Testing password validation pattern:');
const passwordPattern = new RegExp('(?<!^\\d).{8,}');
test('Password pattern should use replacement', passwordPattern._regexp && passwordPattern._regexp.source !== passwordPattern.source);

// Test URL validation pattern
console.log('\n3. Testing new URL validation pattern:');
const urlPattern = new RegExp('(?<!file://)https?://[\\w.-]+', 'g');
test('URL pattern should use replacement', urlPattern._regexp && urlPattern._regexp.source !== urlPattern.source);

// Test word boundary pattern
console.log('\n4. Testing word boundary pattern:');
const wordPattern = new RegExp('(?<!@)\\b\\w+\\b', 'g');
test('Word boundary pattern should use replacement', wordPattern._regexp && wordPattern._regexp.source !== wordPattern.source);

// Test CSS class pattern
console.log('\n5. Testing CSS class pattern:');
const cssPattern = new RegExp('(?<!\\.)([a-zA-Z][\\w-]*)', 'g');
test('CSS class pattern should use replacement', cssPattern._regexp && cssPattern._regexp.source !== cssPattern.source);

// Test decimal number pattern
console.log('\n6. Testing decimal number pattern:');
const decimalPattern = new RegExp('(?<!\\d)\\d+\\.\\d+', 'g');
test('Decimal pattern should use replacement', decimalPattern._regexp && decimalPattern._regexp.source !== decimalPattern.source);

// Test functional behavior of replaced patterns
console.log('\n7. Testing functional behavior:');

// Test email pattern functionality
const emailText = "user@example.com and invalid.@test.org";
const emailMatches = emailText.match(emailPattern1);
test('Email pattern finds valid emails', emailMatches && emailMatches.length > 0);

// Test URL pattern functionality  
const urlText = "Visit https://example.com but not file://local.txt";
const urlMatches = urlText.match(urlPattern);
test('URL pattern finds https URLs', urlMatches && urlMatches.length > 0);

// Test word boundary functionality
const wordText = "hello @username world";
const wordMatches = wordText.match(wordPattern);
test('Word boundary pattern excludes @mentions', wordMatches && !wordMatches.some(m => m.includes('@')));

// Test registry access
console.log('\n8. Testing registry access:');
test('Registry is accessible', Array.isArray(globalThis.__lookbehind_regex_replacements));
test('Registry has multiple patterns', globalThis.__lookbehind_regex_replacements.length >= 7);

// Test original user-agent pattern still works
console.log('\n9. Testing original user-agent pattern:');
const userAgentPattern = new RegExp(" Daum/| DeuSu/| splash | um-LN/|(^|\\s)Site|^&lt;|^12345|^<|^\\[|^Ace Explorer|^acoon|^ActiveBookmark|^ActiveRefresh|^ActiveWorlds|^Ad Muncher|^AHC/|^Amazon CloudFront|^Apache|^ApplicationHealthService|^asafaweb\\.com|^asynchttp|^axios/|^Azureus|^biglotron|^binlar|^Blackboard Safeassign|^BlockNote.Net|^Browsershots|^btwebclient/|^CakePHP|^Camo Asset Proxy|^ClamAV[\\s/]|^Client|^cobweb/|^coccoc|^Custom$|^DAP |^DavClnt|^Dispatch/\\d|^Disqus/|^DuckDuckGo|^eCatch/|^Embedly|^Evernote Clip Resolver|^facebook|^Faraday|^fasthttp$|^FDM \\d|^FDM/\\d|^FlashGet|^Friendica|^GetRight/|^GigablastOpenSource|^Go \\d.\\d package http|^Go-http-client|^googal|^Goose|^GreenBrowser|^GuzzleHttp|^Hatena|^Hexometer|^Hobbit|^Hotzonu|^http|^HWCDN/|^ICE Browser|^ichiro|^infoX-WISG|^INGRID/\\d|^Integrity/|^java|^Jeode/|^JetBrains|^Jetty/|^Jigsaw|^libtorrent|^libwww|^linkdex|^lua-resty-http|^lwp-|^LWP::Simple|^MailChimp\\.com$|^MetaURI|^Microsoft BITS|^Microsoft Data|^Microsoft Office Existence|^Microsoft Office Protocol Discovery|^Microsoft Windows Network Diagnostics|^Microsoft-CryptoAPI|^Microsoft-WebDAV-MiniRedir|^Monit|^MovableType|^Mozilla/4\\.0 \\(compatible;\\)$|^Mozilla/5\\.0 \\(compatible(; Optimizer)?\\)|^Mozilla/5\\.0 \\(en-us\\) AppleWebKit/525\\.13 \\(KHTML, like Gecko\\) Version/3\\.1 Safari/525\\.13|^Mozilla/5\\.0 \\(Macintosh; Intel Mac OS X 10_15\\) AppleWebKit/605\\.1\\.15 \\(KHTML, like Gecko\\) Mobile/15E148 DuckDuckGo/7|^Mozilla/5\\.0 \\(Windows; rv:\\d{2}\\.0\\) Gecko/20100101 Firefox/\\d{2}\\.0$|^Mozilla/\\d\\.\\d \\(compatible\\)$|^muCommander|^My browser$|^NaverMailApp|^NetSurf|^NING|^node-superagent|^NokiaC3-00/5\\.0|^NoteTextView|^Nuzzel|^Offline Explorer|^okhttp|^OSSProxy|^panscient|^Pcore-HTTP|^photon/|^PHP|^Postman|^postrank|^python|^RamblerMail|^raynette_httprequest|^Ruby$|^Scrapy|^selenium/|^set:|^Shareaza|^ShortLinkTranslate|^SignalR|^Sistrix|^snap$|^Snapchat|^Space Bison|^Spring |^Sprinklr|^SVN|^swcd |^T-Online Browser|^Taringa|^Test Certificate Info|^The Knowledge AI|^Thinklab|^thumb|^Traackr.com|^Transmission|^tumblr/|^Ubuntu APT-HTTP|^UCmore|^Upflow/|^USER_AGENT|^utorrent/|^vBulletin|^venus/fedoraplanet|^VSE\\/|^W3C|^WebCopier|^wget|^whatsapp|^WhatWeb|^WWW-Mechanize|^Xenu Link Sleuth|^Xymon|^Yahoo|^Yandex|^Zabbix|^ZDM/\\d|^Zend_Http_Client|^ZmEu$|adbeat\\.com|amiga|analyz|AppInsights|archive|Ask Jeeves/Teoma|BingPreview|Bluecoat DRTR|BorderManager|BrowseX|burpcollaborator|capture|Catchpoint|check|Chrome-Lighthouse|chromeframe|CloudFlare|collect|Commons-HttpClient|crawl|daemon|DareBoost|Datanyze|dataprovider|DejaClick|DMBrowser|download|Email|feed|fetch|finder|FirePHP|FreeSafeIP|fuck|ghost|GomezAgent|google|HeadlessChrome/|https?:|httrack|HubSpot Marketing Grader|Hydra|ibisBrowser|images|index|ips-agent|java/|JavaFX|JavaOs|Jorgee|library|Lucidworks-Anda|mail\\.ru/|NetcraftSurveyAgent/|news|nutch|OffByOne|org\\.eclipse\\.ui\\.ide\\.workbench|outbrain|parse|perl|phantom|Pingdom|Powermarks|PTST[/ ]\\d|reader|Rigor|rss|scan|scrape|server|SkypeUriPreview|Sogou|SpeedMode; Proxy;|spider|StatusCake|stumbleupon\\.com|SuperCleaner|synapse|synthetic|toolbar|tracemyfile|TrendsmapResolver|Twingly Recon|url|validator|WAPCHOI|Wappalyzer|Webglance|webkit2png|WinHTTP|WordPress|zgrab|(?<! cu)bot|(?<! (ya|yandex))search", 'i');
test('User-agent pattern should use replacement', userAgentPattern._regexp && userAgentPattern._regexp.source !== userAgentPattern.source);

// Test behavior on actual user-agent strings
const testUserAgents = [
    "robot user agent",  // Should match (contains 'bot' but not preceded by 'cu')
    "cubot browser",     // Should not match in original (preceded by 'cu')
    "search engine",     // Should match (contains 'search' but not preceded by 'ya' or 'yandex')
    "yandex search"      // Should not match in original (preceded by 'yandex')
];

const userAgentResults = testUserAgents.map(ua => userAgentPattern.test(ua));
test('User-agent pattern matches expected strings', userAgentResults[0] && userAgentResults[2]);

console.log(`\nResults: ${passed}/${total} tests passed`);

if (passed === total) {
    console.log('All tests passed! ✓');
} else {
    console.log('Some tests failed! ✗');
    process.exit(1);
}
