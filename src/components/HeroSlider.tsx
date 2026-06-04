/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Facebook, Sparkles, ExternalLink, Leaf } from 'lucide-react';
import { sliderItems } from '../data';

// Helper array to assign gorgeous, sweet natural mehendi color themes to each slide vector backplate
const slideStyles = [
  {
    gradient: "from-[#F4EFE6] via-[#FAF6EE] to-[#FFEAEA]", 
    textColor: "text-slate-800",
    accentText: "text-[#5D7A5C]",
    leafColor: "text-[#8FA88B]/20"
  },
  {
    gradient: "from-[#E3ECE1] via-[#FAF6EE] to-[#FAF6EE]",
    textColor: "text-slate-800",
    accentText: "text-[#cfa856]",
    leafColor: "text-[#8FA88B]/25"
  },
  {
    gradient: "from-[#FAF6EE] via-[#FFEAEA] to-[#FAF6EE]",
    textColor: "text-slate-800",
    accentText: "text-[#5D7A5C]",
    leafColor: "text-pink-200/40"
  },
  {
    gradient: "from-[#F4EFE6] via-[#FAF6EE] to-[#E3ECE1]",
    textColor: "text-slate-800",
    accentText: "text-[#cfa856]",
    leafColor: "text-[#8FA88B]/20"
  },
  {
    gradient: "from-[#FAF6EE] via-[#F4EFE6] to-[#FFEAEA]",
    textColor: "text-slate-800",
    accentText: "text-[#5D7A5C]",
    leafColor: "text-[#8FA88B]/25"
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState(sliderItems[0]?.image || '');
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000); 
    return () => clearInterval(timer);
  }, [currentIndex]);

  // When current slide changes, reset image source and fallback tracker
  useEffect(() => {
    if (sliderItems[currentIndex]) {
      setImgSrc(sliderItems[currentIndex].image);
      setFallbackIndex(0);
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliderItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === sliderItems.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = () => {
    const currentItem = sliderItems[currentIndex];
    if (currentItem && currentItem.fallbacks && fallbackIndex < currentItem.fallbacks.length) {
      setImgSrc(currentItem.fallbacks[fallbackIndex]);
      setFallbackIndex((prev) => prev + 1);
    }
  };

  const activeStyle = slideStyles[currentIndex] || slideStyles[0];

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF6EE] py-6 sm:py-8 border-b border-[#EADFC9]/60">
      
      {/* Background Decorator Leaf Border & Vines */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-2xl text-[#8FA88B]/30 font-serif pointer-events-none select-none">
        🌿<br/>☘️<br/>🍃
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl text-[#8FA88B]/30 font-serif pointer-events-none select-none text-right">
        🌿<br/>☘️<br/>🍃
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Dynamic Canvas with Mehendi Leaf Design Patterns */}
        <div className="relative aspect-[16/9] sm:aspect-[16/7] md:aspect-[21/9] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-[#8FA88B]/20">
          
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full p-6 sm:p-12 md:p-16 flex flex-col justify-center items-start text-left bg-emerald-950"
            >
              {/* 100% Perfect Ratio Full Cover Background Image with fallback handling */}
              <img 
                src={imgSrc} 
                alt={sliderItems[currentIndex]?.titleEnglish}
                onError={handleImageError}
                className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none transition-transform duration-1000 scale-[1.02]"
                referrerPolicy="no-referrer"
              />

              {/* Secure elegant green/black gradient overlays that ensures 100% white-gold text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-950/50 to-transparent z-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0" />
              
              {/* Elegant organic mandala pattern watermark */}
              <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#5D7A5C_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
              
              {/* Corner Leaf Designs */}
              <div className="absolute top-6 right-8 text-4xl sm:text-6xl text-white/10 select-none pointer-events-none">
                🌿
              </div>
              <div className="absolute bottom-6 right-8 text-4xl sm:text-6xl text-white/10 select-none pointer-events-none">
                🌾
              </div>

              {/* Slider Details Container */}
              <div className="max-w-xl sm:max-w-2xl relative z-10">
                
                {/* Premium Simple Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 bg-amber-500/90 border border-amber-300 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md mb-3"
                >
                  <Sparkles className="h-3 w-3 text-amber-200 animate-pulse" />
                  <span>{sliderItems[currentIndex].badge}</span>
                </motion.div>

                {/* Simplified Sweet Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-3xl md:text-5xl font-serif font-black text-white leading-tight mb-2 font-bengali tracking-tight drop-shadow-md"
                >
                  {sliderItems[currentIndex].titleBangla}
                </motion.h2>

                {/* Subtitle English */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[10px] sm:text-xs font-bold text-amber-300 tracking-wider uppercase font-mono drop-shadow-sm"
                >
                  {sliderItems[currentIndex].titleEnglish}
                </motion.p>

                {/* Action CTA specifically linking to the target Facebook Post */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 sm:mt-6"
                >
                  <a
                    href={sliderItems[currentIndex].fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-[#cfa856] hover:from-amber-400 hover:to-amber-500 text-white text-[10px] sm:text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                  >
                    <Facebook className="h-4.5 w-4.5 text-white fill-white shrink-0" />
                    <span>ভেরিফাইড আসল নমুনা ফটো ফেসবুকে দেখুন ↗</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                </motion.div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* Simple navigation arrows with sweet color styles */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/70 hover:bg-[#FAF6EE] text-slate-700 hover:text-[#5D7A5C] border border-[#8FA88B]/25 flex items-center justify-center transition-all shadow-sm backdrop-blur-sm z-10"
            aria-label="Previous Slide"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/70 hover:bg-[#FAF6EE] text-slate-700 hover:text-[#5D7A5C] border border-[#8FA88B]/25 flex items-center justify-center transition-all shadow-sm backdrop-blur-sm z-10"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Progress indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-white/65 px-2.5 py-1 rounded-full backdrop-blur-sm border border-[#8FA88B]/10">
            {sliderItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-4.5 bg-[#5D7A5C]' 
                    : 'w-1.5 bg-slate-400/40 hover:bg-slate-400/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
