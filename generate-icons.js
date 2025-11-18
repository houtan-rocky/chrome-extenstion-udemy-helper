// Script to generate Chrome extension icons
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// SVG icon template - simple calendar/date icon with Udemy purple theme
const iconSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#5624d0"/>
  <rect x="${size * 0.15}" y="${size * 0.2}" width="${size * 0.7}" height="${size * 0.65}" rx="${size * 0.05}" fill="#ffffff" opacity="0.95"/>
  <rect x="${size * 0.2}" y="${size * 0.3}" width="${size * 0.6}" height="${size * 0.08}" rx="${size * 0.02}" fill="#5624d0"/>
  <circle cx="${size * 0.35}" cy="${size * 0.55}" r="${size * 0.08}" fill="#5624d0"/>
  <circle cx="${size * 0.5}" cy="${size * 0.55}" r="${size * 0.08}" fill="#5624d0"/>
  <circle cx="${size * 0.65}" cy="${size * 0.55}" r="${size * 0.08}" fill="#5624d0"/>
  <circle cx="${size * 0.35}" cy="${size * 0.7}" r="${size * 0.08}" fill="#5624d0"/>
  <circle cx="${size * 0.5}" cy="${size * 0.7}" r="${size * 0.08}" fill="#5624d0"/>
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

