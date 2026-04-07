const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..');
const outDir = path.resolve(__dirname, 'output');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const cloudSvgPath = path.resolve(srcDir, 'thought_cloud.svg');
const cloudIdeaSvgPath = path.resolve(srcDir, 'thought_cloud_idea.svg');

// Using Base64 data URIs so Puppeteer doesn't block local file:// origins
const getBase64Image = (filePath) => {
  const data = fs.readFileSync(filePath, 'base64');
  return `data:image/svg+xml;base64,${data}`;
};

const cloudUrl = getBase64Image(cloudSvgPath);
const cloudIdeaUrl = getBase64Image(cloudIdeaSvgPath);

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const files = fs.readdirSync(srcDir).filter(f => f.startsWith('vandi_front') && f.endsWith('.svg'));
  
  for (const file of files) {
    let cloudHtml = '';
    
    // Only include cloud for thinking and thinking_two
    if (file.includes('thinking')) {
      let cloudSrc = cloudUrl;
      if (file.includes('thinking_two')) {
        cloudSrc = cloudIdeaUrl;
      }
      // Vandi is centered at 250, 250 in a 500x500 box.
      // Cloud is rendered at x=50, y=-215 from center, so left=300, top=35.
      // And it's scaled to 0.8
      cloudHtml = `<img id="cloud" src="${cloudSrc}">`;
    }
    
    const vandiUrl = getBase64Image(path.resolve(srcDir, file));
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; }
          #container {
            position: relative;
            width: 650px;
            height: 500px;
          }
          #vandi {
            position: absolute;
            left: 0;
            top: 0;
            width: 500px;
            height: 500px;
          }
          #cloud {
            position: absolute;
            left: 300px;
            top: 35px;
            width: 250px;
            height: 200px;
            transform: scale(0.8);
            transform-origin: center;
          }
        </style>
      </head>
      <body>
        <div id="container">
          <img id="vandi" src="${vandiUrl}">
          ${cloudHtml}
        </div>
      </body>
      </html>
    `;
    
    await page.setContent(html, { waitUntil: 'load' });
    
    // Slight delay to ensure SVG filters/animations render if any frame 0
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const element = await page.$('#container');
    const outPath = path.resolve(outDir, file.replace('.svg', '.png'));
    
    await element.screenshot({ path: outPath, omitBackground: true });
    console.log(`Saved ${outPath}`);
  }

  await browser.close();
}

run().catch(console.error);
