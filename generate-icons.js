// Script to generate Chrome extension icons
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// SVG icon template - bold "U" letter to match store asset design
const iconSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6a39df"/>
      <stop offset="100%" stop-color="#4a1cb2"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg-${size})"/>
  <text
    x="50%"
    y="52%"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif"
    font-size="${size * 0.7}"
    font-weight="700"
    fill="#ffffff"
  >U</text>
</svg>`;

// Generate PNG files for different sizes
const sizes = [16, 48, 128];

async function generateIcons() {
  for (const size of sizes) {
    const svgContent = iconSVG(size);
    const svgBuffer = Buffer.from(svgContent);
    const pngPath = path.join(iconsDir, `icon${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    
    console.log(`✅ Generated icon${size}.png`);
  }
  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);

