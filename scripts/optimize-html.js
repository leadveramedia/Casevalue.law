const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../build/index.html');
const buildDir = path.join(__dirname, '../build');

// Read the HTML file
let html = fs.readFileSync(htmlPath, 'utf8');

// Find the CSS file reference
const cssMatch = html.match(/<link href="([^"]*\.css)"[^>]*rel="stylesheet">/);
if (cssMatch) {
  const cssPath = cssMatch[1];
  const cssFullPath = path.join(buildDir, cssPath);

  console.log(`📦 Found CSS file: ${cssPath}`);

  // Read the CSS file
  if (fs.existsSync(cssFullPath)) {
    const cssContent = fs.readFileSync(cssFullPath, 'utf8');
    const cssSize = (cssContent.length / 1024).toFixed(2);

    console.log(`📏 CSS size: ${cssSize} KB`);

    // Inline the CSS (replace the link tag with a style tag)
    html = html.replace(
      /<link href="[^"]*\.css"[^>]*rel="stylesheet">/g,
      `<style>${cssContent}</style>`
    );

    // Remove CSS preload hints since we're inlining
    html = html.replace(
      /<link href="[^"]*\.css" rel="preload" as="style"[^>]*>/g,
      ''
    );

    console.log('✅ CSS inlined into HTML');
  } else {
    console.log('⚠️  CSS file not found, skipping inline');
  }
}

// Add fetchpriority to critical resources
html = html.replace(
  /<link href="([^"]*main[^"]*\.js)" rel="preload" as="script">/g,
  '<link href="$1" rel="preload" as="script" fetchpriority="high">'
);

// Lower priority for vendor chunks
html = html.replace(
  /<link href="([^"]*vendors[^"]*\.js)" rel="preload" as="script">/g,
  '<link href="$1" rel="preload" as="script" fetchpriority="low">'
);

// Write the optimized HTML back
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('✅ HTML optimized - CSS inlined, fetchpriority added');
