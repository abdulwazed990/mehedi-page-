/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Gift, Flame, Sparkles, CheckCircle2, Leaf } from 'lucide-react';
import { CartItem } from '../types';

interface OfferBannerProps {
  cart: CartItem[];
  scrollToSection: (id: string) => void;
}

export default function OfferBanner({ cart, scrollToSection }: OfferBannerProps) {
  // Calculate total items in cart to provide dynamic gamified motivational feedback
  const totalQty = cart.reduce((val, item) => val + item.quantity, 0);

  let currentStatus = "";
  let progressPercentage = 0;
  let nextRewardMessage = "";

  if (totalQty === 0) {
    currentStatus = "🎁 আপনার প্রথম অর্ডারের জন্য বিশেষ ধামাকা ঈদ অফার অপেক্ষা করছে!";
    progressPercentage = 15;
    nextRewardMessage = "১ পিস যোগ করে প্রগ্রেস ট্র্যাকিং শুরু করুন";
  } else if (totalQty === 1) {
    currentStatus = "🚚 আর মাত্র ২ পিস যোগ করলেই পাচ্ছেন সম্পূর্ণ ফ্রি হোম ডেলিভারি!";
    progressPercentage = 33;
    nextRewardMessage = "২ পিস বাকি (ফ্রি ডেলিভারি পেতে)";
  } else if (totalQty === 2) {
    currentStatus = "🚚 আর মাত্র ১ পিস যোগ করলেই পাচ্ছেন সম্পূর্ণ ফ্রি হোম ডেলিভারি!";
    progressPercentage = 66;
    nextRewardMessage = "১ পিস বাকি (ফ্রি ডেলিভারি পেতে)";
  } else if (totalQty >= 3 && totalQty < 5) {
    const remains = 5 - totalQty;
    currentStatus = "🎉 অভিনন্দন! আপনি ইতিমধ্যেই ফ্রি ডেলিভারি আনলক করেছেন!";
    progressPercentage = 80;
    nextRewardMessage = `আর মাত্র ${remains} পিস কিনলেই ১টি মেহেদী একদম ফ্রি!`;
  } else if (totalQty >= 5 && totalQty < 10) {
    const remains = 10 - totalQty;
    currentStatus = "🎁 অসাধারণ! ফ্রি ডেলিভারি + ১টি প্রিমিয়াম মেহেদী ফ্রি পাচ্ছেন!";
    progressPercentage = 90;
    nextRewardMessage = `আর মাত্র ${remains} পিস কিনলেই ২টি মেহেদী একদম ফ্রি!`;
  } else {
    currentStatus = "👑 সর্বোচ্চ ডিল আনলক! ফ্রি ডেলিভারি + ২টি প্রিমিয়াম মেহেদী একদম ফ্রি পাচ্ছেন!";
    progressPercentage = 100;
    nextRewardMessage = "সবচেয়ে বড় ঈদ অফারটি উপভোগ করুন!";
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#FAF6EE] via-[#FFF9F2] to-[#FFEAEA] py-10 sm:py-14 border-y border-[#EADFC9]/65">
      
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 hidden md:block">
        <Sparkles className="h-16 w-16 text-[#cfa856]/15 rotate-12" />
      </div>
      <div className="absolute top-4 right-12 hidden md:block">
        <Gift className="h-12 w-12 text-[#8FA88B]/15 -rotate-45" />
      </div>
      <div className="absolute bottom-3 left-1/3 text-xl text-[#8FA88B]/15 pointer-events-none">🌿</div>

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        
        {/* Animated Badge with soft pink backdrop */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFEAEA] border border-pink-200 text-rose-600 text-xs font-bold mb-4 animate-pulse uppercase tracking-wider"
        >
          <Flame className="h-4 w-4 text-rose-500 fill-rose-500" />
          <span>ঈদ উৎসব ধামাকা অফার 🎉</span>
        </motion.div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-800 leading-tight">
          ঈদ অফার স্পেশাল ক্যাম্পেইন
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-8 max-w-xl mx-auto font-bengali">
          অর্গানিক কোয়ালিটির রাজকীয় রঙের জাদুকরী মেহেদীর ডিল - স্টক সীমিত!
        </p>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -3 }}
            className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
              totalQty >= 3 ? 'bg-white border-[#cfa856] shadow-sm' : 'bg-white/60 border-[#8FA88B]/20'
            }`}
          >
            {totalQty >= 3 && (
              <div className="absolute top-3 right-3 bg-[#5D7A5C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <CheckCircle2 className="h-2.5 w-2.5 fill-white text-[#5D7A5C] stroke-[3]" />
                <span>আনলকড</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-3 text-left">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 text-xs font-bold">
                ৩ পিস
              </div>
              <h3 className="text-base font-serif font-bold text-slate-850">ফ্রি ডেলিভারি</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-left">
              সর্বনিম্ন ৩ পিস যেকোনো মেহেদী কার্টে যোগ দিলেই পাচ্ছেন ফ্রি হোম ডেলিভারি। কোনো অতিরিক্ত কোড লাগবেনা।
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -3 }}
            className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
              totalQty >= 5 ? 'bg-white border-[#cfa856] shadow-sm' : 'bg-white/60 border-[#8FA88B]/20'
            }`}
          >
            {totalQty >= 5 && (
              <div className="absolute top-3 right-3 bg-[#5D7A5C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <CheckCircle2 className="h-2.5 w-2.5 fill-white text-[#5D7A5C] stroke-[3]" />
                <span>আনলকড</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-3 text-left">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 text-xs font-bold">
                ৫ পিস
              </div>
              <h3 className="text-base font-serif font-bold text-slate-855">১ পিস ফ্রি + ডেলিভারি ফ্রি</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-left">
              ৫ পিস যেকোনো মেহেদী অর্ডার করলে সাথে একদম ফ্রি পাবেন ১টি প্রিমিয়াম মেহেদী কোন এবং সম্পূর্ণ ফ্রি ডেলিভারি!
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -3 }}
            className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
              totalQty >= 10 ? 'bg-white border-[#cfa856] shadow-sm' : 'bg-white/60 border-[#8FA88B]/20'
            }`}
          >
            {totalQty >= 10 && (
              <div className="absolute top-3 right-3 bg-[#5D7A5C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <CheckCircle2 className="h-2.5 w-2.5 fill-white text-[#5D7A5C] stroke-[3]" />
                <span>আনলকড</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-3 text-left">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 text-xs font-bold">
                ১০ পিস
              </div>
              <h3 className="text-base font-serif font-bold text-slate-860">২ পিস ফ্রি + ডেলিভারি ফ্রি</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-left">
              সর্বোচ্চ উৎসব সুবিধা! ১০ পিসে পাচ্ছেন ২ পিস প্রিমিয়াম মেহেদী সম্পূর্ণ উপহার হিসেবে এবং ক্যাশ অন ফ্রি ডেলিভারি।
            </p>
          </motion.div>

        </div>

        {/* Dynamic Gamified Tracker Panel with elegant sweet coloring */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-5 border border-[#8FA88B]/25 shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#5D7A5C] font-bold mb-2 font-bengali">
            <span className="flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-[#cfa856]" />
              <span>কার্ট ট্র্যাকার (কার্টে আছে: {totalQty} পিস)</span>
            </span>
            <span className="text-amber-600 font-bold font-mono">{nextRewardMessage}</span>
          </div>

          {/* Custom progress rail with golden gradients */}
          <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-[#8FA88B]/15">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-500 via-[#cfa856] to-[#5D7A5C] rounded-full"
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-bold mt-4 font-bengali flex items-center justify-center gap-1.5">
            <Leaf className="h-4 w-4 text-[#5D7A5C]" />
            <span>{currentStatus}</span>
          </p>

          {totalQty === 0 && (
            <button
              onClick={() => scrollToSection('products-shelf')}
              className="mt-4.5 px-5 py-2.5 rounded-xl bg-[#5D7A5C] text-[#FAF6EE] text-xs font-bold hover:bg-[#4E6A4D] transition-all cursor-pointer shadow-sm"
            >
              মেহেদী দেখুন ও ডিল উপভোগ করুন
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
