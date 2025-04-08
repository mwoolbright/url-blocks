function FindProxyForURL(url, host) {
    // List of domains to block
    var blockedDomains = [
        "splashtop.com",
        "frassirishiproc.com",
        "myrepository.name",
        "egscorp.net",
        "abtest-sg-tiktok.byteoversea.com",
        "abtest-va-tiktok.byteoversea.com",
        "byteglb.com",
        "gts.byteoversea.net",
        "isnssdk.com",
        "lf1-ttcdn-tos.pstatp.com",
        "muscdn.com",
        "manageengine.com",
        "musemuse.cn",
        "musical.ly",
        "p16-ad-sg.ibyteimg.com",
        "p16-tiktok-sg.ibyteimg.com",
        "p16-tiktok-sign-va-h2.ibyteimg.com",
        "p16-tiktok-va-h2.ibyteimg.com",
        "p16-tiktok-va.ibyteimg.com",
        "p16-va-tiktok.ibyteimg.com",
        "p1-tt.byteimg.com",
        "p1-tt-ipv6.byteimg.com",
        "auvik.com",
        "p26-tt.byteimg.com",
        "p3-tt-ipv6.byteimg.com",
        "p9-tt.byteimg.com",
        "pull-f3-hs.pstatp.com",
        "pull-f5-hs.flive.pstatp.com",
        "pull-f5-hs.pstatp.com",
        "pull-f5-mus.pstatp.com",
        "pull-flv-f1-hs.pstatp.com",
        "pull-flv-f6-hs.pstatp.com",
        "pull-flv-l1-hs.pstatp.com",
        "reddit.com",
        "pull-flv-l1-mus.pstatp.com",
        "pull-flv-l6-hs.pstatp.com",
        "pull-hls-l1-mus.pstatp.com",
        "pull-l3-hs.pstatp.com",
        "pull-rtmp-f1-hs.pstatp.com",
        "pull-rtmp-f6-hs.pstatp.com",
        "pull-rtmp-l1-hs.pstatp.com",
        "pull-rtmp-l1-mus.pstatp.com",
        "pull-rtmp-l6-hs.pstatp.com",
        "quic-tiktok-core-proxy-i18n-gcpva.byteoversea.net",
        "xrepositoryx.name",
        "quic-tiktok-proxy-i18n-gcpva.byteoversea.net",
        "sf16-ttcdn-tos.ipstatp.com",
        "sf1-ttcdn-tos.pstatp.com",
        "sf6-ttcdn-tos.pstatp.com",
        "sgsnssdk.com",
        "tiktokcdn.com",
        "tiktokcdn.com.atomile.com",
        "tiktokcdn.com.c.bytefcdn-oversea.com",
        "tiktokcdn.com.c.bytefcdn-ttpeu.com",
        "tiktokcdn.com.c.bytetcdn.com",
        "myrepositoryx.com",
        "tiktokcdn.com.c.worldfcdn.com",
        "tiktokcdn.com.qlivecdn.com",
        "tiktokcdn.com.rocket-cdn.com",
        "tiktokcdn.com.tlivepush.com",
        "tiktokcdn-in.com",
        "tiktokcdn-us.com",
        "tiktokcdn-us.com.atomile.com",
        "tiktokd.org",
        "tiktok-lb-alisg.byteoversea.net",
        "erdjknfweklsgwfmewfgref.com",
        "tiktok-lb-maliva.byteoversea.net",
        "tiktok-platform-lb-alisg.byteoversea.net",
        "tiktokv.com",
        "tiktokv.com.c.bytefcdn-oversea.com",
        "tiktokv.com.c.worldfcdn2.com",
        "tiktokv.com.c.worldfcdn.com",
        "tlivecdn.com",
        "ttlivecdn.com",
        "ttlivecdn.com.c.worldfcdn.com",
        "ttoversea.net",
        "harrysucksdick.com",
        "ttoverseaus.net",
        "copilot.microsoft.com",
        "bing.com/chat",
        "heikickgn.com"
    ];

    // Check for TikTok and Deepseek domains using regex for comprehensive blocking
    if (/(\.|^)deepseek\.com$/i.test(host) || 
        /(\.|^)tiktok(v|cdn)?\.com$/i.test(host) || 
        /(\.|^)byte(oversea|dance|glb|img)\.com$/i.test(host) ||
        /(\.|^)musical\.ly$/i.test(host)) {
        return "PROXY 0.0.0.0:0";
    }
    
    // Special domains that need more thorough blocking with pattern matching
    if (dnsDomainIs(host, ".deepseek.com") || 
        host == "deepseek.com" || 
        dnsDomainIs(host, ".tiktok.com") || 
        host == "tiktok.com" ||
        shExpMatch(host, "*.tiktok.*") ||
        shExpMatch(host, "*.byteoversea.*") ||
        shExpMatch(host, "*.bytedance.*") ||
        shExpMatch(host, "*.tiktokv.*") ||
        shExpMatch(host, "*.tiktokcdn.*") ||
        shExpMatch(host, "*.musical.ly") ||
        shExpMatch(host, "*.byteimg.*") ||
        shExpMatch(host, "*.pstatp.*") ||
        shExpMatch(host, "*.ipstatp.*") ||
        shExpMatch(host, "*.ttcdn*") ||
        shExpMatch(host, "*.snssdk.*")) {
        return "PROXY 0.0.0.0:0"; // Block access by using an invalid proxy
    }

    // Check if the host matches any of the other blocked domains
    for (var i = 0; i < blockedDomains.length; i++) {
        if (dnsDomainIs(host, blockedDomains[i]) || 
            host == blockedDomains[i] || 
            shExpMatch(host, "*." + blockedDomains[i])) {
            return "PROXY 0.0.0.0:0"; // Block access by using an invalid proxy
        }
    }

    // Default rule: all other traffic goes direct
    return "DIRECT";
}
