const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve(__dirname, 'frames_vandi');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
} else {
  fs.readdirSync(outDir).forEach(f => fs.unlinkSync(path.join(outDir, f)));
}

const bgPath = "G:\\Github\\ME-FYP-video\\images\\Campus0002.jpg";
const file0 = "G:\\Github\\ME-FYP-video\\vandi profile\\vandi_front.svg";
const file1 = "G:\\Github\\ME-FYP-video\\vandi profile\\vandi_front_waving.svg";
const file2 = "G:\\Github\\ME-FYP-video\\vandi profile\\vandi_front_sad.svg";
const file3 = "G:\\Github\\ME-FYP-video\\vandi profile\\vandi_front_happy.svg";

// Base64 encode the background
const bgBase64 = `data:image/jpeg;base64,${fs.readFileSync(bgPath, 'base64')}`;

// SVGs
const svgs = [
  fs.readFileSync(file0, 'utf8'),
  fs.readFileSync(file1, 'utf8'),
  fs.readFileSync(file2, 'utf8'),
  fs.readFileSync(file3, 'utf8')
];

const fps = 60;
const duration = 12; // 12 seconds
const totalFrames = fps * duration;

// Video dimensions
const W = 1920;
const H = 1080;

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: W, height: H });

  const customHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body, html { margin: 0; padding: 0; background: transparent; overflow: hidden; }
        #bg {
          position: absolute; width: ${W}px; height: ${H}px;
          background-image: url('${bgBase64}');
          background-size: cover; background-position: center;
        }
        .vandi-container {
          position: absolute;
          width: 500px; height: 500px;
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          display: none;
        }
      </style>
    </head>
    <body>
      <div id="bg"></div>
      <div id="cont0" class="vandi-container"></div>
      <div id="cont1" class="vandi-container"></div>
      <div id="cont2" class="vandi-container"></div>
      <div id="cont3" class="vandi-container"></div>

      <script>
        const svgs = ${JSON.stringify(svgs)};
        // Use shadow DOM to isolate IDs
        for(let i=0; i<4; i++) {
          const cont = document.getElementById('cont' + i);
          const shadow = cont.attachShadow({mode: 'open'});
          shadow.innerHTML = svgs[i];
        }
      </script>
    </body>
    </html>
  `;
  
  await page.setContent(customHtml, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  console.log("Rendering frames...");
  for (let i = 0; i < totalFrames; i++) {
    const time = i / fps;
    await page.evaluate((t) => {
      // Logic for timeline
      // 0 - 1s: file0
      // 1 - 6s: file1
      // 6 - 8s: file2
      // 8 - 12s: file3
      let activeIndex = 0;
      let startTime = 0;
      if (t >= 1 && t < 6) { activeIndex = 1; startTime = 1; }
      else if (t >= 6 && t < 8) { activeIndex = 2; startTime = 6; }
      else if (t >= 8) { activeIndex = 3; startTime = 8; }

      for(let j=0; j<4; j++) {
        const cont = document.getElementById('cont' + j);
        const svgEles = cont.shadowRoot.querySelectorAll('svg');
        if (j === activeIndex) {
          cont.style.display = 'block';
          svgEles.forEach(s => s.setCurrentTime(t - startTime));
        } else {
          cont.style.display = 'none';
        }
      }
    }, time);
    
    const framePath = path.join(outDir, `frame_${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath, omitBackground: false });
    
    if (i % 60 === 0) {
      console.log(`Rendered frame ${i} (${time.toFixed(2)}s)`);
    }
  }
  
  await browser.close();
  
  console.log("Frames rendered. Running ffmpeg to create MP4...");
  try {
    const mp4Path = path.resolve(__dirname, '..', 'vandi_compilation.mp4');
    if (fs.existsSync(mp4Path)) {
      fs.unlinkSync(mp4Path);
    }
    const ffmpegCmd = `ffmpeg -framerate ${fps} -i "${path.join(outDir, 'frame_%04d.png')}" -c:v libx264 -pix_fmt yuv420p "${mp4Path}"`;
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log("Done! Created:", mp4Path);
  } catch (e) {
    console.error("FFmpeg failed:", e);
  }
}

run().catch(console.error);
