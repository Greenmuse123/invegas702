'use client';

import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { pdfjs } from 'react-pdf';
import Image from 'next/image';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PageFlipViewerProps {
  pdfUrl: string;
  className?: string;
}

// Single page component
const Page = React.forwardRef<HTMLDivElement, { pageUrl: string; pageNumber: number }>(
  ({ pageUrl, pageNumber }, ref) => {
    return (
      <div ref={ref} className="page relative">
        <div className="page-content relative w-full h-full">
          {pageUrl ? (
            <div className="relative w-full h-full">
              <Image 
                src={pageUrl} 
                alt={`Page ${pageNumber}`} 
                fill
                className="object-contain"
                priority={pageNumber <= 2}
                unoptimized={true}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700" />
            </div>
          )}
        </div>
      </div>
    );
  }
);

Page.displayName = 'Page';

export default function PageFlipViewer({ pdfUrl, className = '' }: PageFlipViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageUrls, setPageUrls] = useState<string[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function convertPdfToImages() {
      try {
        setLoading(true);
        setError(null);

        if (!pdfUrl) {
          throw new Error('Invalid PDF URL');
        }

        // Use the full path as stored in the DB
        const storagePath = pdfUrl.replace(/^\/+/, '');
        
        console.log('Downloading PDF:', storagePath);
        
        const { data: pdfData, error: downloadError } = await supabase
          .storage
          .from('magazines-storage')
          .download(storagePath);

        if (downloadError) {
          console.error('Download error:', downloadError);
          throw new Error(`Download failed: ${downloadError.message}`);
        }

        if (!pdfData) {
          throw new Error('No PDF data received');
        }

        // Load the PDF document
        const pdfArrayBuffer = await pdfData.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: pdfArrayBuffer }).promise;
        setNumPages(pdf.numPages);
        
        // Create an array to store page URLs
        const urls: string[] = [];
        
        // Process each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const scale = 1.5; // Increased scale for better readability
          const viewport = page.getViewport({ scale });
          
          // Create a canvas for rendering
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          if (!context) {
            throw new Error('Failed to get canvas context');
          }
          
          // Render the page to the canvas
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          // Convert canvas to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Lower quality for better performance
          urls.push(dataUrl);
        }
        
        setPageUrls(urls);
        setLoading(false);
      } catch (err) {
        console.error('Error processing PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to process PDF');
        setLoading(false);
      }
    }

    convertPdfToImages();
  }, [pdfUrl, supabase]);

  // Handle page change
  const handlePageFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  // Navigation controls
  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, pageUrls.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-96">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mb-4" />
          <p className="text-gray-200">Loading magazine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`page-flip-viewer ${className}`}>
      <div className="flex flex-col items-center">
        {/* Controls - Top */}
        <div className="controls flex justify-center items-center gap-4 mb-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            title="Previous page (Left arrow)"
          >
            Previous
          </button>
          <span className="text-white px-2">
            Page {currentPage + 1} of {numPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === pageUrls.length - 1}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            title="Next page (Right arrow)"
          >
            Next
          </button>
        </div>
        
        {/* Book */}
        <div className="book-container relative mb-4">
          <HTMLFlipBook
            width={1200}
            height={1650}
            size="stretch"
            minWidth={700}
            maxWidth={1600}
            minHeight={1000}
            maxHeight={2200}
            showCover={true}
            flippingTime={1000}
            className="mx-auto shadow-2xl rounded-lg bg-black/90 overflow-x-auto"
            startPage={0}
            drawShadow={true}
            useMouseEvents={true}
            style={{}}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.5}
            mobileScrollSupport={true}
            clickEventForward={false}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
            ref={bookRef}
            onFlip={handlePageFlip}
          >
            {pageUrls.map((url, index) => (
              <Page 
                key={index} 
                pageUrl={url} 
                pageNumber={index + 1} 
              />
            ))}
          </HTMLFlipBook>
        </div>
      </div>
    </div>
  );
}
