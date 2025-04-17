'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  totalPages: number;
}

export default function PDFViewer({ pdfUrl, totalPages }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(totalPages);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  };

  const goToPage = (page: number) => {
    setPageNumber(Math.max(1, Math.min(page, numPages)));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-black border border-red-900 rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={zoomOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            -
          </button>
          <span className="text-white">{(scale * 100).toFixed(0)}%</span>
          <button
            onClick={zoomIn}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div 
        ref={containerRef}
        className="relative w-full bg-white rounded-lg overflow-hidden"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white">Loading PDF...</div>
          </div>
        )}
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="text-white">Loading PDF...</div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="mx-auto"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* Page Navigation */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <input
          type="number"
          min="1"
          max={numPages}
          value={pageNumber}
          onChange={(e) => goToPage(parseInt(e.target.value))}
          className="w-20 px-2 py-1 bg-black border border-red-900 text-white rounded"
        />
        <span className="text-white">of {numPages}</span>
      </div>
    </div>
  );
} 