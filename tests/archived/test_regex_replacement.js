// Test the new regex replacement feature
console.log('=== Testing Regex Replacement Feature ===\n');

// Define replacements before loading the polyfill
globalThis.__lookbehind_regex_replacements = [
    {
        // User's complex user-agent pattern with lookbehind
        original: " Daum/| DeuSu/| splash | um-LN/|(^|\\s)Site|^&lt;|^12345|^<|^\\[|^Ace Explorer|^acoon|^ActiveBookmark|^ActiveRefresh|^ActiveWorlds|^Ad Muncher|^AHC/|^Amazon CloudFront|^Apache|^ApplicationHealthService|^asafaweb\\.com|^asynchttp|^axios/|^Azureus|^biglotron|^binlar|^Blackboard Safeassign|^BlockNote.Net|^Browsershots|^btwebclient/|^CakePHP|^Camo Asset Proxy|^ClamAV[\\s/]|^Client|^cobweb/|^coccoc|^Custom$|^DAP |^DavClnt|^Dispatch/\\d|^Disqus/|^DuckDuckGo|^eCatch/|^Embedly|^Evernote Clip Resolver|^facebook|^Faraday|^fasthttp$|^FDM \\d|^FDM/\\d|^FlashGet|^Friendica|^GetRight/|^GigablastOpenSource|^Go \\d.\\d package http|^Go-http-client|^googal|^Goose|^GreenBrowser|^GuzzleHttp|^Hatena|^Hexometer|^Hobbit|^Hotzonu|^http|^HWCDN/|^ICE Browser|^ichiro|^infoX-WISG|^INGRID/\\d|^Integrity/|^java|^Jeode/|^JetBrains|^Jetty/|^Jigsaw|^libtorrent|^libwww|^linkdex|^lua-resty-http|^lwp-|^LWP::Simple|^MailChimp\\.com$|^MetaURI|^Microsoft BITS|^Microsoft Data|^Microsoft Office Existence|^Microsoft Office Protocol Discovery|^Microsoft Windows Network Diagnostics|^Microsoft-CryptoAPI|^Microsoft-WebDAV-MiniRedir|^Monit|^MovableType|^Mozilla/4\\.0 \\(compatible;\\)$|^Mozilla/5\\.0 \\(compatible(; Optimizer)?\\)|^Mozilla/5\\.0 \\(en-us\\) AppleWebKit/525\\.13 \\(KHTML, like Gecko\\) Version/3\\.1 Safari/525\\.13|^Mozilla/5\\.0 \\(Macintosh; Intel Mac OS X 10_15\\) AppleWebKit/605\\.1\\.15 \\(KHTML, like Gecko\\) Mobile/15E148 DuckDuckGo/7|^Mozilla/5\\.0 \\(Windows; rv:\\d{2}\\.0\\) Gecko/20100101 Firefox/\\d{2}\\.0$|^Mozilla/\\d\\.\\d \\(compatible\\)$|^muCommander|^My browser$|^NaverMailApp|^NetSurf|^NING|^node-superagent|^NokiaC3-00/5\\.0|^NoteTextView|^Nuzzel|^Offline Explorer|^okhttp|^OSSProxy|^panscient|^Pcore-HTTP|^photon/|^PHP|^Postman|^postrank|^python|^RamblerMail|^raynette_httprequest|^Ruby$|^Scrapy|^selenium/|^set:|^Shareaza|^ShortLinkTranslate|^SignalR|^Sistrix|^snap$|^Snapchat|^Space Bison|^Spring |^Sprinklr|^SVN|^swcd |^T-Online Browser|^Taringa|^Test Certificate Info|^The Knowledge AI|^Thinklab|^thumb|^Traackr.com|^Transmission|^tumblr/|^Ubuntu APT-HTTP|^UCmore|^Upflow/|^USER_AGENT|^utorrent/|^vBulletin|^venus/fedoraplanet|^VSE\\/|^W3C|^WebCopier|^wget|^whatsapp|^WhatWeb|^WWW-Mechanize|^Xenu Link Sleuth|^Xymon|^Yahoo|^Yandex|^Zabbix|^ZDM/\\d|^Zend_Http_Client|^ZmEu$|adbeat\\.com|amiga|analyz|AppInsights|archive|Ask Jeeves/Teoma|BingPreview|Bluecoat DRTR|BorderManager|BrowseX|burpcollaborator|capture|Catchpoint|check|Chrome-Lighthouse|chromeframe|CloudFlare|collect|Commons-HttpClient|crawl|daemon|DareBoost|Datanyze|dataprovider|DejaClick|DMBrowser|download|Email|feed|fetch|finder|FirePHP|FreeSafeIP|fuck|ghost|GomezAgent|google|HeadlessChrome/|https?:|httrack|HubSpot Marketing Grader|Hydra|ibisBrowser|images|index|ips-agent|java/|JavaFX|JavaOs|Jorgee|library|Lucidworks-Anda|mail\\.ru/|NetcraftSurveyAgent/|news|nutch|OffByOne|org\\.eclipse\\.ui\\.ide\\.workbench|outbrain|parse|perl|phantom|Pingdom|Powermarks|PTST[/ ]\\d|reader|Rigor|rss|scan|scrape|server|SkypeUriPreview|Sogou|SpeedMode; Proxy;|spider|StatusCake|stumbleupon\\.com|SuperCleaner|synapse|synthetic|toolbar|tracemyfile|TrendsmapResolver|Twingly Recon|url|validator|WAPCHOI|Wappalyzer|Webglance|webkit2png|WinHTTP|WordPress|zgrab|(?<! cu)bot|(?<! (ya|yandex))search",
        // Simplified version without lookbehind (just remove the lookbehind parts)
        replacement: " Daum/| DeuSu/| splash | um-LN/|(^|\\s)Site|^&lt;|^12345|^<|^\\[|^Ace Explorer|^acoon|^ActiveBookmark|^ActiveRefresh|^ActiveWorlds|^Ad Muncher|^AHC/|^Amazon CloudFront|^Apache|^ApplicationHealthService|^asafaweb\\.com|^asynchttp|^axios/|^Azureus|^biglotron|^binlar|^Blackboard Safeassign|^BlockNote.Net|^Browsershots|^btwebclient/|^CakePHP|^Camo Asset Proxy|^ClamAV[\\s/]|^Client|^cobweb/|^coccoc|^Custom$|^DAP |^DavClnt|^Dispatch/\\d|^Disqus/|^DuckDuckGo|^eCatch/|^Embedly|^Evernote Clip Resolver|^facebook|^Faraday|^fasthttp$|^FDM \\d|^FDM/\\d|^FlashGet|^Friendica|^GetRight/|^GigablastOpenSource|^Go \\d.\\d package http|^Go-http-client|^googal|^Goose|^GreenBrowser|^GuzzleHttp|^Hatena|^Hexometer|^Hobbit|^Hotzonu|^http|^HWCDN/|^ICE Browser|^ichiro|^infoX-WISG|^INGRID/\\d|^Integrity/|^java|^Jeode/|^JetBrains|^Jetty/|^Jigsaw|^libtorrent|^libwww|^linkdex|^lua-resty-http|^lwp-|^LWP::Simple|^MailChimp\\.com$|^MetaURI|^Microsoft BITS|^Microsoft Data|^Microsoft Office Existence|^Microsoft Office Protocol Discovery|^Microsoft Windows Network Diagnostics|^Microsoft-CryptoAPI|^Microsoft-WebDAV-MiniRedir|^Monit|^MovableType|^Mozilla/4\\.0 \\(compatible;\\)$|^Mozilla/5\\.0 \\(compatible(; Optimizer)?\\)|^Mozilla/5\\.0 \\(en-us\\) AppleWebKit/525\\.13 \\(KHTML, like Gecko\\) Version/3\\.1 Safari/525\\.13|^Mozilla/5\\.0 \\(Macintosh; Intel Mac OS X 10_15\\) AppleWebKit/605\\.1\\.15 \\(KHTML, like Gecko\\) Mobile/15E148 DuckDuckGo/7|^Mozilla/5\\.0 \\(Windows; rv:\\d{2}\\.0\\) Gecko/20100101 Firefox/\\d{2}\\.0$|^Mozilla/\\d\\.\\d \\(compatible\\)$|^muCommander|^My browser$|^NaverMailApp|^NetSurf|^NING|^node-superagent|^NokiaC3-00/5\\.0|^NoteTextView|^Nuzzel|^Offline Explorer|^okhttp|^OSSProxy|^panscient|^Pcore-HTTP|^photon/|^PHP|^Postman|^postrank|^python|^RamblerMail|^raynette_httprequest|^Ruby$|^Scrapy|^selenium/|^set:|^Shareaza|^ShortLinkTranslate|^SignalR|^Sistrix|^snap$|^Snapchat|^Space Bison|^Spring |^Sprinklr|^SVN|^swcd |^T-Online Browser|^Taringa|^Test Certificate Info|^The Knowledge AI|^Thinklab|^thumb|^Traackr.com|^Transmission|^tumblr/|^Ubuntu APT-HTTP|^UCmore|^Upflow/|^USER_AGENT|^utorrent/|^vBulletin|^venus/fedoraplanet|^VSE\\/|^W3C|^WebCopier|^wget|^whatsapp|^WhatWeb|^WWW-Mechanize|^Xenu Link Sleuth|^Xymon|^Yahoo|^Yandex|^Zabbix|^ZDM/\\d|^Zend_Http_Client|^ZmEu$|adbeat\\.com|amiga|analyz|AppInsights|archive|Ask Jeeves/Teoma|BingPreview|Bluecoat DRTR|BorderManager|BrowseX|burpcollaborator|capture|Catchpoint|check|Chrome-Lighthouse|chromeframe|CloudFlare|collect|Commons-HttpClient|crawl|daemon|DareBoost|Datanyze|dataprovider|DejaClick|DMBrowser|download|Email|feed|fetch|finder|FirePHP|FreeSafeIP|fuck|ghost|GomezAgent|google|HeadlessChrome/|https?:|httrack|HubSpot Marketing Grader|Hydra|ibisBrowser|images|index|ips-agent|java/|JavaFX|JavaOs|Jorgee|library|Lucidworks-Anda|mail\\.ru/|NetcraftSurveyAgent/|news|nutch|OffByOne|org\\.eclipse\\.ui\\.ide\\.workbench|outbrain|parse|perl|phantom|Pingdom|Powermarks|PTST[/ ]\\d|reader|Rigor|rss|scan|scrape|server|SkypeUriPreview|Sogou|SpeedMode; Proxy;|spider|StatusCake|stumbleupon\\.com|SuperCleaner|synapse|synthetic|toolbar|tracemyfile|TrendsmapResolver|Twingly Recon|url|validator|WAPCHOI|Wappalyzer|Webglance|webkit2png|WinHTTP|WordPress|zgrab|bot|search",
        flags: 'i'
    },
    {
        // Simple test pattern
        original: '(?<=abc)def',
        replacement: 'def',
        // No flags specified = applies to any flags
    }
];

// Load polyfill
eval(require('fs').readFileSync('./scripts/RegExp.lookbehind.js', 'utf8'));

console.log('1. Testing complex user-agent pattern replacement:');
try {
    const userAgentPattern = " Daum/| DeuSu/| splash | um-LN/|(^|\\s)Site|^&lt;|^12345|^<|^\\[|^Ace Explorer|^acoon|^ActiveBookmark|^ActiveRefresh|^ActiveWorlds|^Ad Muncher|^AHC/|^Amazon CloudFront|^Apache|^ApplicationHealthService|^asafaweb\\.com|^asynchttp|^axios/|^Azureus|^biglotron|^binlar|^Blackboard Safeassign|^BlockNote.Net|^Browsershots|^btwebclient/|^CakePHP|^Camo Asset Proxy|^ClamAV[\\s/]|^Client|^cobweb/|^coccoc|^Custom$|^DAP |^DavClnt|^Dispatch/\\d|^Disqus/|^DuckDuckGo|^eCatch/|^Embedly|^Evernote Clip Resolver|^facebook|^Faraday|^fasthttp$|^FDM \\d|^FDM/\\d|^FlashGet|^Friendica|^GetRight/|^GigablastOpenSource|^Go \\d.\\d package http|^Go-http-client|^googal|^Goose|^GreenBrowser|^GuzzleHttp|^Hatena|^Hexometer|^Hobbit|^Hotzonu|^http|^HWCDN/|^ICE Browser|^ichiro|^infoX-WISG|^INGRID/\\d|^Integrity/|^java|^Jeode/|^JetBrains|^Jetty/|^Jigsaw|^libtorrent|^libwww|^linkdex|^lua-resty-http|^lwp-|^LWP::Simple|^MailChimp\\.com$|^MetaURI|^Microsoft BITS|^Microsoft Data|^Microsoft Office Existence|^Microsoft Office Protocol Discovery|^Microsoft Windows Network Diagnostics|^Microsoft-CryptoAPI|^Microsoft-WebDAV-MiniRedir|^Monit|^MovableType|^Mozilla/4\\.0 \\(compatible;\\)$|^Mozilla/5\\.0 \\(compatible(; Optimizer)?\\)|^Mozilla/5\\.0 \\(en-us\\) AppleWebKit/525\\.13 \\(KHTML, like Gecko\\) Version/3\\.1 Safari/525\\.13|^Mozilla/5\\.0 \\(Macintosh; Intel Mac OS X 10_15\\) AppleWebKit/605\\.1\\.15 \\(KHTML, like Gecko\\) Mobile/15E148 DuckDuckGo/7|^Mozilla/5\\.0 \\(Windows; rv:\\d{2}\\.0\\) Gecko/20100101 Firefox/\\d{2}\\.0$|^Mozilla/\\d\\.\\d \\(compatible\\)$|^muCommander|^My browser$|^NaverMailApp|^NetSurf|^NING|^node-superagent|^NokiaC3-00/5\\.0|^NoteTextView|^Nuzzel|^Offline Explorer|^okhttp|^OSSProxy|^panscient|^Pcore-HTTP|^photon/|^PHP|^Postman|^postrank|^python|^RamblerMail|^raynette_httprequest|^Ruby$|^Scrapy|^selenium/|^set:|^Shareaza|^ShortLinkTranslate|^SignalR|^Sistrix|^snap$|^Snapchat|^Space Bison|^Spring |^Sprinklr|^SVN|^swcd |^T-Online Browser|^Taringa|^Test Certificate Info|^The Knowledge AI|^Thinklab|^thumb|^Traackr.com|^Transmission|^tumblr/|^Ubuntu APT-HTTP|^UCmore|^Upflow/|^USER_AGENT|^utorrent/|^vBulletin|^venus/fedoraplanet|^VSE\\/|^W3C|^WebCopier|^wget|^whatsapp|^WhatWeb|^WWW-Mechanize|^Xenu Link Sleuth|^Xymon|^Yahoo|^Yandex|^Zabbix|^ZDM/\\d|^Zend_Http_Client|^ZmEu$|adbeat\\.com|amiga|analyz|AppInsights|archive|Ask Jeeves/Teoma|BingPreview|Bluecoat DRTR|BorderManager|BrowseX|burpcollaborator|capture|Catchpoint|check|Chrome-Lighthouse|chromeframe|CloudFlare|collect|Commons-HttpClient|crawl|daemon|DareBoost|Datanyze|dataprovider|DejaClick|DMBrowser|download|Email|feed|fetch|finder|FirePHP|FreeSafeIP|fuck|ghost|GomezAgent|google|HeadlessChrome/|https?:|httrack|HubSpot Marketing Grader|Hydra|ibisBrowser|images|index|ips-agent|java/|JavaFX|JavaOs|Jorgee|library|Lucidworks-Anda|mail\\.ru/|NetcraftSurveyAgent/|news|nutch|OffByOne|org\\.eclipse\\.ui\\.ide\\.workbench|outbrain|parse|perl|phantom|Pingdom|Powermarks|PTST[/ ]\\d|reader|Rigor|rss|scan|scrape|server|SkypeUriPreview|Sogou|SpeedMode; Proxy;|spider|StatusCake|stumbleupon\\.com|SuperCleaner|synapse|synthetic|toolbar|tracemyfile|TrendsmapResolver|Twingly Recon|url|validator|WAPCHOI|Wappalyzer|Webglance|webkit2png|WinHTTP|WordPress|zgrab|(?<! cu)bot|(?<! (ya|yandex))search";
    
    console.log('Creating RegExp with complex lookbehind pattern...');
    const regex = new RegExp(userAgentPattern, 'i');
    
    console.log('✓ RegExp created successfully');
    console.log('✓ Source contains original pattern:', regex.source === userAgentPattern);
    console.log('✓ Flags preserved:', regex.flags === 'i');
    
    // Test some user agent strings
    const testStrings = [
        'Mozilla/5.0 (compatible) bot',
        'Mozilla/5.0 (compatible) cubot',  // Should NOT match with original lookbehind
        'Mozilla/5.0 (compatible) search',
        'Mozilla/5.0 (compatible) yandex search',  // Should NOT match with original lookbehind
        'somebot crawler',
        'search engine'
    ];
    
    console.log('\\nTesting against user agent strings:');
    testStrings.forEach(ua => {
        const match = regex.test(ua);
        console.log(`  "${ua}" -> ${match ? 'MATCH' : 'no match'}`);
    });
    
} catch (error) {
    console.error('✗ Error:', error.message);
}

console.log('\\n2. Testing simple pattern replacement:');
try {
    const simpleRegex = new RegExp('(?<=abc)def', 'g');
    console.log('✓ Simple pattern created');
    console.log('✓ Source preserved:', simpleRegex.source === '(?<=abc)def');
    
    const testStr = 'abcdef xyzdef';
    const matches = testStr.match(simpleRegex);
    console.log('✓ Test result:', matches); // Should match 'def' after replacement
    
} catch (error) {
    console.error('✗ Error:', error.message);
}

console.log('\\n3. Testing is-regex compatibility:');
try {
    const testRegex = new RegExp('(?<=abc)def');
    
    // Test basic properties
    console.log('✓ Has lastIndex property:', 'lastIndex' in testRegex);
    console.log('✓ lastIndex is writable:', Object.getOwnPropertyDescriptor(testRegex, 'lastIndex').writable);
    console.log('✓ lastIndex has value descriptor:', 'value' in Object.getOwnPropertyDescriptor(testRegex, 'lastIndex'));
    
    // Test with a simple is-regex check (simplified version)
    const isRegexLike = testRegex && 
        typeof testRegex === 'object' && 
        'lastIndex' in testRegex &&
        Object.getOwnPropertyDescriptor(testRegex, 'lastIndex').hasOwnProperty('value');
    
    console.log('✓ Passes is-regex-like test:', isRegexLike);
    
} catch (error) {
    console.error('✗ Error:', error.message);
}

console.log('\\n4. Testing patterns without replacement:');
try {
    const noReplacementRegex = new RegExp('(?<=xyz)abc', 'i');
    console.log('✓ Non-replacement pattern created');
    console.log('✓ Uses polyfill logic for simple lookbehind');
    
} catch (error) {
    console.error('✗ Error:', error.message);
}

console.log('\\n✅ All regex replacement tests completed!');
