'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';

export const Hero = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Las Vegas Skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 to-secondary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container min-h-screen flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
          Welcome to InVegas702
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl">
          Your ultimate guide to the best experiences in Las Vegas. Discover the city's hidden gems, exclusive events, and unforgettable moments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="default" size="lg">
            Explore Events
          </Button>
          <Button variant="outline" size="lg">
            Read Articles
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
}; 