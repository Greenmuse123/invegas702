const fs = require('fs');
const path = require('path');

// Get the worker file path from node_modules
const workerPath = path.join(
  process.cwd(),
  'node_modules',
  'pdfjs-dist',
  'build',
  'pdf.worker.min.js'
);

const outputPath = path.join(process.cwd(), 'public', 'pdf.worker.min.js');

// Create public directory if it doesn't exist
if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

// Copy the worker file
try {
  fs.copyFileSync(workerPath, outputPath);
  console.log('PDF worker copied to public directory');
} catch (err) {
  console.error('Error copying PDF worker:', err);
} 