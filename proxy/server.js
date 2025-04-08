const http = require('http');
const url = require('url');

// Your PAC file content as a string with dynamic proxy address determination
const pacFileContent = `function FindProxyForURL(url, host) {
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
        "tiktok.com",
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
        "deepseek.com",
        "copilot.microsoft.com",
        "bing.com/chat",
        "heikickgn.com"
    ];

    // Determine the correct proxy address based on the client's location
    var proxyAddress;
    
    // Check if accessing locally
    if (isPlainHostName(host) || 
        dnsDomainIs(host, "localhost") || 
        dnsDomainIs(host, "127.0.0.1") ||
        isInNet(myIpAddress(), "127.0.0.0", "255.0.0.0") ||
        isInNet(myIpAddress(), "10.0.0.0", "255.0.0.0") ||
        isInNet(myIpAddress(), "172.16.0.0", "255.240.0.0") ||
        isInNet(myIpAddress(), "192.168.0.0", "255.255.0.0")) {
        proxyAddress = "localhost:${process.env.PORT || '8989'}";
    } else {
        // For remote access, use the public IP
        proxyAddress = "${process.env.HOST_IP || 'localhost'}:${process.env.PORT || '8989'}";
    }

    // Check for TikTok and Deepseek domains using regex for comprehensive blocking
    if (/(\.|^)deepseek\.com$/i.test(host) || 
        /(\.|^)tiktok(v|cdn)?\.com$/i.test(host) || 
        /(\.|^)byte(oversea|dance|glb|img)\.com$/i.test(host) ||
        /(\.|^)musical\.ly$/i.test(host)) {
        return "PROXY " + proxyAddress;
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
        return "PROXY " + proxyAddress;
    }

    // Check if the host matches any of the other blocked domains
    for (var i = 0; i < blockedDomains.length; i++) {
        if (dnsDomainIs(host, blockedDomains[i]) || 
            host == blockedDomains[i] || 
            shExpMatch(host, "*." + blockedDomains[i])) {
            return "PROXY " + proxyAddress;
        }
    }

    // Default rule: all other traffic goes direct
    return "DIRECT";
}`;

// HTML template for the blocked page
const blockedPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Blocked</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 600px;
            width: 90%;
        }
        h1 {
            color: #e53935;
            margin-top: 0;
        }
        p {
            color: #555;
            font-size: 18px;
            line-height: 1.6;
        }
        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">⛔</div>
        <h1>This site has been blocked by your administrator</h1>
        <p>Access to this website has been restricted according to your organization's internet usage policy.</p>
        <p>If you believe this is an error, please contact your IT department.</p>
    </div>
</body>
</html>
`;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // If requesting the PAC file
  if (parsedUrl.pathname === '/proxy.pac') {
    res.writeHead(200, { 
      'Content-Type': 'application/x-ns-proxy-autoconfig',
      'Cache-Control': 'max-age=300' // Cache for 5 minutes
    });
    res.end(pacFileContent);
  } 
  // If requesting the root path, show a simple status page
  else if (parsedUrl.pathname === '/') {
    const hostIp = process.env.HOST_IP || 'localhost';
    const port = process.env.PORT || '8989';
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Proxy Server Status</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .status { padding: 15px; background-color: #d4edda; border-radius: 4px; color: #155724; }
          h1 { color: #333; }
          code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>Proxy Server Status</h1>
        <div class="status">
          <p>✅ Proxy server is running</p>
          <p>PAC file is available at: <code>http://${hostIp}:${port}/proxy.pac</code></p>
          <p>Server configured with HOST_IP: <code>${hostIp}</code></p>
        </div>
        <p>To use this proxy, configure your browser to use the PAC file URL above.</p>
        <p>For local testing, use: <code>http://localhost:${port}/proxy.pac</code></p>
      </body>
      </html>
    `);
  }
  // For all other requests, return blocked message
  else {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end(blockedPageHTML);
  }
});

const PORT = process.env.PORT || 8989;
server.listen(PORT, '0.0.0.0', () => {
  const hostIp = process.env.HOST_IP || 'localhost';
  console.log(`Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`PAC file available at http://${hostIp}:${PORT}/proxy.pac`);
  console.log(`For local testing, use: http://localhost:${PORT}/proxy.pac`);
});
