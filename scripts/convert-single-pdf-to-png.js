// Script: convert-single-pdf-to-png.js
// Converts a single-page PDF to PNG using sharp and pdf-poppler (if available)
// Usage: node scripts/convert-single-pdf-to-png.js path/to/input.pdf path/to/output.png

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const [,, inputPdf, outputPng] = process.argv;
if (!inputPdf || !outputPng) {
  console.error('Usage: node scripts/convert-single-pdf-to-png.js <input.pdf> <output.png>');
  process.exit(1);
}

// Try using pdftoppm (from poppler-utils) first for best quality
try {
  execSync(`pdftoppm "${inputPdf}" "${outputPng.replace(/\.png$/, '')}" -png -singlefile`);
  if (fs.existsSync(outputPng)) {
    console.log(`Converted ${inputPdf} to ${outputPng} using pdftoppm.`);
    process.exit(0);
  }
} catch (e) {
  console.warn('pdftoppm not available or failed, falling back to sharp (lower quality for PDFs)');
}

// Fallback: Use sharp (works for raster PDFs, not vector/complex ones)
const sharp = require('sharp');
sharp(inputPdf)
  .png()
  .toFile(outputPng)
  .then(() => console.log(`Converted ${inputPdf} to ${outputPng} using sharp.`))
  .catch((err) => {
    console.error('Failed to convert PDF to PNG:', err);
    process.exit(1);
  });
