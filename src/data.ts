/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, SliderItem, Review } from './types';

/// Let's declare the 5 Facebook Product representations with authentic data and corresponding FB link
export const products: Product[] = [
  {
    id: "hand-henna-premium-large",
    name: "Premium Hand Henna (Large)",
    nameBangla: "প্রিমিয়াম হেনা কোণ (লার্জ)",
    weightRange: "২৬–২৮ গ্রাম",
    price: 120,
    image: "https://static-01.daraz.com.bd/p/889470606a203a9eae5de92495d2b2a5.jpg",
    fbImageLink: "https://www.facebook.com/share/17gQTCkECL/",
    category: "hand",
    description: "শতভাগ খাঁটি ও সম্পূর্ণ অর্গানিক হেনা পাতা দিয়ে তৈরি প্রিমিয়াম কোণ। কোনো ক্ষতিকর অ্যাসিড বা কেমিক্যাল নেই। গাঢ় সুন্দর খয়েরী রঙের গ্যারান্টি।"
  },
  {
    id: "hand-henna-premium-regular",
    name: "Premium Hand Henna (Regular)",
    nameBangla: "প্রিমিয়াম হেনা কোণ (রেগুলার)",
    weightRange: "২১–২৩ গ্রাম",
    price: 100,
    image: "https://simascreation.com/storage/product/1763923830-IMG_20251124_004844.webp",
    fbImageLink: "https://www.facebook.com/share/1Geexg64L5/",
    category: "hand",
    description: "নিয়মিত হাত রাঙানোর জন্য পারফেক্ট সাইজের অর্গানিক কোণ। শিশুদের সংবেদনশীল ত্বকে ব্যবহারের জন্য সম্পূর্ণ নিরাপদ ও ক্ষতিকর উপাদানমুক্ত।"
  },
  {
    id: "nail-henna-organic-premium",
    name: "Organic Nail Henna",
    nameBangla: "অর্গানিক নখের মেহেদী",
    weightRange: "১৫–১৮ গ্রাম",
    price: 110,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKUUOncd1frCcLI9Lwcd6iqvQU17_jvDHImA&s",
    fbImageLink: "https://www.facebook.com/share/1GdJRN2g2C/",
    category: "nail",
    description: "নখকে উজ্জ্বল ও দীর্ঘস্থায়ী গাঢ় লালচে কালার দিতে বিশেষভাবে প্রস্তুত। সহজে রঙ ছড়ায় না এবং নখ ভালো রাখে।"
  },
  {
    id: "mehendi-combo-1",
    name: "Mehendi Combo 1",
    nameBangla: "মেহেদী কম্বো-১ 🌿",
    weightRange: "হাতের ২ টা + নখের ১ টা",
    price: 350,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS2WFZeNs6mafsGLYN2mwOzu9Ifsg-H7LbDVuFWeXP3w&s",
    fbImageLink: "https://www.facebook.com/share/1BZPmSDNYt/",
    category: "hand",
    isCombo: true,
    description: "হাতের ২টি প্রিমিয়াম লার্জ হেনা কোণ এবং ১টি অর্গানিক নেইল হেনা-র প্রিমিয়াম সাশ্রয়ী কম্বো প্যাক। মাত্র ৩৫০ টাকায় সম্পূর্ণ রাজকীয় স্পর্শ!"
  },
  {
    id: "mehendi-combo-2",
    name: "Mehendi Combo 2",
    nameBangla: "মেহেদী কম্বো-২ 🌿",
    weightRange: "হাতের ৪ টা + নখের ১ টা",
    price: 550,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXXeGZ9NpNoSfJJgBh4GElDQmMrhVoGIx2wq9nGuP2ag&s",
    fbImageLink: "https://www.facebook.com/share/18eu9SXdF2/",
    category: "hand",
    isCombo: true,
    isHighlighted: true,
    description: "হাতের ৪টি প্রিমিয়াম লার্জ হেনা কোণ এবং ১টি অর্গানিক নেইল হেনা-র সেরা ধামাকা প্যাক। রাজকীয় আভা ও গাঢ় কনে সাজের জন্য সবচেয়ে জনপ্রিয় হাইলাইট কম্বো!"
  }
];

export const sliderItems: SliderItem[] = [
  {
    id: "slide-1",
    image: "https://media.istockphoto.com/id/1175420462/photo/marry-the-one-who-makes-your-eyes-smile.jpg?s=612x612&w=0&k=20&c=rJTJuG78KdKS2O6cEhe7m27WNYOvEfD6QJ9SrGXYGmM=",
    badge: "🌿 প্রিমিয়াম ব্রাইডাল সাজ",
    titleBangla: "জান্নাত'স হেনার মায়াবী স্পর্শে মধুর হাসি ও খুশির আভা",
    titleEnglish: "Bridal Smile & Organic Elegance",
    fbLink: "https://www.facebook.com/share/1MijuSzn2Q/",
    fallbacks: [
      "https://images.unsplash.com/photo-1590075865003-e48277aff551?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    id: "slide-2",
    image: "https://t3.ftcdn.net/jpg/08/18/46/70/360_F_818467087_F8wC2AO4zUA3xika7Cv1GsxQYjmpX5Jy.jpg",
    badge: "🌿 শতভাগ খাঁটি সুজি পাতা",
    titleBangla: "কনের হাতের নিখুঁত ঐতিহ্যবাহী নকশায় গাঢ় খয়েরী রঙের গ্যারান্টি",
    titleEnglish: "Splendid Intricate Masterpiece",
    fbLink: "https://www.facebook.com/share/1BZPmSDNYt/",
    fallbacks: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    id: "slide-3",
    image: "https://media.istockphoto.com/id/147021677/photo/henna-hands.jpg?s=612x612&w=0&k=20&c=fS-Ll7zm3ge5bTRQtR9RmmEHZXNvCqsmtwOoPo3DhWo=",
    badge: "🌿 নিখাদ দেশীয় হেনা",
    titleBangla: "আবহমান বাংলার ঐতিহ্যবাহী লালচে হেনার মোহময় আভা",
    titleEnglish: "Traditional Crimson Glow",
    fbLink: "https://www.facebook.com/share/2596vMijS9/",
    fallbacks: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    id: "slide-4",
    image: "https://static.vecteezy.com/system/resources/thumbnails/051/041/813/small/bride-s-hands-with-henna-tattoo-and-gold-jewelry-traditional-wedding-ceremony-photo.jpg",
    badge: "🌿 স্বর্ণালঙ্কার ও নকশা",
    titleBangla: "রাজকীয় সাজে সোনার গহনা ও গাঢ় মেহেদী রঙের অপূর্ব যুগলবন্দী",
    titleEnglish: "Jewelry & Intricate Henna Harmony",
    fbLink: "https://www.facebook.com/share/1YdtQK9dMn/",
    fallbacks: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    id: "slide-5",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQGH7hpnMYUiEaxsfXSwbUMsGFGRGLvpJCdw&s",
    badge: "🌿 শৈল্পিক ব্রাইডাল কোণ",
    titleBangla: "জান্নাত'স হেনার নিখুঁত রেখা ও চোখ জুড়ানো আভিজাত্য",
    titleEnglish: "Artistic Lines & Regal Splendor",
    fbLink: "https://www.facebook.com/share/18eu9SXdF2/",
    fallbacks: [
      "https://images.unsplash.com/photo-1617470703128-26a0fc9af10f?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    id: "slide-6",
    image: "https://iglowstudioz.com/wp-content/uploads/2025/10/Top-10-Latest-Stunning-Engagement-Mehndi-Designs-For-Bride.webp",
    badge: "🌿 এংগেজমেন্ট ও ব্রাইডাল শৈলী",
    titleBangla: "শুভ পরিণয়ের শুভক্ষণে আকর্ষনীয় ও মনমুগ্ধকর নকশার মহিমা",
    titleEnglish: "Engagement & Wedding Magic",
    fbLink: "https://www.facebook.com/share/1MijuSzn2Q/",
    fallbacks: [
      "https://images.unsplash.com/photo-1590075865003-e48277aff551?auto=format&fit=crop&w=1600&q=80"
    ]
  }
];

export const reviews: Review[] = [
  {
    id: "review-1",
    userName: "ফারজানা আক্তার মীম",
    rating: 5,
    comment: "অনেক ধন্যবাদ আপু মেহেদি টা অনেক সুন্দর ছিল! একদম খাঁটি অরগানিক, আমার স্কিন অনেক সেনসিটিভ কিন্তু কোনো চুলকানি বা এলার্জি হয় নাই। কালার টা এত ডিপ আসছে জাস্ট অসাধারণ!! সবাই জিজ্ঞেস করছিলো কোথা থেকে নিসি 😍",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyYf3GG-ZgucZE6-54oGoTOvgRF5BPdNjZag&s",
    date: "মে ২৪, ২০২৬"
  },
  {
    id: "review-2",
    userName: "নুসরাত জাহান লিমা",
    rating: 5,
    comment: "নখের মেহেদি টা তো পুরাই অবাক করসে! ২ ঘণ্টার মতো রাখছিলাম তাতেই এত সুন্দর টকটকে লালচে কালার আসছে যা বাজার থেকে কেনা কেমিক্যাল মেহেদি তে কখনো আসেনা। ৩ পিস নিসিলাম ফ্রি ডেলিভারি তে, একদম অরিজিনাল জিনিস আপুরা, চোখ বন্ধ করে নিতে পারেন ❤️",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4hJ2_b-F4PB1jRm-veww-rJ2d8yO10q66cw&s",
    date: "মে ২৮, ২০২৬"
  },
  {
    id: "review-3",
    userName: "তানহা তাসনিম শিমু",
    rating: 5,
    comment: "নেক্সট টাইম আবার নিবো ইনশাল্লাহ। সত্যি অনেক ভালো লেগেছে। সুজি মেহেদী পাতার ওই অরিজিনাল ঘ্রাণ পাওয়া যাচ্ছিল হাত থেকে। আর কালার সত্যি ই অসাধারণ ডিপ কালার আসছে। থ্যাংক ইউ আপু এত ভালো কোয়ালিটি দেয়ার জন্য।",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEXJYVgGtPbV5SXBdGKV6Qc8zW4TyKnySqvA&s",
    date: "জুন ০২, ২০২৬"
  }
];

export const districtsOfBangladesh = [
  "ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা", "রাজশাহী", "রংপুর", "বরিশাল", "ময়মনসিংহ",
  "গাজীপুর", "নারায়ণগঞ্জ", "কুমিল্লা", "বগুড়া", "যশোর", "ফেনী", "কক্সবাজার",
  "দিনাজপুর", "টাঙ্গাইল", "জামালপুর", "পাবনা", "কুষ্টিয়া", "নোয়াখালী", "মাদারীপুর"
];

export const upazilasOfBangladesh: { [key: string]: string[] } = {
  "ঢাকা": ["মিরপুর", "ধানমন্ডি", "উত্তরা", "গুলশান", "মোহাম্মদপুর", "তেজগাঁও", "লালবাগ", "মতিঝিল", "বাড্ডা", "খিলগাঁও", "কেরানীগঞ্জ", "সাভার", "ধামরাই"],
  "চট্টগ্রাম": ["ডবলমুরিং", "পতেঙ্গা", "হালিশহর", "কোতোয়ালী", "পাঁচলাইশ", "হাটহাজারী", "সীতাকুণ্ড", "মিরসরাই", "পটিয়া", "বোয়ালখালী"],
  "সিলেট": ["সিলেট সদর", "বিয়ানীবাজার", "গোলাপগঞ্জ", "জৈন্তাপুর", "কানাইঘাট", "বালাগঞ্জ", "ফেঞ্চুগঞ্জ"],
  "খুলনা": ["খুলনা সদর", "খালিশপুর", "দৌলতপুর", "রূপসা", "ডুমুরিয়া", "ফুলতলা", "বাটিয়াঘাটা"],
  "রাজশাহী": ["বোয়ালিয়া", "মতিহার", "পবা", "বাঘা", "চারঘাট", "পুঠিয়া", "গোদাগাড়ী"],
  "ময়মনসিংহ": ["ময়মনসিংহ সদর", "মুক্তাগাছা", "ফুলপুর", "ত্রিশাল", "গফরগাঁও", "ঈশ্বরগঞ্জ", "ভালুকা"]
};
