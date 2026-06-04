/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Star, MessageCircle, ChevronRight, Facebook, Layout } from 'lucide-react';
import { reviews } from '../data';

export default function CustomerExperience() {
  return (
    <section className="bg-gradient-to-b from-[#FAF6EE] to-[#F4EFE6] py-16 px-4 border-b border-[#EADFC9]/60">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Section header */}
        <span className="inline-flex items-center gap-1.5 text-xs text-[#5D7A5C] font-bold tracking-widest uppercase bg-[#8FA88B]/10 border border-[#8FA88B]/35 px-3.5 py-1.5 rounded-full mb-3">
          <Star className="h-3 w-3 fill-[#cfa856] text-[#cfa856]" />
          <span>গ্রাহক প্রতিক্রিয়া</span>
        </span>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-800 leading-tight">
          আমাদের সন্তুষ্ট কাস্টমারদের সত্য অনুভূতি
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 mb-12 max-w-xl mx-auto font-bengali leading-relaxed">
          আপুদের দেওয়া ও নখে ফুটে ওঠা আমাদের ১০০% অরিজিনাল অর্গানিক হেনা কালার টেস্ট ও প্রশংসামূলক বার্তা।
        </p>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white border border-[#8FA88B]/15 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-[#cfa856] transition-all duration-300 shadow-sm hover:shadow-md text-left"
            >
              {/* Review content body */}
              <div className="p-5 flex-grow">
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-[#5D7A5C] font-bold ml-1.5">৫.০ / ৫.০</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic font-bengali">
                  "{review.comment}"
                </p>
              </div>

              {/* Showcase Image - Renders the actual real customer henna stains */}
              {review.image && (
                <div className="px-5 pb-3">
                  <a 
                    href={review.image} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#8FA88B]/20 bg-[#FAF6EE] group cursor-zoom-in"
                    title="আসল ছবি বড় করে দেখতে ক্লিক করুন"
                  >
                    <img 
                      src={review.image} 
                      alt={`${review.userName}-এর মেহেদী ডিজাইন`} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-[10px] font-medium text-white bg-black/40 backdrop-blur-xs px-2 py-1 rounded-lg">
                        সম্পূর্ণ রেজাল্ট দেখতে ক্লিক করুন ↗
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-[#5D7A5C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wide">
                      রিয়েল কালার টেস্ট 🌿
                    </div>
                  </a>
                </div>
              )}

              {/* Reviewer author info footer */}
              <div className="px-5 py-4 bg-[#FAF6EE]/55 border-t border-[#EADFC9]/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={review.avatar}
                    alt={review.userName}
                    className="h-8 w-8 rounded-full object-cover border border-[#8FA88B]/25"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">{review.userName}</h4>
                    <p className="text-[10px] text-[#5D7A5C] font-semibold">ভেরিফাইড কাস্টমার</p>
                  </div>
                </div>

                <span className="text-[9px] font-semibold text-slate-400 font-mono">
                  {review.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery / Customer posts references */}
        <div className="mt-12 p-6 rounded-3xl bg-[#FAF6EE] border border-[#8FA88B]/25 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-base sm:text-lg font-serif font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
              <MessageCircle className="h-5 w-5 text-[#cfa856] fill-[#cfa856]" />
              <span>ফেসবুক গ্রুপে আপুদের ডিজাইন দেখুন!</span>
            </h4>
            <p className="text-xs text-slate-500 font-bengali mt-1">
              আমাদের অফিসিয়াল ফেসবুক পেইজে হাজারেরও বেশি আপুদের দেওয়া ডিজাইন, ভিডিও ও রিয়েল কালার টেস্টের শত শত পোস্ট রয়েছে।
            </p>
          </div>
          
          <div className="flex shrink-0 gap-3">
            <a
              href="https://www.facebook.com/share/1MijuSzn2Q/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white hover:bg-[#FAF6EE] text-[#5D7A5C] text-xs font-bold border border-[#8FA88B]/35 hover:border-[#5D7A5C] px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <span>১ম স্যাম্পল ↗</span>
            </a>

            <a
              href="https://www.facebook.com/share/1BZPmSDNYt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white hover:bg-[#FAF6EE] text-[#5D7A5C] text-xs font-bold border border-[#8FA88B]/35 hover:border-[#5D7A5C] px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <span>২য় স্যাম্পল ↗</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
