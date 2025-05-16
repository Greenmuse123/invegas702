// Node.js script to generate a cover image (PNG) from the first page of each PDF in a directory
// and upload it to Supabase Storage. Requires: pdf-lib, sharp, @supabase/supabase-js
require('dotenv').config({ path: '.env.local' });
console.log('Loaded env:', {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
});
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');

// CONFIGURE THESE
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = 'magazines-storage';
const PDF_DIR = path.join(__dirname, '../public/magazines'); // where your PDFs are stored locally
const COVER_DIR = path.join(__dirname, '../public/magazine-covers'); // where to save covers locally

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function generateCover(pdfPath, coverPath) {
  // Read PDF and extract first page as PNG
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const [firstPage] = await pdfDoc.copyPages(pdfDoc, [0]);
  const singlePagePdf = await PDFDocument.create();
  singlePagePdf.addPage(firstPage);
  const singlePageBytes = await singlePagePdf.save();

  // Save the single-page PDF temporarily
  const tempSinglePagePdf = coverPath.replace(/\.png$/, '.pdf');
  fs.writeFileSync(tempSinglePagePdf, singlePageBytes);

  // Convert single-page PDF to PNG using the helper script (uses pdftoppm/sharp)
  try {
    execSync(`node ./scripts/convert-single-pdf-to-png.js "${tempSinglePagePdf}" "${coverPath}"`, { stdio: 'inherit' });
    fs.unlinkSync(tempSinglePagePdf); // Clean up temp PDF
  } catch (e) {
    console.error('Failed to convert PDF to PNG:', e);
  }
}

async function uploadCoverToSupabase(coverPath, remotePath) {
  const coverBuffer = fs.readFileSync(coverPath);
  const { data, error } = await supabase.storage.from(BUCKET).upload(remotePath, coverBuffer, {
    contentType: 'image/png',
    upsert: true,
  });
  if (error) {
    console.error(`Error uploading ${remotePath}:`, error);
    return null;
  } else {
    console.log(`Uploaded cover to ${remotePath}`);
    return remotePath;
  }
}

async function updateMagazineCoverUrl(magazine, coverStoragePath) {
  // Update the cover_image_url column in the magazines table for this magazine
  const { error } = await supabase
    .from('magazines')
    .update({ cover_image_url: coverStoragePath })
    .eq('id', magazine.id);
  if (error) {
    console.error(`Failed to update cover_image_url for magazine ${magazine.id}:`, error);
  } else {
    console.log(`Updated magazine ${magazine.id} cover_image_url to ${coverStoragePath}`);
  }
}

async function main() {
  if (!fs.existsSync(COVER_DIR)) fs.mkdirSync(COVER_DIR);
  // Fetch all magazines from Supabase
  const { data: magazines, error } = await supabase.from('magazines').select('*');
  if (error) {
    console.error('Failed to fetch magazines:', error);
    process.exit(1);
  }
  for (const magazine of magazines) {
    const pdfFile = path.basename(magazine.pdf_url);
    const pdfPath = path.join(PDF_DIR, pdfFile);
    const coverFile = pdfFile.replace(/\.pdf$/, '.png');
    const coverPath = path.join(COVER_DIR, coverFile);
    const coverStoragePath = `covers/${coverFile}`;
    if (!fs.existsSync(pdfPath)) {
      console.warn(`PDF not found locally: ${pdfPath}`);
      continue;
    }
    console.log(`Generating cover for ${magazine.title}...`);
    await generateCover(pdfPath, coverPath);
    const uploadedPath = await uploadCoverToSupabase(coverPath, coverStoragePath);
    if (uploadedPath) {
      await updateMagazineCoverUrl(magazine, uploadedPath);
    }
  }
}

main().catch(console.error);
