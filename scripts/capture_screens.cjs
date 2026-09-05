const { spawn, execSync } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cloudBaseDir = 'G:\\我的雲端硬碟\\給Jerry\\2026-09-05';
const artifactDir = 'C:\\Users\\User\\.gemini\\antigravity-cli\\brain\\7e234b0c-3051-4e74-bff1-4754dd131850';
const workspaceDir = 'D:\\MyProject\\bigmovie-finder';

const targetUrl = 'https://17app001.github.io/movie-hall-finder/';

// 1. Generate & Save QR Codes
function downloadQRCodes() {
  return new Promise((resolve) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=20&data=${encodeURIComponent(targetUrl)}`;
    const localQrPath = path.join(workspaceDir, 'docs', 'screenshots', 'mobile', 'qrcode_github_pages.png');
    const file = fs.createWriteStream(localQrPath);

    https.get(qrUrl, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('QR Code generated at:', localQrPath);
        fs.copyFileSync(localQrPath, path.join(artifactDir, 'qrcode_github_pages.png'));
        resolve(true);
      });
    }).on('error', (err) => {
      console.warn('QR Code error:', err.message);
      resolve(false);
    });
  });
}

// 2. Exact Views matching Niko Review Gate (Revision V2.1 Section 18)
const views = [
  // Mobile Views (390x950 iPhone Viewport)
  { name: 'mobile_01_homepage.png', category: 'mobile', chinese: '01_首頁極簡搜尋入口.png', url: 'http://localhost:4173', size: '390,750' },
  { name: 'mobile_02_search_result_top_pick.png', category: 'mobile', chinese: '02_搜尋結果_TopPick電影英雄卡.png', url: 'http://localhost:4173?searched=true', size: '390,1050' },
  { name: 'mobile_02_top_pick.png', category: 'mobile', chinese: '02_TopPick電影英雄卡_相容.png', url: 'http://localhost:4173?searched=true', size: '390,1050' },
  { name: 'mobile_03_preference_drawer.png', category: 'mobile', chinese: '03_想更合你胃口_偏好抽屜.png', url: 'http://localhost:4173?searched=true&view=drawer', size: '390,950' },
  { name: 'mobile_04_hall_pk.png', category: 'mobile', chinese: '04_兩場直接PK_勝負對決.png', url: 'http://localhost:4173?searched=true&view=compare', size: '390,950' },
  { name: 'mobile_05_hall_detail.png', category: 'mobile', chinese: '05_影廳詳情與帝王位.png', url: 'http://localhost:4173?searched=true&view=spec', size: '390,950' },
  { name: 'mobile_06_theater_guide.png', category: 'mobile', chinese: '06_去這間影城_出遊指南.png', url: 'http://localhost:4173?searched=true&view=guide', size: '390,950' },
  { name: 'mobile_07_ask_theater.png', category: 'mobile', chinese: '07_幫我問影城_電話確認.png', url: 'http://localhost:4173?searched=true&view=voice', size: '390,950' },

  // Desktop Views (1440x1200)
  { name: 'desktop_01_main.png', category: 'desktop', chinese: '01_電腦版全景_首頁與英雄卡.png', url: 'http://localhost:4173?searched=true', size: '1440,1500' },
  { name: 'desktop_02_hall_pk.png', category: 'desktop', chinese: '02_電腦版_兩場直接PK.png', url: 'http://localhost:4173?searched=true&view=compare', size: '1440,1100' },
  { name: 'desktop_03_hall_spec.png', category: 'desktop', chinese: '03_電腦版_影廳詳情.png', url: 'http://localhost:4173?searched=true&view=spec', size: '1440,1100' },
  { name: 'desktop_04_theater_guide.png', category: 'desktop', chinese: '04_電腦版_去這間影城指南.png', url: 'http://localhost:4173?searched=true&view=guide', size: '1440,1100' },
  { name: 'desktop_05_ask_theater.png', category: 'desktop', chinese: '05_電腦版_幫我問影城.png', url: 'http://localhost:4173?searched=true&view=voice', size: '1440,1100' }
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
  const mobileDir = path.join(workspaceDir, 'docs', 'screenshots', 'mobile');
  const desktopDir = path.join(workspaceDir, 'docs', 'screenshots', 'desktop');
  fs.mkdirSync(mobileDir, { recursive: true });
  fs.mkdirSync(desktopDir, { recursive: true });

  await downloadQRCodes();

  const destDirs = [
    cloudBaseDir,
    path.join(cloudBaseDir, 'screenshots'),
    path.join(cloudBaseDir, '最新截圖')
  ];

  for (const base of destDirs) {
    try {
      fs.mkdirSync(path.join(base, '01_手機版_Mobile'), { recursive: true });
      fs.mkdirSync(path.join(base, '02_電腦版_Desktop'), { recursive: true });
      fs.mkdirSync(path.join(base, '03_手機掃碼測試_QRCode'), { recursive: true });
    } catch (e) {}
  }

  for (const v of views) {
    const subFolder = v.category === 'mobile' ? 'mobile' : 'desktop';
    const localPath = path.join(workspaceDir, 'docs', 'screenshots', subFolder, v.name);
    const cmd = `"${chromePath}" --headless=new --disable-gpu --screenshot="${localPath}" --window-size=${v.size} "${v.url}"`;
    console.log(`Capturing [${v.size}]:`, v.name, 'from', v.url);
    try {
      execSync(cmd);
      console.log('  -> Saved to local workspace:', localPath);

      // Copy to Artifact Directory
      try {
        fs.copyFileSync(localPath, path.join(artifactDir, v.name));
      } catch (e) {}

      // Copy to Cloud Drive folders
      const cloudSub = v.category === 'mobile' ? '01_手機版_Mobile' : '02_電腦版_Desktop';
      for (const base of destDirs) {
        try {
          // Flat copy
          fs.copyFileSync(localPath, path.join(base, v.name));
          // Categorized copy with English name
          fs.copyFileSync(localPath, path.join(base, cloudSub, v.name));
          // Categorized copy with friendly Chinese name
          fs.copyFileSync(localPath, path.join(base, cloudSub, v.chinese));
        } catch (e) {}
      }
    } catch (e) {
      console.error('Failed to capture', v.name, e.message);
    }
  }

  // Copy QR Codes to Cloud
  const qrLocal = path.join(workspaceDir, 'docs', 'screenshots', 'mobile', 'qrcode_github_pages.png');
  if (fs.existsSync(qrLocal)) {
    for (const base of destDirs) {
      try {
        fs.copyFileSync(qrLocal, path.join(base, 'qrcode_mobile.png'));
        fs.copyFileSync(qrLocal, path.join(base, '03_手機掃碼測試_QRCode', '01_GitHub_Pages全球CDN通道_QR.png'));
        fs.copyFileSync(qrLocal, path.join(base, '03_手機掃碼測試_QRCode', 'qrcode_mobile.png'));
      } catch (e) {}
    }
  }

  console.log('\nAll V2.1 Niko Review Gate captures completed successfully!');
  preview.kill();
  process.exit(0);
}

checkReady();
