'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Set worker source and version
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string | Blob;
  className?: string;
}

export default function PDFViewer({ pdfUrl, className = '' }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchPdf() {
      try {
        setLoading(true);
        setError(null);

        // If it's already a blob, use it directly
        if (pdfUrl instanceof Blob) {
          setPdfBlob(pdfUrl);
          return;
        }

        // Use the full path as stored in the DB
        const storagePath = typeof pdfUrl === 'string' ? pdfUrl.replace(/^\/+/, '') : pdfUrl;
        
        if (!storagePath) {
          throw new Error('Invalid PDF path');
        }

        console.log('Downloading PDF:', storagePath);
        
        const { data, error: downloadError } = await supabase
          .storage
          .from('magazines-storage')
          .download(storagePath);

        if (downloadError) {
          console.error('Download error:', downloadError);
          throw new Error(`Download failed: ${downloadError.message}`);
        }

        if (!data) {
          throw new Error('No PDF data received');
        }

        setPdfBlob(data);
      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    }

    fetchPdf();
  }, [pdfUrl, supabase]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(err: Error) {
    console.error('Error loading PDF:', err);
    setError(err.message);
    setLoading(false);
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`pdf-viewer ${className}`}>
      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700" />
        </div>
      )}
      
      {pdfBlob && (
        <Document
          file={pdfBlob}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700" />
            </div>
          }
        >
          <div className="flex flex-col items-center max-w-full">
            {Array.from(new Array(numPages || 0), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                className="mb-8 shadow-lg"
                scale={1.4}
                loading={
                  <div className="flex items-center justify-center p-4 h-[600px] w-[450px]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700" />
                  </div>
                }
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={600}
              />
            ))}
          </div>
        </Document>
      )}
    </div>
  );
}