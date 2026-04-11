const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const W = 1920;
const H = 1080;
const fps = 60;
const outDir = path.resolve(__dirname, 'frames_react');
if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir); } else { fs.readdirSync(outDir).forEach(f => fs.unlinkSync(path.join(outDir, f))); }

const bgPath = "G:\\Github\\ME-FYP-video\\images\\Campus0002.jpg";
const bgBase64 = `data:image/jpeg;base64,${fs.readFileSync(bgPath, 'base64')}`;

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H });
  
  // Inject rAF mock so we can perfectly control Framer Motion time
  await page.evaluateOnNewDocument(() => {
    window._time = 0;
    
    // Framer motion uses performance.now()
    window.performance.now = () => window._time;
    
    window._rafCallbacks = new Set();
    window.requestAnimationFrame = (cb) => {
      window._rafCallbacks.add(cb);
      return Math.random();
    };
    // Don't perfectly stub cancel, just ignore
    window.cancelAnimationFrame = (id) => {};
    
    window._stepTime = (dtMs) => {
      window._time += dtMs;
      // Copy callbacks because framer might request new frames during the callback execution
      const cbs = Array.from(window._rafCallbacks);
      window._rafCallbacks.clear();
      cbs.forEach(cb => cb(window._time));
    };
  });
  
  console.log("Loading Vite Dev Server...");
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  
  // Wait a moment for React hydration
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("Setting up view...");
  // Navigate to Vandi tab
  await page.evaluate(() => {
    // Click 'Vandi' tab button.
    const btns = document.querySelectorAll('nav button');
    Array.from(btns).find(b => b.textContent === 'Vandi' && !b.textContent.includes('3D'))?.click();
  });
  
  // Wait for the SVG to mount
  await page.waitForSelector('svg');
  
  await page.evaluate((bg) => {
    // Hide UI
    const style = document.createElement('style');
    style.textContent = `
      header, nav, p, h2, span, input, button { visibility: hidden !important; opacity: 0 !important; }
      body, html, main { margin: 0 !important; padding: 0 !important; overflow: hidden; background: none !important; }
      
      /* Make Vandi big and centered! */
      section { border: none !important; background: none !important; box-shadow: none !important; }
      
      .vandi-svg-container { 
        position: fixed !important; 
        top: 50% !important; 
        left: 50% !important; 
        transform: translate(-50%, -50%) scale(2.2) !important; 
        z-index: 9999 !important;
        width: 500px !important;
        height: 500px !important;
      }
      
      /* Setup background */
      #bg-injector {
        background: url('${bg}') center/cover no-repeat; 
        width: 1920px; 
        height: 1080px; 
        position: fixed; 
        top:0; 
        left:0; 
        z-index: -10;
      }
    `;
    document.head.appendChild(style);
    
    const bgDiv = document.createElement('div');
    bgDiv.id = 'bg-injector';
    document.body.appendChild(bgDiv);
    
    // We also need to target the SVG specifically if we can't label the container wrapper easily.
    const containerDiv = document.querySelector('svg').parentElement;
    if (containerDiv) {
      containerDiv.className = 'vandi-svg-container';
      containerDiv.style.margin = '0'; // cancel any arbitrary margins
    }
  }, bgBase64);
  
  await page.evaluate(() => {
    document.querySelector('svg').pauseAnimations();
  });
  
  await new Promise(r => setTimeout(r, 500));
  console.log("Starting render loop...");
  
  const totalFrames = 12 * fps;
  const dt = 1000 / fps; // 16.666ms

  for (let i = 0; i < totalFrames; i++) {
    // We inject clicks at exact frames
    // 0s-1s: Default
    // 1s-6s: Waving
    // 6s-8s: Sad
    // 8s-12s: Happy
    
    if (i === 1 * fps) {
      await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Waving')?.click());
    } else if (i === 6 * fps) {
      await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Sad')?.click());
    } else if (i === 8 * fps) {
      await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Happy')?.click());
    }
    
    // Step time precisely to drive Framer Motion
    await page.evaluate((d) => window._stepTime(d), dt);
    
    // Advance native SMIL timelines
    const t = i / fps;
    await page.evaluate((currTime) => {
      document.querySelector('svg').setCurrentTime(currTime);
    }, t);
    
    const framePath = path.join(outDir, `frame_${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath, omitBackground: false });
    
    if (i % 60 === 0) console.log(`Rendered frame ${i} (${(i/fps).toFixed(2)}s)`);
  }
  
  await browser.close();
  
  console.log("Frames rendered. Running ffmpeg to create MP4...");
  try {
    const mp4Path = path.resolve(__dirname, '..', 'vandi_frontend_compilation.mp4');
    if (fs.existsSync(mp4Path)) {
      fs.unlinkSync(mp4Path);
    }
    const ffmpegCmd = `ffmpeg -framerate ${fps} -i "${path.join(outDir, 'frame_%04d.png')}" -c:v libx264 -pix_fmt yuv420p -crf 14 "${mp4Path}"`;
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log("Done! Created:", mp4Path);
  } catch (e) {
    console.error("FFmpeg failed:", e);
  }
}

run().catch(console.error);
