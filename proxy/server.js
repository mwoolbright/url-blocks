const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const express = require('express');
const path = require('path');

// Define constants for configuration
const DEFAULT_PORT = process.env.PORT || 3000;
const DEFAULT_HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const DOMAIN_NAME = process.env.DOMAIN_NAME || 'yourdomain.com';

// Create Express app for handling requests
const app = express();

// Allow dotfiles - required for Let's Encrypt .well-known/acme-challenge verification
app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'allow' }));

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

    // Determine the correct proxy address based on the client's location and protocol
    var proxyAddress;
    var isSecure = url.substring(0, 6) === 'https:';
    var proxyPort = isSecure ? ${DEFAULT_HTTPS_PORT} : ${DEFAULT_PORT};
    
    // Check if accessing locally
    if (isPlainHostName(host) || 
        dnsDomainIs(host, "localhost") || 
        dnsDomainIs(host, "127.0.0.1") ||
        isInNet(myIpAddress(), "127.0.0.0", "255.0.0.0") ||
        isInNet(myIpAddress(), "10.0.0.0", "255.0.0.0") ||
        isInNet(myIpAddress(), "172.16.0.0", "255.240.0.0") ||
        isInNet(myIpAddress(), "192.168.0.0", "255.255.0.0")) {
        proxyAddress = "localhost:" + proxyPort;
    } else {
        // For remote access, use the domain name or IP
        proxyAddress = "${DOMAIN_NAME}:" + proxyPort;
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

// Handle requests for the PAC file
app.get('/proxy.pac', (req, res) => {
  res.set('Content-Type', 'application/x-ns-proxy-autoconfig');
  res.set('Cache-Control', 'max-age=300');
  res.send(pacFileContent);
});

// Handle requests for the root path
app.get('/', (req, res) => {
  const httpsEnabled = fs.existsSync(`/etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem`);
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Proxy Server Status</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .status { padding: 15px; background-color: #d4edda; border-radius: 4px; color: #155724; margin-bottom: 15px; }
        .warning { padding: 15px; background-color: #fff3cd; border-radius: 4px; color: #856404; margin-bottom: 15px; }
        h1 { color: #333; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>Proxy Server Status</h1>
      <div class="status">
        <p>✅ HTTP proxy server is running</p>
        ${httpsEnabled ? '<p>✅ HTTPS proxy server is running with Let\'s Encrypt</p>' : '<p>⚠️ HTTPS proxy server is not running (Let\'s Encrypt certificates not found)</p>'}
      </div>
      
      <h2>Configuration</h2>
      <table>
        <tr>
          <th>Service</th>
          <th>URL</th>
        </tr>
        <tr>
          <td>PAC File (HTTP)</td>
          <td><code>http://${DOMAIN_NAME}:${DEFAULT_PORT}/proxy.pac</code></td>
        </tr>
        ${httpsEnabled ? `
        <tr>
          <td>PAC File (HTTPS)</td>
          <td><code>https://${DOMAIN_NAME}:${DEFAULT_HTTPS_PORT}/proxy.pac</code></td>
        </tr>
        ` : ''}
        <tr>
          <td>Local Testing</td>
          <td><code>http://localhost:${DEFAULT_PORT}/proxy.pac</code></td>
        </tr>
      </table>
      
      <h2>Usage Instructions</h2>
      <p>To use this proxy, configure your browser to use the PAC file URL from the table above.</p>
      
      ${!httpsEnabled ? `
      <div class="warning">
        <p><strong>Warning:</strong> HTTPS support is not enabled. To enable HTTPS with Let's Encrypt:</p>
        <ol>
          <li>Make sure this server is accessible from the internet on port 80</li>
          <li>Install Certbot: <code>sudo apt-get update && sudo apt-get install certbot</code></li>
          <li>Obtain certificate: <code>sudo certbot certonly --webroot -w ${path.join(__dirname, 'public')} -d ${DOMAIN_NAME}</code></li>
          <li>Restart the server</li>
        </ol>
      </div>
      ` : ''}
    </body>
    </html>
  `);
});

// For all other requests, return blocked message
app.use((req, res) => {
  res.status(403).send(blockedPageHTML);
});

// Create HTTP server
const httpServer = http.createServer(app);

// Start HTTP server
httpServer.listen(DEFAULT_PORT, '0.0.0.0', () => {
  console.log(`HTTP proxy server running on http://0.0.0.0:${DEFAULT_PORT}`);
  console.log(`PAC file available at http://${DOMAIN_NAME}:${DEFAULT_PORT}/proxy.pac`);
});

// Try to load Let's Encrypt certificates if they exist
try {
  const certPath = `/etc/letsencrypt/live/${DOMAIN_NAME}`;
  const sslOptions = {
    key: fs.readFileSync(`${certPath}/privkey.pem`),
    cert: fs.readFileSync(`${certPath}/fullchain.pem`),
    ca: fs.readFileSync(`${certPath}/chain.pem`)
  };
  
  // Create HTTPS server with Let's Encrypt certificates
  const httpsServer = https.createServer(sslOptions, app);
  httpsServer.listen(DEFAULT_HTTPS_PORT, '0.0.0.0', () => {
    console.log(`HTTPS proxy server running on https://0.0.0.0:${DEFAULT_HTTPS_PORT}`);
    console.log(`Using Let's Encrypt certificates for ${DOMAIN_NAME}`);
  });
  
  // Set up certificate auto-reload
  fs.watch(certPath, (eventType, filename) => {
    if (filename) {
      console.log(`Certificate file changed: ${filename}`);
      try {
        const newOptions = {
          key: fs.readFileSync(`${certPath}/privkey.pem`),
          cert: fs.readFileSync(`${certPath}/fullchain.pem`),
          ca: fs.readFileSync(`${certPath}/chain.pem`)
        };
        httpsServer.setSecureContext(newOptions);
        console.log('Updated SSL certificates successfully');
      } catch (error) {
        console.error('Error updating SSL certificates:', error);
      }
    }
  });
} catch (error) {
  console.log('HTTPS server not started: Let\'s Encrypt certificates not found');
  console.log(`To obtain certificates, run: certbot certonly --webroot -w ${path.join(__dirname, 'public')} -d ${DOMAIN_NAME}`);
}
