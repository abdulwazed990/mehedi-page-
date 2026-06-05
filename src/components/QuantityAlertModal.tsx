/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldCheck, Leaf, ShoppingBag, X } from 'lucide-react';

interface QuantityAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAutoCorrect?: () => void;
  onChooseDifferent?: () => void;
}

export default function QuantityAlertModal({ isOpen, onClose, onAutoCorrect, onChooseDifferent }: QuantityAlertModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 overflow-y-auto flex items-center justify-center p-4">
          
          {/* Symmetrical dark backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative bg-[#FAF6EE] border-2 border-[#8FA88B] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 text-center"
            id="quantity-alert-modal"
          >
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Warning Icon Graphic decoration */}
            <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-2xl border border-emerald-150 flex items-center justify-center text-[#5D7A5C] mb-5 relative">
              <ShoppingBag className="h-8 w-8 stroke-[1.8]" />
              <div className="absolute inset-0 rounded-2xl border-2 border-[#5D7A5C]/10 animate-ping pointer-events-none" />
            </div>

            {/* Bangla Warning Message Header */}
            <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-800 leading-tight font-bengali">
              ১টি হেনা আপনার কার্টে যুক্ত হয়েছে! 🌿
            </h3>
            
            <p className="text-[10px] text-[#5D7A5C] font-semibold tracking-widest uppercase font-mono mt-1 mb-4">
              MIX & MATCH ANY 2 PIECES
            </p>

            {/* Detail explanation in warm, friendly Bangla */}
            <div className="space-y-3.5 text-left bg-white/70 border border-[#8FA88B]/20 p-4 rounded-2xl mb-6">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bengali">
                অভিনন্দন! আপনার পছন্দের মেহেদীটি কার্টে যোগ করা হয়েছে। তবে আমাদের দ্রুত কুরিয়ার ডেলিভারি ও প্রিমিয়াম প্যাকেজিং সুবিধার জন্য <span className="font-bold text-[#5D7A5C] text-sm font-sans underline">কমপক্ষে ২টি</span> মেহেদী একসাথে অর্ডার করতে হবে।
              </p>
              
              <div className="flex gap-2 items-center text-[11px] font-bold text-emerald-800 bg-emerald-50/50 border border-emerald-100 px-3 py-2 rounded-xl font-bengali">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>আপনি চাইলে ভিন্ন ভিন্ন হেনা বা কম্বো ডিজাইন মিলিয়ে মোট ২ পিস অর্ডার পূরণ করতে পারবেন!</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5">
              {onChooseDifferent && (
                <button
                  onClick={() => {
                    onChooseDifferent();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#5D7A5C] to-[#8FA88B] hover:from-[#4C644B] hover:to-[#5D7A5C] shadow-md transition-all cursor-pointer group font-bengali"
                >
                  <Leaf className="h-4 w-4 animate-pulse" />
                  <span>অন্য আরেকটি মেহেদী পছন্দ করুন (শপে যান) 🌿</span>
                </button>
              )}

              {onAutoCorrect && (
                <button
                  onClick={() => {
                    onAutoCorrect();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-semibold text-[#2B4429] bg-[#EAF4E8] hover:bg-[#D6E8D4] border border-[#B1D5AD]/60 transition-all cursor-pointer font-bengali"
                >
                  <span>একই পণ্য ২টি নির্বাচন করে অর্ডার করুন ✨</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-2xl text-xs font-medium text-slate-450 hover:text-slate-605 transition-all cursor-pointer font-bengali"
              >
                ঠিক আছে, এমনিতেই ব্রাউজ করব
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
