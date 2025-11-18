// Script to generate Chrome Web Store graphic assets
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create store-assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'store-assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Colors matching the extension theme
const colors = {
  primary: '#5624d0', // Udemy purple
  secondary: '#0f5132', // Dark green
  light: '#d1e7dd', // Light green
  white: '#ffffff',
  dark: '#333333',
  gray: '#6a6f73'
};

// Helper function to create SVG with text
function createPromoTileSVG(width, height, text, subtitle = '') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect x="0" y="${height - 60}" width="${width}" height="60" fill="${colors.white}" opacity="0.95"/>
  
  <!-- Calendar icon -->
  <g transform="translate(${width * 0.1}, ${height * 0.15})">
    <rect x="0" y="0" width="${width * 0.12}" height="${width * 0.12}" rx="${width * 0.02}" fill="${colors.white}" opacity="0.9"/>
    <rect x="${width * 0.015}" y="${width * 0.02}" width="${width * 0.09}" height="${width * 0.08}" rx="${width * 0.01}" fill="${colors.primary}"/>
    <circle cx="${width * 0.035}" cy="${width * 0.06}" r="${width * 0.008}" fill="${colors.white}"/>
    <circle cx="${width * 0.055}" cy="${width * 0.06}" r="${width * 0.008}" fill="${colors.white}"/>
    <circle cx="${width * 0.075}" cy="${width * 0.06}" r="${width * 0.008}" fill="${colors.white}"/>
    <circle cx="${width * 0.035}" cy="${width * 0.08}" r="${width * 0.008}" fill="${colors.white}"/>
    <circle cx="${width * 0.055}" cy="${width * 0.08}" r="${width * 0.008}" fill="${colors.white}"/>
  </g>
  
  <!-- Main text -->
  <text x="${width * 0.25}" y="${height * 0.35}" font-family="Arial, sans-serif" font-size="${width * 0.08}" font-weight="bold" fill="${colors.white}">${text}</text>
  
  <!-- Subtitle -->
  ${subtitle ? `<text x="${width * 0.25}" y="${height * 0.45}" font-family="Arial, sans-serif" font-size="${width * 0.04}" fill="${colors.white}" opacity="0.9">${subtitle}</text>` : ''}
  
  <!-- Bottom text -->
  <text x="${width * 0.05}" y="${height - 20}" font-family="Arial, sans-serif" font-size="${width * 0.025}" fill="${colors.dark}">See when courses were originally created</text>
  <text x="${width * 0.05}" y="${height - 5}" font-family="Arial, sans-serif" font-size="${width * 0.02}" fill="${colors.gray}">Make informed learning decisions on Udemy</text>
</svg>`;
}

// Helper function to create screenshot mockup
function createScreenshotSVG(width, height, title) {
  const isWide = width > 1000;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Browser chrome -->
  <rect width="${width}" height="${height}" fill="#f5f5f5"/>
  <rect x="0" y="0" width="${width}" height="40" fill="#e0e0e0"/>
  <circle cx="15" cy="20" r="6" fill="#ff5f57"/>
  <circle cx="35" cy="20" r="6" fill="#ffbd2e"/>
  <circle cx="55" cy="20" r="6" fill="#28ca42"/>
  <rect x="80" y="12" width="${width * 0.4}" height="16" rx="8" fill="#ffffff"/>
  <text x="${width * 0.5}" y="25" font-family="Arial, sans-serif" font-size="12" fill="#666" text-anchor="middle">www.udemy.com/course/example-course/</text>
  
  <!-- Page content area -->
  <rect x="0" y="40" width="${width}" height="${height - 40}" fill="#ffffff"/>
  
  <!-- Course header -->
  <rect x="0" y="40" width="${width}" height="${isWide ? 200 : 150}" fill="#1c1d1f"/>
  <rect x="${width * 0.05}" y="${isWide ? 80 : 60}" width="${width * 0.9}" height="3" fill="${colors.primary}"/>
  
  <!-- Course title -->
  <text x="${width * 0.05}" y="${isWide ? 130 : 100}" font-family="Arial, sans-serif" font-size="${isWide ? 32 : 24}" font-weight="bold" fill="#ffffff">${title}</text>
  
  <!-- Creation date badge -->
  <rect x="${width * 0.05}" y="${isWide ? 150 : 115}" width="${width * 0.25}" height="${isWide ? 35 : 28}" rx="4" fill="${colors.light}"/>
  <text x="${width * 0.07}" y="${isWide ? 172 : 135}" font-family="Arial, sans-serif" font-size="${isWide ? 14 : 12}" font-weight="500" fill="${colors.secondary}">Real Creation Date: ${isWide ? 'April 20, 2023' : '4/20/2023'}</text>
  
  <!-- Course info section -->
  <rect x="${width * 0.05}" y="${isWide ? 260 : 200}" width="${width * 0.9}" height="${isWide ? 2 : 1}" fill="#d1d7dc"/>
  
  <!-- Rating and students -->
  <circle cx="${width * 0.05 + 10}" cy="${isWide ? 290 : 230}" r="8" fill="#f3ca8c"/>
  <text x="${width * 0.05 + 25}" y="${isWide ? 295 : 235}" font-family="Arial, sans-serif" font-size="${isWide ? 14 : 12}" fill="#333">4.7</text>
  <text x="${width * 0.15}" y="${isWide ? 295 : 235}" font-family="Arial, sans-serif" font-size="${isWide ? 14 : 12}" fill="#6a6f73">(499 reviews)</text>
  <text x="${width * 0.35}" y="${isWide ? 295 : 235}" font-family="Arial, sans-serif" font-size="${isWide ? 14 : 12}" fill="#6a6f73">6,562 students</text>
  
  <!-- What you'll learn section -->
  <text x="${width * 0.05}" y="${isWide ? 340 : 270}" font-family="Arial, sans-serif" font-size="${isWide ? 20 : 16}" font-weight="bold" fill="#333">What you'll learn</text>
  <circle cx="${width * 0.07}" cy="${isWide ? 370 : 295}" r="4" fill="${colors.primary}"/>
  <text x="${width * 0.09}" y="${isWide ? 375 : 300}" font-family="Arial, sans-serif" font-size="${isWide ? 14 : 12}" fill="#333">Assembly Language Basics</text>
  <circle cx="${width * 0.07}" cy="${isWide ? 400 : 320}" r="4" fill="${colors.primary}"/>
  <text x="${width * 0.09}" y="${isWide ? 405 : 325}" font-family="Arial, sans-serif" font-size="${isWide ? 14 : 12}" fill="#333">Reverse Engineering</text>
  
  <!-- Extension popup mockup (if wide) -->
  ${isWide ? `
  <rect x="${width * 0.65}" y="${isWide ? 280 : 220}" width="280" height="350" rx="8" fill="#ffffff" stroke="#d1d7dc" stroke-width="2"/>
  <rect x="${width * 0.65}" y="${isWide ? 280 : 220}" width="280" height="60" rx="8" fill="#f9f9f9"/>
  <text x="${width * 0.79}" y="${isWide ? 310 : 250}" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#333" text-anchor="middle">Udemy Course Insights</text>
  <rect x="${width * 0.67}" y="${isWide ? 360 : 300}" width="260" height="120" rx="6" fill="#f9f9f9"/>
  <text x="${width * 0.67 + 10}" y="${isWide ? 385 : 325}" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#333">${title.substring(0, 40)}...</text>
  <rect x="${width * 0.67 + 10}" y="${isWide ? 410 : 350}" width="240" height="50" rx="4" fill="#e8f5e9" stroke="#c8e6c9" stroke-width="1"/>
  <text x="${width * 0.67 + 20}" y="${isWide ? 430 : 370}" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#2e7d32">Real Creation Date</text>
  <text x="${width * 0.67 + 20}" y="${isWide ? 450 : 390}" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#388e3c">April 20, 2023</text>
  ` : ''}
</svg>`;
}

async function generateAssets() {
  console.log('Generating Chrome Web Store assets...\n');

  // 1. Store icon (128x128) - copy existing or regenerate
  console.log('✓ Store icon (128x128) - using existing icon128.png');
  
  // 2. Small promo tile (440x280)
  console.log('Generating small promo tile (440x280)...');
  const smallPromoSVG = createPromoTileSVG(440, 280, 'Udemy Course Insights', 'See Real Creation Dates');
  await sharp(Buffer.from(smallPromoSVG))
    .png()
    .toFile(path.join(assetsDir, 'small-promo-tile.png'));
  console.log('✓ Created small-promo-tile.png');

  // 3. Marquee promo tile (1400x560)
  console.log('Generating marquee promo tile (1400x560)...');
  const marqueePromoSVG = createPromoTileSVG(1400, 560, 'Udemy Course Insights', 'Discover when courses were originally created');
  await sharp(Buffer.from(marqueePromoSVG))
    .png()
    .toFile(path.join(assetsDir, 'marquee-promo-tile.png'));
  console.log('✓ Created marquee-promo-tile.png');

  // 4. Screenshots (1280x800 and 640x400)
  console.log('Generating screenshots...');
  
  // Screenshot 1: Wide (1280x800) - Main course page
  const screenshot1SVG = createScreenshotSVG(1280, 800, 'Assembly Language Programming for Reverse Engineering');
  await sharp(Buffer.from(screenshot1SVG))
    .png()
    .toFile(path.join(assetsDir, 'screenshot-1-1280x800.png'));
  console.log('✓ Created screenshot-1-1280x800.png');

  // Screenshot 2: Wide (1280x800) - Extension popup
  const screenshot2SVG = createScreenshotSVG(1280, 800, 'Complete Web Development Bootcamp');
  await sharp(Buffer.from(screenshot2SVG))
    .png()
    .toFile(path.join(assetsDir, 'screenshot-2-1280x800.png'));
  console.log('✓ Created screenshot-2-1280x800.png');

  // Screenshot 3: Small (640x400) - Mobile view
  const screenshot3SVG = createScreenshotSVG(640, 400, 'Python for Data Science');
  await sharp(Buffer.from(screenshot3SVG))
    .png()
    .toFile(path.join(assetsDir, 'screenshot-3-640x400.png'));
  console.log('✓ Created screenshot-3-640x400.png');

  console.log('\n✅ All assets generated successfully!');
  console.log('\n📁 Files created in store-assets/ folder:');
  console.log('  - small-promo-tile.png (440x280)');
  console.log('  - marquee-promo-tile.png (1400x560)');
  console.log('  - screenshot-1-1280x800.png');
  console.log('  - screenshot-2-1280x800.png');
  console.log('  - screenshot-3-640x400.png');
  console.log('\n📝 Note: Store icon (128x128) should use icons/icon128.png');
  console.log('\n🎥 For promo video:');
  console.log('   Create a 30-60 second video showing:');
  console.log('   1. Opening a Udemy course page');
  console.log('   2. The creation date appearing automatically');
  console.log('   3. Clicking the extension icon to see the popup');
  console.log('   4. Comparing different courses');
}

generateAssets().catch(console.error);

