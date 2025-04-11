const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const net = require('net');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'allow' }));

const DEFAULT_PORT = process.env.PORT || 3000;
const DEFAULT_HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const DOMAIN_NAME = process.env.DOMAIN_NAME || 'proxy.woolbright.cc';
const EXTERNAL_HTTPS_PORT = 8443;

const pacFileContent = `function FindProxyForURL(url, host) {
    var blockedDomains = [
        "splashtop.com", "frassirishiproc.com", "myrepository.name", "egscorp.net",
        "abtest-sg-tiktok.byteoversea.com", "abtest-va-tiktok.byteoversea.com", "byteglb.com",
        "gts.byteoversea.net", "isnssdk.com", "lf1-ttcdn-tos.pstatp.com", "muscdn.com",
        "manageengine.com", "musemuse.cn", "musical.ly", "p16-ad-sg.ibyteimg.com",
        "p16-tiktok-sg.ibyteimg.com", "p16-tiktok-sign-va-h2.ibyteimg.com",
        "p16-tiktok-va-h2.ibyteimg.com", "p16-tiktok-va.ibyteimg.com",
        "p16-va-tiktok.ibyteimg.com", "p1-tt.byteimg.com", "p1-tt-ipv6.byteimg.com",
        "auvik.com", "p26-tt.byteimg.com", "p3-tt-ipv6.byteimg.com", "p9-tt.byteimg.com",
        "pull-f3-hs.pstatp.com", "pull-f5-hs.flive.pstatp.com", "pull-f5-hs.pstatp.com",
        "pull-f5-mus.pstatp.com", "pull-flv-f1-hs.pstatp.com", "pull-flv-f6-hs.pstatp.com",
        "pull-flv-l1-hs.pstatp.com", "pull-flv-l1-mus.pstatp.com", "pull-flv-l6-hs.pstatp.com",
        "pull-hls-l1-mus.pstatp.com", "pull-l3-hs.pstatp.com", "pull-rtmp-f1-hs.pstatp.com",
        "pull-rtmp-f6-hs.pstatp.com", "pull-rtmp-l1-hs.pstatp.com", "pull-rtmp-l1-mus.pstatp.com",
        "pull-rtmp-l6-hs.pstatp.com", "quic-tiktok-core-proxy-i18n-gcpva.byteoversea.net",
        "xrepositoryx.name", "quic-tiktok-proxy-i18n-gcpva.byteoversea.net",
        "sf16-ttcdn-tos.ipstatp.com", "sf1-ttcdn-tos.pstatp.com", "sf6-ttcdn-tos.pstatp.com",
        "sgsnssdk.com", "tiktokcdn.com", "tiktokcdn.com.atomile.com",
        "tiktokcdn.com.c.bytefcdn-oversea.com", "tiktokcdn.com.c.bytefcdn-ttpeu.com",
        "tiktokcdn.com.c.bytetcdn.com", "myrepositoryx.com", "tiktokcdn.com.c.worldfcdn.com",
        "tiktokcdn.com.qlivecdn.com", "tiktokcdn.com.rocket-cdn.com", "tiktokcdn.com.tlivepush.com",
        "tiktokcdn-in.com", "tiktokcdn-us.com", "tiktokcdn-us.com.atomile.com", "tiktok.com",
        "tiktokd.org", "tiktok-lb-alisg.byteoversea.net", "erdjknfweklsgwfmewfgref.com",
        "tiktok-lb-maliva.byteoversea.net", "tiktok-platform-lb-alisg.byteoversea.net",
        "tiktokv.com", "tiktokv.com.c.bytefcdn-oversea.com", "tiktokv.com.c.worldfcdn2.com",
        "tiktokv.com.c.worldfcdn.com", "tlivecdn.com", "ttlivecdn.com",
        "ttlivecdn.com.c.worldfcdn.com", "ttoversea.net", "harrysucksdick.com", "ttoverseaus.net",
        "deepseek.com", "copilot.microsoft.com", "bing.com/chat", "heikickgn.com"
    ];

    var isSecure = url.substring(0, 6) === 'https:';
    var proxyAddress = "${DOMAIN_NAME}:${EXTERNAL_HTTPS_PORT}";

    if (/(\.|^)deepseek\.com$/i.test(host) || 
        /(\.|^)tiktok(v|cdn)?\.com$/i.test(host) || 
        /(\.|^)byte(oversea|dance|glb|img)\.com$/i.test(host) ||
        /(\.|^)musical\.ly$/i.test(host)) {
        return "PROXY " + proxyAddress;
    }
    
    if (dnsDomainIs(host, ".deepseek.com") || host == "deepseek.com" || 
        dnsDomainIs(host, ".tiktok.com") || host == "tiktok.com" ||
        shExpMatch(host, "*.tiktok.*") || shExpMatch(host, "*.byteoversea.*") ||
        shExpMatch(host, "*.bytedance.*") || shExpMatch(host, "*.tiktokv.*") ||
        shExpMatch(host, "*.tiktokcdn.*") || shExpMatch(host, "*.musical.ly") ||
        shExpMatch(host, "*.byteimg.*") || shExpMatch(host, "*.pstatp.*") ||
        shExpMatch(host, "*.ipstatp.*") || shExpMatch(host, "*.ttcdn*") ||
        shExpMatch(host, "*.snssdk.*")) {
        return "PROXY " + proxyAddress;
    }

    for (var i = 0; i < blockedDomains.length; i++) {
        if (dnsDomainIs(host, blockedDomains[i]) || 
            host == blockedDomains[i] || 
            shExpMatch(host, "*." + blockedDomains[i])) {
            return "PROXY " + proxyAddress;
        }
    }

    return "DIRECT";
}`;

const blockedPageHTML = `<!DOCTYPE html><html><body><h1>Site Blocked</h1><p>This site has been blocked by your administrator.</p></body></html>`;

function isBlockedDomain(host) {
    if (!host) return false;

    const domain = host.toLowerCase();

    if (/(\.|^)deepseek\.com$/i.test(domain) ||
        /(\.|^)tiktok(v|cdn)?\.com$/i.test(domain) ||
        /(\.|^)byte(oversea|dance|glb|img)\.com$/i.test(domain) ||
        /(\.|^)musical\.ly$/i.test(domain)) {
        return true;
    }

    if (domain.endsWith(".deepseek.com") ||
        domain === "deepseek.com" ||
        domain.endsWith(".tiktok.com") ||
        domain === "tiktok.com" ||
        domain.includes(".tiktok.") ||
        domain.includes(".byteoversea.") ||
        domain.includes(".bytedance.") ||
        domain.includes(".tiktokv.") ||
        domain.includes(".tiktokcdn.") ||
        domain.includes(".musical.ly") ||
        domain.includes(".byteimg.") ||
        domain.includes(".pstatp.") ||
        domain.includes(".ipstatp.") ||
        domain.includes(".ttcdn") ||
        domain.includes(".snssdk.")) {
        return true;
    }

    const blockedDomainsMatch = pacFileContent.match(/var blockedDomains = \[([\s\S]*?)\];/);
    if (blockedDomainsMatch) {
        const blockedDomains = blockedDomainsMatch[1]
            .split(',')
            .map(s => s.trim().replace(/"/g, '').replace(/'/g, ''))
            .filter(s => s.length > 0);

        for (const blockedDomain of blockedDomains) {
            if (domain === blockedDomain || domain.endsWith('.' + blockedDomain)) {
                return true;
            }
        }
    }

    return false;
}

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url} Host: ${req.headers.host}`);
    next();
});

app.get('/proxy.pac', (req, res) => {
    console.log('Serving PAC file');
    res.set('Content-Type', 'application/x-ns-proxy-autoconfig');
    res.send(pacFileContent);
});

app.get('/', (req, res) => {
    const httpsEnabled = fs.existsSync(`/etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem`);
    console.log('Serving status page');
    res.send(`
        <!DOCTYPE html><html><head><title>Proxy Server Status</title><style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .status { padding: 15px; background-color: #d4edda; border-radius: 4px; color: #155724; margin-bottom: 15px; }
                .warning { padding: 15px; background-color: #fff3cd; border-radius: 4px; color: #856404; margin-bottom: 15px; }
                h1 { color: #333; }
                code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
                table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
            </style></head>
        <body><h1>Proxy Server Status</h1><div class="status"><p>✅ HTTP proxy server is running</p>
        ${httpsEnabled ? '<p>✅ HTTPS proxy server is running with Let\'s Encrypt</p>' : '<p>⚠️ HTTPS not enabled</p>'}
        </div><h2>Configuration</h2><table><tr><th>Service</th><th>URL</th></tr>
        <tr><td>PAC File (HTTP)</td><td><code>http://${DOMAIN_NAME}:${DEFAULT_PORT}/proxy.pac</code></td></tr>
        ${httpsEnabled ? `<tr><td>PAC File (HTTPS)</td><td><code>https://${DOMAIN_NAME}:${EXTERNAL_HTTPS_PORT}/proxy.pac</code></td></tr>` : ''}
        <tr><td>Local Testing</td><td><code>http://localhost:${DEFAULT_PORT}/proxy.pac</code></td></tr>
        </table><h2>Usage Instructions</h2><p>To use this proxy, configure your browser to use the PAC file URL above.</p></body></html>
    `);
});

app.get('/test-pac', (req, res) => {
    console.log('Handling /test-pac request');
    const testUrl = req.query.url || 'https://tiktok.com';
    const parsedUrl = new URL(testUrl);
    const host = parsedUrl.hostname;
    let pacResult = 'DIRECT';
    if (isBlockedDomain(host)) {
        pacResult = `PROXY ${DOMAIN_NAME}:${EXTERNAL_HTTPS_PORT}`;
    }
    console.log(`Test PAC result for ${testUrl}: ${pacResult}`);
    res.json({ url: testUrl, host, result: pacResult });
});

const httpServer = http.createServer(app);
httpServer.on('connect', (req, clientSocket, head) => {
    const [host, port] = req.url.split(':');
    console.log(`HTTP - Received CONNECT request for: ${host}:${port || 443}`);
    if (isBlockedDomain(host)) {
        console.log(`HTTP - Blocking CONNECT request to: ${host}`);
        clientSocket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        clientSocket.write(blockedPageHTML);
        clientSocket.end();
        return;
    }
    const serverSocket = net.connect(port || 443, host, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        serverSocket.write(head);
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });
    serverSocket.on('error', (err) => console.error(`HTTP - Server socket error: ${err}`));
    clientSocket.on('error', (err) => console.error(`HTTP - Client socket error: ${err}`));
});

httpServer.listen(DEFAULT_PORT, '0.0.0.0', () => {
    console.log(`HTTP proxy server running on http://0.0.0.0:${DEFAULT_PORT}`);
    console.log(`PAC file available at http://${DOMAIN_NAME}:${DEFAULT_PORT}/proxy.pac`);
});

try {
    const certPath = `/etc/letsencrypt/live/${DOMAIN_NAME}`;
    const sslOptions = {
        key: fs.readFileSync(`${certPath}/privkey.pem`),
        cert: fs.readFileSync(`${certPath}/fullchain.pem`),
        ca: fs.readFileSync(`${certPath}/chain.pem`)
    };
    const httpsServer = https.createServer(sslOptions, app);
    httpsServer.on('connect', (req, clientSocket, head) => {
        const [host, port] = req.url.split(':');
        console.log(`HTTPS - Received CONNECT request for: ${host}:${port || 443}`);
        if (isBlockedDomain(host)) {
            console.log(`HTTPS - Blocking CONNECT request to: ${host}`);
            clientSocket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
            clientSocket.write(blockedPageHTML);
            clientSocket.end();
            return;
        }
        const serverSocket = net.connect(port || 443, host, () => {
            clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
            serverSocket.write(head);
            serverSocket.pipe(clientSocket);
            clientSocket.pipe(serverSocket);
        });
        serverSocket.on('error', (err) => console.error(`HTTPS - Server socket error: ${err}`));
        clientSocket.on('error', (err) => console.error(`HTTPS - Client socket error: ${err}`));
    });
    httpsServer.on('connection', (socket) => {
        console.log(`HTTPS - New connection from ${socket.remoteAddress}:${socket.remotePort}`);
    });
    httpsServer.listen(DEFAULT_HTTPS_PORT, '0.0.0.0', () => {
        console.log(`HTTPS proxy server running on https://0.0.0.0:${DEFAULT_HTTPS_PORT}`);
    });
} catch (error) {
    console.log('HTTPS server not started: Certificates not found');
}