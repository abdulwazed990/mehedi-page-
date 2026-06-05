/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Clock, ShoppingCart, CheckCircle2, Phone, Sparkles, ArrowUp, Award, Gift } from 'lucide-react';
import { products } from './data';
import { CartItem, Product, Order } from './types';

// Importing Custom Layout Subcomponents
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import ProductCard from './components/ProductCard';
import OfferBanner from './components/OfferBanner';
import WhyChooseUs from './components/WhyChooseUs';
import CustomerExperience from './components/CustomerExperience';
import CheckoutSection from './components/CheckoutSection';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import QuantityAlertModal from './components/QuantityAlertModal';

export default function App() {
  // Application State managers
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [district, setDistrict] = useState('ঢাকা');
  const [activeTab, setActiveTab] = useState<'shop' | 'orders'>('shop');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('jannats_henna_admin_logged_in') === 'true';
  });
  
  // Quantity validation state managers
  const [isMinQtyAlertOpen, setIsMinQtyAlertOpen] = useState(false);
  const [alertProduct, setAlertProduct] = useState<Product | null>(null);
  const [alertType, setAlertType] = useState<'cart' | 'order' | null>(null);
  
  // Confetti / Invoice Success Modal State
  const [newlyCreatedOrder, setNewlyCreatedOrder] = useState<Order | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync scroll to top on login
  useEffect(() => {
    if (isAdminLoggedIn) {
      window.scrollTo(0, 0);
    }
  }, [isAdminLoggedIn]);

  // References for scrolling
  const productsRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  // Initial load of orders from localStorage
  useEffect(() => {
    loadOrders();

    // Scroll display list handler
    const scrollTracker = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', scrollTracker);
    return () => window.removeEventListener('scroll', scrollTracker);
  }, []);

  const loadOrders = () => {
    const rawData = localStorage.getItem('jannats_henna_orders');
    if (rawData) {
      try {
        setOrders(JSON.parse(rawData));
      } catch (err) {
        console.error("Error reading local order database cache:", err);
      }
    }
  };

  // Helper logic to scroll smoothly
  const scrollToSection = (id: string) => {
    if (id === 'products-shelf' && productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'checkout-form-section' && checkoutRef.current) {
      checkoutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add items handler with minimum requirement check
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });

    const totalQtyInCart = cart.reduce((v, item) => v + item.quantity, 0);
    const existingIdx = cart.findIndex((item) => item.product.id === product.id);
    const existingQty = existingIdx > -1 ? cart[existingIdx].quantity : 0;
    const resultingTotalQty = totalQtyInCart - existingQty + (existingQty + quantity);
    
    if (resultingTotalQty < 2) {
      setAlertProduct(product);
      setAlertType('cart');
      setIsMinQtyAlertOpen(true);
    }
  };

  // Direct fast-checkout handler with minimum requirement check
  const handleOrderNow = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity = quantity; // align chosen count
        return updated;
      }
      return [...prev, { product, quantity }];
    });

    const totalQtyInCart = cart.reduce((v, item) => v + item.quantity, 0);
    const existingIdx = cart.findIndex((item) => item.product.id === product.id);
    const existingQty = existingIdx > -1 ? cart[existingIdx].quantity : 0;
    const resultingTotalQty = existingIdx > -1 
      ? totalQtyInCart - existingQty + quantity 
      : totalQtyInCart + quantity;

    if (resultingTotalQty < 2) {
      setAlertProduct(product);
      setAlertType('order');
      setIsMinQtyAlertOpen(true);
    } else {
      // Timeout allows DOM state to flush nicely before scroll triggers
      setTimeout(() => {
        scrollToSection('checkout-form-section');
      }, 150);
    }
  };

  // Auto set quantity of selected product to 2
  const handleAutoSetMinimum = () => {
    if (!alertProduct) return;
    const targetQuantity = 2;
    
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === alertProduct.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity = targetQuantity;
        return updated;
      }
      return [...prev, { product: alertProduct, quantity: targetQuantity }];
    });

    if (alertType === 'order') {
      setTimeout(() => {
        scrollToSection('checkout-form-section');
      }, 150);
    }
  };

  const handleOrderSuccessCallback = (completedOrder: Order) => {
    // Reload state and show invoice success popup
    loadOrders();
    setNewlyCreatedOrder(completedOrder);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAFDF9] text-slate-800 selection:bg-[#5D7A5C] selection:text-white flex flex-col font-sans relative overflow-x-hidden p-4 sm:p-8">
        <div className="max-w-7xl mx-auto w-full mb-6 flex justify-between items-center bg-white border border-[#D2E4D0] p-4 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#EAF4E8] text-[#5D7A5C]">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-serif font-extrabold text-[#2B4429] tracking-tight font-bengali text-base sm:text-lg font-bold">
              জান্নাত’স হেনা — গোপন প্রশাসনিক এলাকা (Admin Centre)
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 font-mono">UTC: 2026-06-05</p>
        </div>
        
        <AdminPanel 
          onOrdersUpdated={loadOrders} 
          onAdminLoginStateChange={setIsAdminLoggedIn}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-slate-700 selection:bg-[#cfa856] selection:text-white flex flex-col font-sans relative overflow-x-hidden pb-12">
      
      {/* Background Decorative Symmetrical Shadows with soft mehendi & sweet coloring */}
      <div className="absolute top-[10%] left-[-15%] w-[50%] h-[350px] bg-[#8FA88B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[-15%] w-[50%] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[400px] bg-[#8FA88B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Real-time indicator in corner styled with Sweet Soft Cream */}
      <div className="bg-[#FAF6EE] text-[#5D7A5C] text-[10px] md:text-xs font-bold py-2 px-4 text-center border-b border-[#EADFC9]/65 flex justify-between items-center max-w-7xl mx-auto w-full">
        <span className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <Clock className="h-4 w-4 text-[#cfa856]" />
          <span>অনলাইন ডেলিভারি সম্পূর্ণ সচল | অর্ডার নেওয়া হচ্ছে</span>
        </span>
        <span className="hidden sm:inline font-bengali">🌿 শতভাগ অর্গানিক ও ক্ষতিকর কেমিক্যালমুক্ত আসল মেহেদী</span>
      </div>

      {/* Navigation and Branding header */}
      <Header
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        ordersCount={orders.length}
        scrollToSection={scrollToSection}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main visual sliding carousel header */}
      <HeroSlider />

      {/* Why Choose Us Organic Simple Credentials */}
      <WhyChooseUs />

      {/* Interactive Eid Campaigns Indicator bar */}
      <OfferBanner cart={cart} scrollToSection={scrollToSection} />

      {/* Products Shelf */}
      <main className="max-w-7xl mx-auto px-4 py-16 scroll-mt-20" id="products-shelf" ref={productsRef}>
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8FA88B]/10 border border-[#8FA88B]/35 text-[#5D7A5C] text-xs font-bold uppercase tracking-wider">
            <Award className="h-4 w-4" />
            <span>সিগনেচার প্রোডাক্ট কালেকশন</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-800 mt-2 mb-4 leading-tight">
            জান্নাত’স স্পেশাল মেহেদী সমূহ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bengali max-w-xl mx-auto leading-relaxed">
            কোন ক্ষতিকর কেমিক্যাল ছাড়াই প্রাকৃতিকভাবে দীর্ঘস্থায়ী চমৎকার সুগন্ধ ও গাঢ় রঙের নিশ্চয়তা। নিচে দেওয়া লিঙ্ক থেকে আসল হেনা ছবির ফেসবুক পেইজ দেখতে পারবেন।
          </p>
        </div>

        {/* 1. Single Premium Products Sub-section */}
        <div className="mb-14">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent to-[#8FA88B]/40 flex-1"></div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#5D7A5C] tracking-wide inline-flex items-center gap-1.5 px-4 font-bengali">
              <span>🌿 সিঙ্গেল প্রিমিয়াম প্রোডাক্টস সমূহ</span>
            </h3>
            <div className="h-px bg-gradient-to-l from-transparent to-[#8FA88B]/40 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {products.filter(p => !p.isCombo).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
              />
            ))}
          </div>
        </div>

        {/* 2. Mehendi Premium Combo Offertory Section */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-8 pt-6">
            <div className="h-px bg-gradient-to-r from-transparent to-[#cfa856]/40 flex-1"></div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#cfa856] tracking-wide inline-flex items-center gap-1.5 px-4 font-bengali">
              <span>🌿 স্পেশাল মেহেদী কম্বো অফার</span>
            </h3>
            <div className="h-px bg-gradient-to-l from-transparent to-[#cfa856]/40 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {products.filter(p => p.isCombo).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
              />
            ))}
          </div>
        </div>
      </main>

      {/* 🌿 ব্যবহার প্রণালী ও আফটার কেয়ার Section (Soft Sweet Green Theme) */}
      <section className="bg-gradient-to-b from-[#F2F8F1] via-[#FAFDF9] to-[#F2F8F1] py-16 px-4 border-t-2 border-b-2 border-[#D6E8D4]/80 relative" id="mehendi-guidelines">
        {/* Background decorative mehendi leaf layers */}
        <div className="absolute top-[5%] left-[2%] w-32 h-32 bg-[#5D7A5C]/5 rounded-full blur-2xl pointer-events-none select-none"></div>
        <div className="absolute bottom-[5%] right-[2%] w-32 h-32 bg-[#8FA88B]/5 rounded-full blur-2xl pointer-events-none select-none"></div>

        {/* Premium Mehendi Leaf Ornamental Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#8FA88B]/50 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto relative px-2 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Section 1: ব্যবহার প্রণালী */}
            <div className="bg-white/95 border-2 border-[#D2E4D0] hover:border-[#B1D5AD] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300">
              {/* Premium Mehendi Leaf Border Decoration on corners */}
              <div className="absolute top-0 right-0 w-24 h-24 text-[#5D7A5C]/5 pointer-events-none transform translate-x-4 -translate-y-4 select-none opacity-20">
                <Leaf className="w-full h-full text-[#5D7A5C]" />
              </div>
              <div className="absolute bottom-0 left-0 w-20 h-20 text-[#5D7A5C]/5 pointer-events-none transform -translate-x-4 translate-y-4 rotate-180 select-none opacity-20">
                <Leaf className="w-full h-full text-[#5D7A5C]" />
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-6 border-b border-[#E3F0E1] pb-4">
                  <span className="p-2.5 rounded-xl bg-[#5D7A5C]/10 text-[#5D7A5C]">
                    <Leaf className="h-6 w-6 stroke-[2]" />
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2B4429] leading-tight font-bengali">
                      🌿 ব্যবহার প্রণালী
                    </h3>
                    <p className="text-[10px] text-[#5D7A5C] font-semibold uppercase tracking-wider font-sans mt-0.5">
                      Usage Guidelines
                    </p>
                  </div>
                </div>

                {/* Content elements - Easy, beautiful & readable Bengali format */}
                <div className="space-y-4 text-left">
                  <div className="flex gap-3.5 items-start p-3 bg-[#F8FDF7] hover:bg-[#F0F8EE] rounded-xl border border-[#EAF4E8] transition-colors">
                    <span className="text-[#5D7A5C] mt-0.5 text-base shrink-0 select-none">🍃</span>
                    <p className="text-xs sm:text-sm text-[#3E503C] leading-relaxed font-semibold font-bengali">
                      মেহেদি লাগানোর পর কমপক্ষে ৩–৪ ঘণ্টা হাতে রাখুন। তবে সবচেয়ে ভালো রঙ পেতে সারা রাত হাতে রাখতে পারেন।
                    </p>
                  </div>

                  <div className="flex gap-3.5 items-start p-3 bg-[#F8FDF7] hover:bg-[#F0F8EE] rounded-xl border border-[#EAF4E8] transition-colors">
                    <span className="text-[#5D7A5C] mt-0.5 text-base shrink-0 select-none">🍃</span>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-[#3E503C] leading-relaxed font-semibold font-bengali">
                        মেহেদি দেওয়ার পর প্রথম ২৪ ঘণ্টা যতটা সম্ভব পানি এড়িয়ে চলুন। এতে রঙ আরও গাঢ় ও দীর্ঘস্থায়ী হবে।
                      </p>
                      <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-105 px-2 py-0.5 rounded-md inline-block font-bengali">
                        💧 (শুধুমাত্র অজুর পানি ব্যবহার করতে পারবেন)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start p-3 bg-[#F8FDF7] hover:bg-[#F0F8EE] rounded-xl border border-[#EAF4E8] transition-colors">
                    <span className="text-[#5D7A5C] mt-0.5 text-base shrink-0 select-none">🍃</span>
                    <p className="text-xs sm:text-sm text-[#3E503C] leading-relaxed font-semibold font-bengali">
                      মেহেদি শুকিয়ে গেলে পানি দিয়ে ধুবেন না। স্বাভাবিকভাবে শুকিয়ে ঝরে যেতে দিন।
                    </p>
                  </div>

                  <div className="flex gap-3.5 items-start p-3 bg-[#F8FDF7] hover:bg-[#F0F8EE] rounded-xl border border-[#EAF4E8] transition-colors">
                    <span className="text-[#5D7A5C] mt-0.5 text-base shrink-0 select-none">🍃</span>
                    <p className="text-xs sm:text-sm text-[#3E503C] leading-relaxed font-semibold font-bengali">
                      অবশিষ্ট মেহেদি ডিপ ফ্রিজে সংরক্ষণ করুন। এতে প্রায় ৬ মাস পর্যন্ত ভালো থাকে।
                    </p>
                  </div>

                  <div className="flex gap-3.5 items-start p-3 bg-[#F8FDF7] hover:bg-[#F0F8EE] rounded-xl border border-[#EAF4E8] transition-colors">
                    <span className="text-[#5D7A5C] mt-0.5 text-base shrink-0 select-none">🍃</span>
                    <p className="text-xs sm:text-sm text-[#3E503C] leading-relaxed font-semibold font-bengali">
                      তবে যত দ্রুত সম্ভব ব্যবহার করলে সবচেয়ে ভালো রেজাল্ট পাওয়া যায়।
                    </p>
                  </div>

                  <div className="flex gap-3.5 items-start p-3 bg-[#F8FDF7] hover:bg-[#F0F8EE] rounded-xl border border-[#EAF4E8] transition-colors">
                    <span className="text-[#5D7A5C] mt-0.5 text-base shrink-0 select-none">🍃</span>
                    <p className="text-xs sm:text-sm text-[#3E503C] leading-relaxed font-semibold font-bengali">
                      একবার মেহেদি খুললে চেষ্টা করবেন একবারেই ব্যবহার করতে। নাহলে পরবর্তীতে কালার কম আসতে পারে।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: আফটার কেয়ার (রঙ গাঢ় করার যত্ন) */}
            <div className="bg-white/95 border-2 border-[#D2E4D0] hover:border-[#B1D5AD] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300">
              {/* Premium Mehendi Leaf Border Decoration on corners */}
              <div className="absolute top-0 right-0 w-24 h-24 text-[#5D7A5C]/5 pointer-events-none transform translate-x-4 -translate-y-4 select-none opacity-20">
                <Leaf className="w-full h-full text-[#5D7A5C]" />
              </div>
              <div className="absolute bottom-0 left-0 w-20 h-20 text-[#5D7A5C]/5 pointer-events-none transform -translate-x-4 translate-y-4 rotate-180 select-none opacity-20">
                <Leaf className="w-full h-full text-[#5D7A5C]" />
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-6 border-b border-[#E3F0E1] pb-4">
                  <span className="p-2.5 rounded-xl bg-[#5D7A5C]/10 text-[#5D7A5C]">
                    <Sparkles className="h-6 w-6 stroke-[2]" />
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2B4429] leading-tight font-bengali">
                      🌿 আফটার কেয়ার (রঙ গাঢ় করার যত্ন)
                    </h3>
                    <p className="text-[10px] text-[#5D7A5C] font-semibold uppercase tracking-wider font-sans mt-0.5">
                      Premium After Care
                    </p>
                  </div>
                </div>

                {/* Content elements - Easy, beautiful & readable Bengali format */}
                <div className="space-y-4 text-left">
                  <div className="flex gap-3.5 items-start p-3.5 bg-[#FFFDF6] hover:bg-[#FFFBF0] rounded-xl border border-[#FAEDCD]/40 transition-colors">
                    <span className="text-amber-600 mt-0.5 text-base shrink-0 select-none">✨</span>
                    <p className="text-xs sm:text-sm text-[#4E3F30] leading-relaxed font-semibold font-bengali">
                      মেহেদি একটু শুকিয়ে গেলে চাইলে লবঙ্গের তাপ নিতে পারেন।
                    </p>
                  </div>

                  <div className="flex gap-3.5 items-start p-3.5 bg-[#FFFDF6] hover:bg-[#FFFBF0] rounded-xl border border-[#FAEDCD]/40 transition-colors">
                    <span className="text-amber-600 mt-0.5 text-base shrink-0 select-none">✨</span>
                    <p className="text-xs sm:text-sm text-[#4E3F30] leading-relaxed font-semibold font-bengali">
                      হাতে একটি ওড়না পেঁচিয়ে রাখলে মেহেদি সহজে ঝরে পড়বে না।
                    </p>
                  </div>

                  <div className="flex gap-3.5 items-start p-3.5 bg-[#FFFDF6] hover:bg-[#FFFBF0] rounded-xl border border-[#FAEDCD]/40 transition-colors">
                    <span className="text-amber-600 mt-0.5 text-base shrink-0 select-none">✨</span>
                    <p className="text-xs sm:text-sm text-[#4E3F30] leading-relaxed font-semibold font-bengali">
                      মেহেদি উঠানোর সময় সরিষার তেল ব্যবহার করুন। এতে আরও গাঢ় ও সুন্দর ডার্ক স্টেইন পাওয়া যায়।
                    </p>
                  </div>
                </div>
              </div>

              {/* Sweet note badge sticker aesthetics */}
              <div className="mt-8 pt-6 border-t border-[#E3F0E1] text-center">
                <span className="inline-block text-[11px] text-[#5D7A5C] font-bold bg-[#EAF4E8] border border-[#D2E4D0] py-1.5 px-4 rounded-xl font-bengali uppercase tracking-wider">
                  🌿 প্রাকৃতিক ও নিরাপদ মেহেদীর শতভাগ রঙের নিশ্চয়তা
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer reviews and test gallery */}
      <CustomerExperience />

      {/* Order formulation & dynamic delivery calculators */}
      <div ref={checkoutRef}>
        <CheckoutSection
          cart={cart}
          setCart={setCart}
          onOrderSuccess={handleOrderSuccessCallback}
          onMinQtyError={() => setIsMinQtyAlertOpen(true)}
        />
      </div>

      {/* Footer copyright metrics info */}
      <footer className="mt-8 border-t border-[#EADFC9]/60 pt-10 pb-6 text-center text-xs text-slate-550 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mb-6">
          <div className="text-left sm:max-w-xs">
            <h4 className="text-slate-800 font-serif italic font-bold text-lg">Jannat's Henna</h4>
            <p className="text-[11px] text-slate-550 leading-relaxed mt-1 font-bengali">
              শতভাগ অরগানিক পদ্ধতিতে প্রস্তুতকৃত প্রিমিয়াম মানের মেহেদী। কোনো কৃত্রিম কালার, অ্যাসিড কিংবা ক্ষতিকারক কেমিক্যাল ছাড়াই আমাদের মেহেদি দেয় গাঢ় খয়েরী রঙ।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.facebook.com/share/19D7XXhtWS/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-xs rounded-full bg-white border border-[#8FA88B]/35 text-slate-700 hover:bg-[#FAF6EE] hover:scale-105 transition-all font-bold"
              title="Official Facebook Page"
            >
              <span>ফেসবুক পেজ ফলো করুন</span>
            </a>
          </div>
        </div>

        <div className="border-t border-[#EADFC9]/50 pt-6 text-[11px] text-slate-400">
          <p>জান্নাত’স অর্গানিক মেহেদী ও কসমেটিক্স ব্রাউজার ক্যাশ পোর্টাল © ২০২৬। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>

      {/* 🔒 Secure Admin Panel Portal placed discreetly below footer */}
      <AdminPanel onOrdersUpdated={loadOrders} onAdminLoginStateChange={setIsAdminLoggedIn} />

      {/* Global Slide out Side drawer for shopping cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        district={district}
        setDistrict={setDistrict}
        scrollToSection={scrollToSection}
        onMinQtyError={() => setIsMinQtyAlertOpen(true)}
      />

      {/* Global Minimum order requirement notification popup */}
      <QuantityAlertModal
        isOpen={isMinQtyAlertOpen}
        onClose={() => setIsMinQtyAlertOpen(false)}
        onAutoCorrect={handleAutoSetMinimum}
        onChooseDifferent={() => scrollToSection('products-shelf')}
      />

      {/* Floating Bottom Cart indicator trigger on mobile */}
      {cart.length > 0 && !isCartOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4.5 rounded-2xl bg-gradient-to-r from-[#cfa856] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-white shadow-xl flex items-center justify-center transition-all cursor-pointer group"
        >
          <ShoppingCart className="h-6 w-6 stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-bounce">
            {cart.reduce((v, i) => v + i.quantity, 0)}
          </span>
        </motion.button>
      )}

      {/* Floating back to top anchor scroll indicator */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-7 z-40 p-2.5 rounded-xl bg-white hover:bg-[#FAF6EE] border border-[#8FA88B]/25 text-slate-700 hover:text-[#5D7A5C] shadow-sm cursor-pointer transition-all scale-90"
          title="Scroll To Top"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      )}

      {/* Premium Order Successful Final Confetti Modal Popup Invoice Sheet */}
      <AnimatePresence>
        {newlyCreatedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl bg-white border border-[#8FA88B]/30 rounded-3xl overflow-hidden shadow-2xl relative text-left"
            >
              
              {/* Top celebration header icon */}
              <div className="bg-[#FAF6EE] text-center py-8 border-b border-[#EADFC9]/50 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#cfa856]/5 rounded-full blur-2xl pointer-events-none" />
                
                <CheckCircle2 className="h-14 w-14 text-amber-500 mx-auto stroke-[1.5] mb-2 animate-bounce" />
                
                <span className="text-[10px] sm:text-xs font-semibold text-[#5D7A5C] uppercase tracking-widest bg-white px-3.5 py-1 rounded-xl border border-[#8FA88B]/30 shadow-sm">
                  অর্ডার সফলভাবে জমা হয়েছে! 🎉
                </span>
                
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-800 mt-2.5 font-bengali">
                  ধন্যবাদ আপু, আপনার অর্ডারটি প্লেসড হয়েছে
                </h3>
              </div>

              {/* Receipt Body content */}
              <div className="p-6 space-y-4">
                
                {/* ID Card info bar */}
                <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-[#EADFC9]/50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold">অর্ডার নম্বর (Order ID):</p>
                    <p className="font-mono text-base font-bold text-amber-600 tracking-wider font-display">
                      {newlyCreatedOrder.id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-semibold">অর্ডারের অবস্থা (Status):</p>
                    <span className="inline-flex items-center text-[10px] bg-[#FAF6EE] text-[#5D7A5C] font-bold border border-[#8FA88B]/30 px-2.5 py-0.5 rounded-full mt-0.5">
                      ● অর্ডার ভেরিফাই হচ্ছে
                    </span>
                  </div>
                </div>

                {/* Shipping Details and details checklist */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <h4 className="text-[11px] font-bold text-[#cfa856] uppercase tracking-wider">ডেলিভারি ঠিকানা ও বিবরণ:</h4>
                  <p><span className="text-slate-550 font-bold">গ্রাহক নাম:</span> {newlyCreatedOrder.customerName}</p>
                  <p><span className="text-slate-550 font-bold">মোবাইল নম্বর:</span> {newlyCreatedOrder.phone}</p>
                  <p><span className="text-slate-550 font-bold">শিপিং ঠিকানা:</span> {newlyCreatedOrder.address}, {newlyCreatedOrder.upazila}, {newlyCreatedOrder.district}</p>
                  <p><span className="text-slate-550 font-bold">অর্ডারের সময়:</span> {newlyCreatedOrder.orderDate}</p>
                </div>

                {/* Items and offers details breakdown list */}
                <div className="pt-3 border-t border-[#EADFC9]/40 space-y-2.5">
                  <h4 className="text-[11px] font-bold text-[#cfa856] uppercase tracking-wider">ক্রয়কৃত পণ্যের সংক্ষিপ্ত বিবরণী:</h4>
                  
                  <div className="space-y-1.5 shrink-0">
                    {newlyCreatedOrder.products.map((prod, i) => (
                      <div key={i} className="flex justify-between text-xs text-slate-700 font-serif">
                        <span>{prod.productName} ({prod.quantity} পিস)</span>
                        <span className="font-bold">{prod.price * prod.quantity} টাকা</span>
                      </div>
                    ))}
                  </div>

                  {newlyCreatedOrder.freeOptionApplied.freeCones > 0 && (
                    <div className="p-2.5 rounded bg-[#FAF6EE] border border-[#8FA88B]/20 text-[#5D7A5C] text-[11px] font-bold flex items-center gap-1.5">
                      <Gift className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>ঈদ প্রোমো গিফট: অতিরিক্ত {newlyCreatedOrder.freeOptionApplied.freeCones} পিস মেহেদী সম্পূর্ণ ফ্রি!</span>
                    </div>
                  )}

                  {/* Calculations metrics slip details */}
                  <div className="space-y-1.5 text-xs pt-2 border-t border-[#EADFC9]/30">
                    <div className="flex justify-between text-slate-600">
                      <span>সাবটোটাল মূল্য:</span>
                      <span>{newlyCreatedOrder.subtotal} টাকা</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>পণ্য শিপিং চার্জ:</span>
                      <span>{newlyCreatedOrder.freeOptionApplied.freeDelivery ? 'ফ্রি ডেলিভারি' : `${newlyCreatedOrder.deliveryCharge} টাকা`}</span>
                    </div>
                    
                    {newlyCreatedOrder.bKashTrxID !== 'Free Delivery Promo' ? (
                      <div className="flex justify-between text-pink-600 font-medium">
                        <span>অগ্রিম পরিশোধকৃত সেন্ড মানি চার্জ:</span>
                        <span>-{newlyCreatedOrder.paidAmount} টাকা</span>
                      </div>
                    ) : null}

                    <div className="flex justify-between text-slate-800 text-base font-bold font-serif pt-2 border-t border-[#EADFC9]/45">
                      <span>বাকি ক্যাশ অন ডেলিভারি বিল:</span>
                      <span className="text-amber-600">
                        {newlyCreatedOrder.totalAmountPaid - (newlyCreatedOrder.bKashTrxID !== 'Free Delivery Promo' ? newlyCreatedOrder.paidAmount : 0)} টাকা
                      </span>
                    </div>
                  </div>
                </div>

                {/* Friendly WhatsApp order details forwarding alert */}
                <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#8FA88B]/25 text-slate-600 text-xs leading-relaxed">
                  <p className="font-bengali">
                    💡 **অর্ডার দ্রুত ডেলিভারি করার প্রসেস:** নিচে দেওয়া সবুজ বাটনে ক্লিক করে অর্ডারের ইনভয়েস কপিটি আপনার হোয়াটসঅ্যাপে আমাদের মডারেটরদের কাছে পাঠিয়ে দিন। আমরা দ্রুততম সময়ে আপনার ক্যাশ অন প্রোডাক্টটি কুরিয়ারে হস্তান্তর করবো!
                  </p>
                </div>

              </div>

              {/* Action triggers */}
              <div className="p-6 bg-[#FAF6EE] border-t border-[#EADFC9]/50 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/8801876661010?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম আপু,\nআমি Jannat's Henna ওয়েবসাইটে একটি প্রিমিয়াম মেহেদী অর্ডার প্লেস করেছি।\n\n🔹 অর্ডার নম্বর (Order ID): ${newlyCreatedOrder.id}\n🔹 নাম: ${newlyCreatedOrder.customerName}\n🔹 মোবাইল: ${newlyCreatedOrder.phone}\n🔹 জেলা: ${newlyCreatedOrder.district}\n🔹 থানা: ${newlyCreatedOrder.upazila}\n🔹 ঠিকানা: ${newlyCreatedOrder.address}\n\n🔹 পণ্যের বিবরণ:\n${newlyCreatedOrder.products.map(p => `- ${p.productName} (Qty: ${p.quantity})`).join('\n')}\n${newlyCreatedOrder.freeOptionApplied.freeCones > 0 ? `🎁 ঈদ গিফট: অতিরিক্ত ${newlyCreatedOrder.freeOptionApplied.freeCones} পিস ফ্রি!` : ''}\n\n🔹 মোট প্রদেয় ক্যাশ অন ডেলিভারি: ${newlyCreatedOrder.totalAmountPaid} টাকা।\n\nঅনুগ্রহ করে আমার অর্ডারটি ভেরিফাই করুন। ধন্যবাদ!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-[#5D7A5C] hover:bg-[#4E6A4D] text-white text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95 transition-all"
                >
                  <Phone className="h-4.5 w-4.5 text-white" />
                  <span>হোয়াটসঅ্যাপ মেসেজ দিন ↗</span>
                </a>

                <button
                  onClick={() => setNewlyCreatedOrder(null)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-[#cfa856] hover:bg-amber-400 text-white text-xs text-center cursor-pointer shadow active:scale-95 transition-all"
                >
                  ইনভয়েস বন্ধ করুন
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
