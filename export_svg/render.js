const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve(__dirname, 'frames');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
} else {
  fs.readdirSync(outDir).forEach(f => fs.unlinkSync(path.join(outDir, f)));
}

const svgPath = path.resolve(__dirname, '..', 'vrfb_diagram_animated_passive_pouring.svg');

const fps = 60;
const duration = 16; // 16 seconds based on animation loops
const totalFrames = fps * duration;

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 3840, height: 2160 });

  const customHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body, html { margin: 0; padding: 0; background: #4AA2DF; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 3840px; height: 2160px; }
        svg { width: 3600px; height: 2160px; flex-shrink: 0; }
      </style>
    </head>
    <body>
      ${fs.readFileSync(svgPath, 'utf8')}
    </body>
    </html>
  `;
  
  await page.setContent(customHtml, { waitUntil: 'load' });
  
  // Wait a little for fonts/elements to initialize
  await new Promise(r => setTimeout(r, 1000));

  console.log("Pausing SVG animations...");
  await page.evaluate(() => {
    // Ensure all SVGs are paused
    document.querySelectorAll('svg').forEach(svg => svg.pauseAnimations());
  });
  
  console.log("Rendering frames...");
  for (let i = 0; i < totalFrames; i++) {
    const time = i / fps;
    await page.evaluate((t) => {
      document.querySelectorAll('svg').forEach(svg => svg.setCurrentTime(t));
    }, time);
    
    const framePath = path.join(outDir, `frame_${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath, omitBackground: true });
    
    if (i % 60 === 0) {
      console.log(`Rendered frame ${i} (${time.toFixed(2)}s)`);
    }
  }
  
  await browser.close();
  
  console.log("Frames rendered. Running ffmpeg to create MP4...");
  try {
    const mp4Path = path.resolve(__dirname, '..', 'vrfb_diagram_animated_passive_pouring_4k.mp4');
    if (fs.existsSync(mp4Path)) {
      fs.unlinkSync(mp4Path);
    }
    const ffmpegCmd = `ffmpeg -framerate ${fps} -i "${path.join(outDir, 'frame_%04d.png')}" -c:v libx264 -pix_fmt yuv420p -crf 12 "${mp4Path}"`;
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log("Done! Created:", mp4Path);
  } catch (e) {
    console.error("FFmpeg failed:", e);
  }
}

run().catch(console.error);
