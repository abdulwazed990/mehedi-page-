/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Leaf, ShieldCheck, Heart, Sparkles, CheckCircle, Smile } from 'lucide-react';

export default function WhyChooseUs() {
  // Let's implement the 7 highly requested sweet points
  const points = [
    {
      title: "🌿 ১০০% অর্গানিক মেহেদী",
      desc: "সম্পূর্ণ ভেজালমুক্ত খাঁটি সুজি পাতা দিয়ে নিখুঁত ফিনিশিংয়ে তৈরি।",
      icon: Leaf,
      color: "text-[#5D7A5C]"
    },
    {
      title: "🌿 গাঢ় সুন্দর রঙ হয়",
      desc: "কোন কৃত্রিম কালার ছাড়াই প্রাকৃতিকভাবে চমৎকার লাল-খয়েরী আভা দেয়।",
      icon: Sparkles,
      color: "text-amber-500"
    },
    {
      title: "🌿 কোন ক্ষতিকর কেমিক্যাল নেই",
      desc: "অ্যাসিড বা ক্ষতিকর প্রিজারভেটিভ সম্পূর্ণ বর্জিত ও প্রকৃতিবান্ধব।",
      icon: ShieldCheck,
      color: "text-rose-400"
    },
    {
      title: "🌿 হাতে সুন্দর ডিজাইন ফুটে ওঠে",
      desc: "সহজে ডিজাইন আঁকা যায় এবং আপনার হাতের রূপ বাড়িয়ে তোলে বহুগুণ।",
      icon: CheckCircle,
      color: "text-blue-500"
    },
    {
      title: "🌿 দীর্ঘ সময় রঙ থাকে",
      desc: "সহজে উঠে যায় না এবং দীর্ঘদিন নখ ও ত্বকের উজ্জ্বলতা ধরে রাখে।",
      icon: Sparkles,
      color: "text-[#cfa856]"
    },
    {
      title: "🌿 ত্বকের জন্য নিরাপদ",
      desc: "শিশুদের সংবেদনশীল ত্বকেও সম্পূর্ণ নিরাপদ ও অ্যালার্জি মুক্ত কেয়ার।",
      icon: Heart,
      color: "text-red-400"
    },
    {
      title: "🌿 ভালোবাসা দিয়ে তৈরি",
      desc: "আপনাদের উৎসবের মহিমা বাড়িয়ে তুলতে অত্যন্ত যত্ন আর মমতায় প্রস্তুত।",
      icon: Smile,
      color: "text-emerald-500"
    }
  ];

  return (
    <section className="relative bg-[#FAF6EE] py-16 px-4 overflow-hidden border-b border-[#EADFC9]/60">
      
      {/* Decorative leaf motifs */}
      <div className="absolute top-10 right-4 h-48 w-48 bg-[#8FA88B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 left-5 h-40 w-40 bg-pink-100 rounded-full blur-3xl pointer-events-none" />

      {/* Symmetrical Corner leaf and vine patterns */}
      <div className="absolute top-4 left-4 text-[#8FA88B]/15 text-3xl font-serif pointer-events-none">🌿 🌾</div>
      <div className="absolute bottom-4 right-4 text-[#8FA88B]/15 text-3xl font-serif pointer-events-none">🌾 🌿</div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Sweet Tagline */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#8FA88B]/10 border border-[#8FA88B]/35 text-[#5D7A5C] text-xs font-bold tracking-wider mb-3">
          🌾 প্রকৃতি ও বিশুদ্ধতার উপহার 🌾
        </span>

        {/* Simplistic Heading */}
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 leading-tight mt-1 mb-4" id="why-jannats-henna">
          কেন জান্নাত'স হেনা?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed font-bengali">
          সহজ, সুন্দর, ও মিষ্টি উপায়ে তৈরি আমাদের ১০০% অর্গানিক মেহেদী যা আপনার উৎসবকে করে তুলবে আনন্দময় ও সম্পূর্ণ নিরাপদ।
        </p>

        {/* Simplified Features Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {points.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -3 }}
                className="p-6 rounded-2xl bg-white border border-[#8FA88B]/15 hover:border-[#cfa856] shadow-sm text-left transition-all duration-300 relative overflow-hidden group"
              >
                {/* Background Leaf decoration symbol */}
                <div className="absolute -bottom-6 -right-6 h-16 w-16 text-[#8FA88B]/5 group-hover:text-[#8FA88B]/10 transition-colors pointer-events-none">
                  <Leaf className="h-full w-full" />
                </div>

                <div className="flex items-center gap-3 mb-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#FAF6EE] border border-[#8FA88B]/20 flex items-center justify-center text-[#5D7A5C]">
                    <IconComponent className={`h-4.5 w-4.5 ${point.color}`} />
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-800">
                    {point.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pl-1">
                  {point.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Simple friendly note */}
        <div className="mt-12 p-5 rounded-2xl bg-[#FFEAEA]/40 border border-[#8FA88B]/10 max-w-2xl mx-auto text-left flex items-start gap-3">
          <span className="text-xl shrink-0">🌿</span>
          <div>
            <h4 className="text-[#5D7A5C] text-xs sm:text-sm font-bold">ত্বক সুরক্ষার গ্যারান্টি:</h4>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-bengali mt-0.5">
              আমাদের মেহেদীতে কোনো ক্ষতিকর ডাই বা এলার্জি সৃষ্টিকারী উপাদান মিক্স থাকে না। শিশুর সংবেদনশীল মনে এবং বড়দের হাতের ভালোবাসায় এটি ১০০% সুরক্ষিত।
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
