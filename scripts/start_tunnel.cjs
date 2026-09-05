const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');

const workspaceDir = 'D:\\MyProject\\bigmovie-finder';
const distDir = path.join(workspaceDir, 'dist');
const port = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Static server running on port ${port} serving dist/`);
  startTunnel();
});

function startTunnel() {
  console.log('Starting Cloudflare Tunnel on port 8080...');
  const cloudflared = spawn(path.join(workspaceDir, 'cloudflared.exe'), ['tunnel', '--url', `http://localhost:${port}`], { cwd: workspaceDir });

  cloudflared.stderr.on('data', (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match) {
      const tunnelUrl = match[0];
      console.log('\n========================================');
      console.log('CLOUDFLARE TUNNEL LIVE URL:', tunnelUrl);
      console.log('========================================\n');
      fs.writeFileSync(path.join(workspaceDir, 'tunnel_url.txt'), tunnelUrl);

      // Download updated QR code for this tunnel URL
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=20&data=${encodeURIComponent(tunnelUrl)}`;
      const qrPath = path.join(workspaceDir, 'qrcode_mobile.png');
      const cloudDir = 'G:\\我的雲端硬碟\\給Jerry\\2026-09-05';

      const file = fs.createWriteStream(qrPath);
      https.get(qrUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          if (fs.existsSync(cloudDir)) {
            fs.copyFileSync(qrPath, path.join(cloudDir, 'qrcode_mobile.png'));
            console.log('Updated QR Code in Google Drive!');
          }
        });
      });
    }
  });
}
