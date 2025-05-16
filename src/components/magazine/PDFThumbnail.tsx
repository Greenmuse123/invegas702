"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Set workerSrc for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFThumbnailProps {
  pdfUrl: string;
  className?: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ pdfUrl, className }) => {
  console.log('[PDFThumbnail] pdfUrl:', pdfUrl);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const renderThumbnail = async () => {
      try {
        console.log('[PDFThumbnail] Attempting to load PDF:', pdfUrl);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context!, viewport }).promise;
        console.log('[PDFThumbnail] Successfully rendered first page of PDF:', pdfUrl);
      } catch (err) {
        console.error('[PDFThumbnail] Failed to load/render PDF:', pdfUrl, err);
        if (isMounted) setError('Failed to load cover');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    renderThumbnail();

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full w-full bg-gray-900 rounded ${className}`}>
        <span className="text-gray-400 text-xs">No cover</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center h-full w-full bg-gray-900 rounded ${className}`}>
      {loading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      ) : (
        <canvas ref={canvasRef} className="object-contain rounded h-full w-full" />
      )}
    </div>
  );
};

export default PDFThumbnail;
