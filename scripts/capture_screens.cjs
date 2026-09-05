const { spawn, execSync } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cloudDir = 'G:\\我的雲端硬碟\\給Jerry\\2026-09-05';
const artifactDir = 'C:\\Users\\User\\.gemini\\antigravity-cli\\brain\\7e234b0c-3051-4e74-bff1-4754dd131850';
const workspaceDir = 'D:\\MyProject\\bigmovie-finder';

// 1. Download QR Code for easy mobile scanning
function downloadQRCode() {
  return new Promise((resolve) => {
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=20&data=https://movie-hall-finder-taoyuan.surge.sh';
    const localQrPath = path.join(workspaceDir, 'qrcode_mobile.png');
    const file = fs.createWriteStream(localQrPath);
    https.get(qrUrl, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('QR Code generated at:', localQrPath);
        if (fs.existsSync(cloudDir)) {
          fs.copyFileSync(localQrPath, path.join(cloudDir, 'qrcode_mobile.png'));
          console.log('Synced QR Code to Cloud Directory!');
        }
        fs.copyFileSync(localQrPath, path.join(artifactDir, 'qrcode_mobile.png'));
        resolve(true);
      });
    }).on('error', (err) => {
      console.warn('QR Code download failed, skipping QR code:', err.message);
      resolve(false);
    });
  });
}

// 2. Views to capture
const views = [
  // Desktop Views
  { name: '01_main_dashboard.png', url: 'http://localhost:4173', size: '1440,1600' },
  { name: '02_hall_compare_pk.png', url: 'http://localhost:4173?view=compare', size: '1440,1200' },
  { name: '03_hall_spec_modal.png', url: 'http://localhost:4173?view=spec', size: '1440,1200' },
  { name: '04_ai_voice_agent_modal.png', url: 'http://localhost:4173?view=voice', size: '1440,1200' },
  { name: '05_theater_guide_modal.png', url: 'http://localhost:4173?view=guide', size: '1440,1200' },

  // Mobile Views (iPhone 14 / modern smartphone viewport)
  { name: 'mobile_01_main_hero.png', url: 'http://localhost:4173', size: '390,950' },
  { name: 'mobile_02_preference_drawer.png', url: 'http://localhost:4173?view=drawer', size: '390,950' },
  { name: 'mobile_03_hall_compare_pk.png', url: 'http://localhost:4173?view=compare', size: '390,950' },
  { name: 'mobile_04_hall_spec_modal.png', url: 'http://localhost:4173?view=spec', size: '390,950' },
  { name: 'mobile_05_theater_guide.png', url: 'http://localhost:4173?view=guide', size: '390,950' }
];

console.log('Starting preview server on port 4173...');
const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], { shell: true, cwd: workspaceDir });

function checkReady(attempts = 0) {
  if (attempts > 30) {
    console.error('Server did not start in time');
    preview.kill();
    process.exit(1);
  }
  http.get('http://localhost:4173', (res) => {
    if (res.statusCode === 200) {
      console.log('Preview server ready! Beginning capture sequence...');
      setTimeout(captureAll, 1500);
    } else {
      setTimeout(() => checkReady(attempts + 1), 500);
    }
  }).on('error', () => {
    setTimeout(() => checkReady(attempts + 1), 500);
  });
}

async function captureAll() {
  await downloadQRCode();

  for (const v of views) {
    const localPath = path.join(workspaceDir, v.name);
    const cmd = `"${chromePath}" --headless=new --disable-gpu --screenshot="${localPath}" --window-size=${v.size} "${v.url}"`;
    console.log(`Capturing [${v.size}]:`, v.name, 'from', v.url);
    try {
      execSync(cmd);
      console.log('  -> Saved to local workspace:', v.name);

      // Copy to Cloud Drive
      if (fs.existsSync(cloudDir)) {
        const destCloud = path.join(cloudDir, v.name);
        fs.copyFileSync(localPath, destCloud);
        console.log('  -> Synced to Cloud Drive:', destCloud);
      }

      // Copy to Artifact Directory
      const destArtifact = path.join(artifactDir, v.name);
      fs.copyFileSync(localPath, destArtifact);
    } catch (e) {
      console.error('Failed to capture', v.name, e.message);
    }
  }

  console.log('\nAll captures & syncs completed successfully!');
  preview.kill();
  process.exit(0);
}

checkReady();
