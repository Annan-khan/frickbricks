'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '@/types';

interface HeroBannerProps {
  banners: Banner[];
}

const defaultBannerSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 450' width='1200' height='450'%3E%3Cdefs%3E%3ClinearGradient id='redGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23b91c1c'/%3E%3Cstop offset='100%25' stop-color='%23991b1b'/%3E%3C/linearGradient%3E%3Cpattern id='brickGrid' width='60' height='30' patternUnits='userSpaceOnUse'%3E%3Crect width='58' height='28' fill='%23dc2626' rx='2' opacity='0.25'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='1200' height='450' fill='url(%23redGrad)'/%3E%3Crect width='1200' height='450' fill='url(%23brickGrid)'/%3E%3Ccircle cx='600' cy='225' r='120' fill='%23111827' stroke='%23f59e0b' stroke-width='6'/%3E%3Ctext x='600' y='215' dominant-baseline='middle' text-anchor='middle' font-family='Arial Black, Impact, sans-serif' font-weight='900' font-size='38' fill='%23ffffff' letter-spacing='2'%3EFIGBRICKS%3C/text%3E%3Ctext x='600' y='250' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-weight='700' font-size='14' fill='%23fcd34d' letter-spacing='3'%3ECOLLECTIBLE MINIFIGS%3C/text%3E%3Ctext x='600' y='390' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-weight='800' font-size='26' fill='%23ffffff'%3EWelcome to Figbricks%3C/text%3E%3C/svg%3E";

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const bannerList = banners.length > 0 ? banners : [
    {
      id: 'default-1',
      title: 'Welcome to FigBricks',
      imageUrl: defaultBannerSvg,
      linkUrl: '/products',
      isActive: true,
      order: 1
    }
  ];

  useEffect(() => {
    if (bannerList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerList.length]);

  const current = bannerList[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-[#b91c1c] aspect-[21/9] sm:aspect-[24/8] max-h-[440px]">
      <Link href={current.linkUrl || '/products'} className="block w-full h-full relative">
        <img
          src={current.imageUrl}
          alt={current.title || 'Figbricks Banner'}
          className="w-full h-full object-cover sm:object-contain object-center transition-all duration-700"
        />
      </Link>

      {bannerList.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + bannerList.length) % bannerList.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center transition shadow-md"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % bannerList.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center transition shadow-md"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
