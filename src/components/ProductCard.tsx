/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ShoppingCart, Facebook, Check, Award, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onOrderNow: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart, onOrderNow }: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const increment = () => setQty((prev) => prev + 1);
  const decrement = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    onAddToCart(product, qty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative bg-[#FAF6EE] border border-[#8FA88B]/30 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#cfa856] transition-all duration-300 flex flex-col h-full"
      id={`product-card-${product.id}`}
    >
      {/* Premium organic badge */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EE]/95 border border-[#8FA88B]/30 text-[#5D7A5C] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#cfa856] animate-pulse" />
          <span>১০০% অর্গানিক হেনা</span>
        </span>
      </div>

      {/* Styled Card Image with Henna Outlines to prevent AI model/stock image clutter */}
      <a 
        href={product.fbImageLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-[4/3] w-full overflow-hidden bg-white border-b border-[#EADFC9]/50 cursor-pointer block group/img"
      >
        <img 
          src={product.image} 
          alt={product.nameBangla}
          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Active badges */}
        <div className="absolute bottom-3.5 left-3.5 z-10 flex gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-xs">
            রিয়েল ফটো 🌿
          </span>
        </div>

        {/* Hover activation reveal */}
        <div className="absolute inset-0 bg-[#5D7A5C]/90 flex flex-col items-center justify-center p-5 text-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-20">
          <Facebook className="h-10 w-10 text-white fill-white mb-2 animate-bounce" />
          <p className="text-[#FAF6EE] font-bengali font-semibold text-xs sm:text-sm px-2">
            অর্গানিক কোণের ফেসবুক রিভিউ ও লাইভ ডেমো ভিডিও দেখতে ক্লিক করুন
          </p>
          <span className="mt-3 px-4 py-2 rounded-xl bg-[#FAF6EE] text-[#5D7A5C] font-bold text-[10px] shadow-sm uppercase tracking-wider font-mono">
            FACEBOOK VIDEO ↗
          </span>
        </div>
      </a>

      {/* Information text block */}
      <div className="p-5 flex flex-col flex-grow text-left">
        {/* Product title and unit indicator */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-800 leading-tight">
              {product.nameBangla}
            </h3>
            <p className="text-[10px] text-[#5D7A5C] font-semibold tracking-wider font-mono mt-0.5 uppercase">
              {product.name}
            </p>
          </div>
          
          <div className="bg-[#8FA88B]/15 border border-[#8FA88B]/20 text-[#5D7A5C] px-2.5 py-1 rounded-full text-[11px] font-bold font-sans whitespace-nowrap shrink-0">
            {product.weightRange}
          </div>
        </div>

        {/* Simplistic user friendly Bangla description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 flex-grow">
          {product.description}
        </p>

        {/* Custom official Facebook direct redirection asset tracker */}
        <div className="mb-4">
          <a
            href={product.fbImageLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#cfa856] hover:text-amber-600 font-bold transition-all border border-[#cfa856]/20 hover:border-[#cfa856] px-3 py-1.5 rounded-lg bg-[#FAF6EE]"
          >
            <Facebook className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
            <span>ফেসবুকে আসল ছবি দেখুন ↗</span>
          </a>
        </div>

        {/* Counter and pricing bar */}
        <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-[#EADFC9]/60 mb-4 bg-[#F4EFE6] p-3 rounded-2xl border border-[#8FA88B]/20">
          <div className="flex flex-col pl-1.5">
            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">মূল্য (একক পিস)</span>
            <span className="text-2xl font-serif font-black text-rose-700 tracking-tight flex items-baseline">
              {product.price}<span className="text-xs font-bold text-slate-600 ml-0.5">টাকা</span>
            </span>
          </div>

          <div className="flex items-center bg-white border border-[#8FA88B]/25 rounded-xl p-0.5 shadow-xs">
            <button
              onClick={decrement}
              className="h-8 w-8 text-base font-bold text-[#5D7A5C] hover:bg-[#FAF6EE] rounded-lg flex items-center justify-center transition-all cursor-pointer"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-bold text-slate-800">
              {qty}
            </span>
            <button
              onClick={increment}
              className="h-8 w-8 text-base font-bold text-[#5D7A5C] hover:bg-[#FAF6EE] rounded-lg flex items-center justify-center transition-all cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Core CTA actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1 py-3.5 px-2 rounded-2xl text-xs font-bold transition-all duration-300 border shadow-sm cursor-pointer ${
              isAdded
                ? 'bg-[#5D7A5C] text-[#FAF6EE] border-[#5D7A5C]'
                : 'bg-white text-[#5D7A5C] border-[#8FA88B]/30 hover:border-[#5D7A5C] hover:bg-[#FAF6EE]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>যোগ হয়েছে!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>কার্ট যোগ</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOrderNow(product, qty)}
            className="flex items-center justify-center gap-1 py-3.5 px-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#cfa856] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-white hover:scale-[1.01] shadow-md shadow-amber-500/5 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5 stroke-[2]" />
            <span>অর্ডার করুন</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}
