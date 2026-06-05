/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';
const jannatHennaLogo = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQQ6JKGwb71171h7CiAV9S5ykk4aOvj_xb0NAdiM12T30BsZtjB";

interface HeaderProps {
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  ordersCount: number;
  scrollToSection: (id: string) => void;
  activeTab: 'shop' | 'orders';
  setActiveTab: (tab: 'shop' | 'orders') => void;
}

export default function Header({
  cart,
  setIsCartOpen,
  scrollToSection,
  activeTab,
  setActiveTab
}: HeaderProps) {
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#EADFC9]/70 shadow-sm px-4 py-3 md:py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Name Logo Frame with elegant Facebook Profile avatar logo */}
        <div className="flex items-center gap-3">
          <div className="shrink-0 relative group">
            <a
              href="https://www.facebook.com/share/19D7XXhtWS/"
              target="_blank"
              rel="noopener noreferrer"
              title="Visit Jannat's Henna Facebook Page"
              className="block cursor-pointer"
            >
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-full p-[2px] bg-gradient-to-tr from-[#cfa856] via-[#8FA88B] to-[#5D7A5C] shadow-lg hover:rotate-6 transition-transform duration-500 relative">
                <img
                  src={jannatHennaLogo}
                  alt="Jannat's Henna Facebook Profile Logo"
                  referrerPolicy="no-referrer"
                  className="h-full w-full rounded-full object-cover border border-white bg-[#FAF6EE]"
                />
                {/* Real-time floating online status indicator decoration */}
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md">
                  <span className="absolute top-0 left-0 h-full w-full rounded-full bg-emerald-500 animate-ping opacity-75" />
                </span>
              </div>
            </a>
          </div>

          <div className="text-left">
            <motion.h1 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-2xl md:text-3.5xl font-serif italic font-bold tracking-wider text-slate-800"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              id="brand-name-header"
            >
              Jannat's Henna
            </motion.h1>
            <p className="text-[10px] md:text-[11px] font-bold text-[#5D7A5C] tracking-widest mt-0.5 font-bengali">
              অর্গানিক মেহেদীর প্রাকৃতিক সৌন্দর্য
            </p>
          </div>
        </div>

        {/* Action Controls & Social follow (no tracking) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto">
          {/* Menu link to scroll to shop shelf only */}
          <nav className="flex items-center bg-[#FAF6EE] rounded-full p-1 border border-[#8FA88B]/25 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('shop'); scrollToSection('products-shelf'); }}
              className="px-4 py-2 rounded-full cursor-pointer bg-gradient-to-r from-[#5D7A5C] to-[#8FA88B] text-white shadow-sm border-t border-white/10"
            >
              আমাদের মেহেদী কালেকশন
            </button>
          </nav>

          {/* Facebook Official Page Link and Verification */}
          <a
            href="https://www.facebook.com/share/19D7XXhtWS/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/15 border border-[#1877F2]/20 text-[#1877F2] text-xs font-bold transition-all hover:scale-105"
          >
            <img
              src={jannatHennaLogo}
              alt="Jannat's Henna Mini Logo"
              referrerPolicy="no-referrer"
              className="h-4.5 w-4.5 rounded-full object-cover border border-[#1877F2]/20 shrink-0 shadow-sm"
            />
            <span>ফেসবুক পেজ</span>
          </a>

          {/* Cart Drawer Indicator */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-white hover:bg-[#FAF6EE] border border-[#8FA88B]/25 flex items-center justify-center text-slate-700 transition-all shadow-sm group cursor-pointer"
          >
            <ShoppingCart className="h-4.5 w-4.5 text-[#5D7A5C] group-hover:scale-110 transition-transform" />
            
            {totalCartItems > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                {totalCartItems}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
