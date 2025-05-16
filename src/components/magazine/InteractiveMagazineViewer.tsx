'use client';

import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Howl } from 'howler';
import Image from 'next/image';
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';

// Set up the worker
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  } catch (error) {
    console.error('Error setting up PDF.js worker:', error);
  }
}

interface Page {
  id: number;
  imageUrl: string;
}

interface InteractiveMagazineViewerProps {
  pdfUrl: string;
}

export const InteractiveMagazineViewer: React.FC<InteractiveMagazineViewerProps> = ({
  pdfUrl,
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSound = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize page turn sound
    pageSound.current = new Howl({
      src: ['/sounds/page-turn.mp3'],
      volume: 0.5,
      onload: () => {
        console.log('Sound loaded');
      },
    });

    // Cleanup
    return () => {
      if (pageSound.current) {
        pageSound.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load the PDF document directly from the URL
        const pdf = await getDocument(pdfUrl).promise;
        const actualTotalPages = pdf.numPages;
        
        // Create page promises
        const pagePromises = Array.from({ length: actualTotalPages }, async (_, i) => {
          const page = await pdf.getPage(i + 1);
          const viewport = page.getViewport({ scale: 1.5 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (!context) throw new Error('Could not get canvas context');

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          return {
            id: i + 1,
            imageUrl: canvas.toDataURL('image/jpeg', 0.8),
          };
        });

        const loadedPages = await Promise.all(pagePromises);
        setPages(loadedPages);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF document');
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, [pdfUrl]);

  const Page = React.forwardRef<HTMLDivElement, { page: Page }>((props, ref) => {
    return (
      <div className="page" ref={ref}>
        <div className="page-content">
          <Image
            src={props.page.imageUrl}
            alt={`Page ${props.page.id}`}
            fill
            className="object-contain"
            priority={props.page.id <= 2}
          />
        </div>
      </div>
    );
  });
  Page.displayName = "Page";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="magazine-container">
      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={() => {
          if (pageSound.current) {
            pageSound.current.play();
          }
        }}
        className="magazine"
        style={{ background: 'white' }}
        startPage={0}
        drawShadow={true}
        flippingTime={1000}
        usePortrait={false}
        startZIndex={0}
        autoSize={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={0}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        {pages.map((page) => (
          <Page key={page.id} page={page} />
        ))}
      </HTMLFlipBook>

      <style jsx global>{`
        .magazine-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 1rem;
        }

        .magazine {
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }

        .page {
          background-color: white;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        .page-content {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .page.-right {
          border-left: 1px solid #ccc;
        }

        .page.-left {
          border-right: 1px solid #ccc;
        }

        @media (max-width: 768px) {
          .magazine-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}; 