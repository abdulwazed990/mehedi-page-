/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Truck, Gift, Copy, Check, Facebook, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { CartItem, Order } from '../types';
import { districtsOfBangladesh, upazilasOfBangladesh } from '../data';

interface CheckoutSectionProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderSuccess: (order: Order) => void;
  onMinQtyError?: () => void;
}

export default function CheckoutSection({ cart, setCart, onOrderSuccess, onMinQtyError }: CheckoutSectionProps) {
  // Form States
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [upazila, setUpazila] = useState('');
  const [address, setAddress] = useState('');

  // bKash States
  const [isBKashModalOpen, setIsBKashModalOpen] = useState(false);
  const [bKashSender, setBKashSender] = useState('');
  const [bKashTrxID, setBKashTrxID] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Calculate quantities and rewards
  const totalQty = cart.reduce((val, item) => val + item.quantity, 0);
  const subtotal = cart.reduce((val, item) => val + (item.product.price * item.quantity), 0);

  // Delivery configuration
  const baseDeliveryCharge = district === 'ঢাকা' ? 70 : 150;
  
  // Offer calculations
  const hasFreeDelivery = totalQty >= 3;
  const deliveryChargeBeforeDiscount = baseDeliveryCharge;
  const deliveryCharge = hasFreeDelivery ? 0 : baseDeliveryCharge;

  let freeCones = 0;
  if (totalQty >= 10) {
    freeCones = 2;
  } else if (totalQty >= 5) {
    freeCones = 1;
  }

  const grandTotal = subtotal + deliveryCharge;

  // Sync upazila selection
  useEffect(() => {
    const list = upazilasOfBangladesh[district];
    if (list && list.length > 0) {
      setUpazila(list[0]);
    } else {
      setUpazila('');
    }
  }, [district]);

  // Adjust cart quantities directly inside order manager
  const updateQuantity = (productId: string, delta: number) => {
    if (delta < 0 && totalQty <= 2) {
      onMinQtyError?.();
      return;
    }
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty > 0 ? nextQty : 1 };
          }
          return item;
        })
    );
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('+8801876661010');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Triggered when order is initially placed (checking validation)
  const handleInitiateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("দুঃখিত! কোনো প্রোডাক্ট কার্টে যোগ করা হয়নি। অনুগ্রহ করে যেকোনো মেহেদী আগে কার্টে যোগ করুন।");
      return;
    }
    if (totalQty < 2) {
      onMinQtyError?.();
      return;
    }
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert("অনুগ্রহ করে আপনার নাম, মোবাইল নাম্বার এবং সম্পূর্ণ ডেলিভারি ঠিকানা সঠিকভাবে লিখুন।");
      return;
    }
    if (phone.length < 11) {
      alert("অনুগ্রহ করে সচল ১১ ডিজিটের মোবাইল নাম্বার দিন।");
      return;
    }

    // Opens the Premium bKash Modal/Interface to pay delivery charge or full amount
    setIsBKashModalOpen(true);
  };

  // Triggered when bKash transaction is completed/submitted
  const handleConfirmOrder = () => {
    setValidationError('');

    // If delivery is NOT free, a payment bKash Trx is required
    if (!hasFreeDelivery) {
      if (!bKashSender.trim() || bKashSender.length < 11) {
        setValidationError('অনুগ্রহ করে সঠিক বিকাশ প্রেরক নাম্বার (১১ সংখ্যা) লিখুন।');
        return;
      }
      if (!bKashTrxID.trim() || bKashTrxID.length < 5) {
        setValidationError('অনুগ্রহ করে সঠিক বিকাশ লেনদেন আইডি (Transaction ID) সাবমিট করুন।');
        return;
      }
    }

    // Build unique Order ID
    const sampleOrderID = `JH-${Date.now().toString().slice(-6)}`;

    // Build local state object
    const newOrder: Order = {
      id: sampleOrderID,
      customerName,
      phone,
      district,
      upazila,
      address,
      products: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.nameBangla,
        quantity: item.quantity,
        price: item.product.price
      })),
      quantity: totalQty,
      subtotal,
      deliveryCharge,
      freeOptionApplied: {
        freeDelivery: hasFreeDelivery,
        freeCones: freeCones
      },
      totalAmountPaid: grandTotal,
      bKashSender: hasFreeDelivery ? 'Free Delivery Promo' : bKashSender,
      bKashTrxID: hasFreeDelivery ? 'Free Delivery Promo' : bKashTrxID,
      paidAmount: hasFreeDelivery ? 0 : deliveryCharge, // Paid delivery charge upfront
      orderDate: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Pending Verification'
    };

    // Store in localStorage for persistence
    const savedOrdersString = localStorage.getItem('jannats_henna_orders');
    const savedOrdersArr = savedOrdersString ? JSON.parse(savedOrdersString) : [];
    localStorage.setItem('jannats_henna_orders', JSON.stringify([newOrder, ...savedOrdersArr]));

    // Success response callback and empty cart
    setIsBKashModalOpen(false);
    setCart([]);
    onOrderSuccess(newOrder);

    // Reset checkout form fields
    setCustomerName('');
    setPhone('');
    setAddress('');
    setBKashSender('');
    setBKashTrxID('');
  };

  return (
    <section className="bg-gradient-to-b from-[#F4EFE6] to-[#FAF6EE] py-14 px-4 scroll-mt-20 border-b border-[#EADFC9]/65" id="checkout-form-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#5D7A5C] uppercase tracking-widest bg-[#8FA88B]/10 px-3.5 py-1.5 rounded-full border border-[#8FA88B]/35">
            ঝটপট নিশ্চিত করুন
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-800 mt-2.5 mb-3">
            ক্যাশ অন ডেলিভারি অর্ডার প্লেসমেন্ট
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bengali max-w-lg mx-auto leading-relaxed">
            নিচের ফর্মটি পূরণ করে অর্ডারটি সম্পূর্ণ করুন। ৩+ পিস পছন্দ করলেই কোনো ডেলিভারি চার্জ লাগবে না!
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-[#8FA88B]/20 rounded-3xl p-10 text-center max-w-xl mx-auto shadow-sm select-none">
            <ShoppingBag className="h-12 w-12 text-[#8FA88B]/25 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">কার্টটি বর্তমানে খালি</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
              অনুগ্রহ করে উপরে প্রোডাক্ট সেকশন থেকে আপনার পছন্দের অর্গানিক মেহেদী বাছাই করে কার্টে যোগ করুন।
            </p>
            <button
              onClick={() => {
                const shelf = document.getElementById('products-shelf');
                if (shelf) shelf.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5D7A5C] hover:bg-[#4E6A4D] text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              মেহেদী বাছাই করুন →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Checkout Inputs Form with clean white backgrounds */}
            <div className="lg:col-span-7 bg-white border border-[#8FA88B]/25 rounded-3xl p-5 sm:p-7 shadow-sm">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#cfa856]" />
                <span>২ মিনিটের দ্রুত ডেলিভারি ফরম</span>
              </h3>

              <form onSubmit={handleInitiateOrder} className="space-y-5 text-left">
                {/* Full Name */}
                <div>
                  <label htmlFor="customer-name" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    আপনার সম্পূর্ণ নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customer-name"
                    required
                    placeholder="উদাঃ জান্নাতুল ফেরদৌস"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#FAF6EE]/55 border border-[#8FA88B]/25 rounded-xl px-4 py-3 text-slate-805 text-xs sm:text-sm focus:border-amber-500/70 focus:outline-none focus:bg-white transition-colors"
                  />
                </div>

                {/* Mobile Phone */}
                <div>
                  <label htmlFor="customer-phone" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    মোবাইল নাম্বার (বিকাশ অথবা সচল নাম্বার) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-xs font-bold text-slate-400">+88</span>
                    <input
                      type="tel"
                      id="customer-phone"
                      required
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={11}
                      className="w-full bg-[#FAF6EE]/55 border border-[#8FA88B]/25 rounded-xl pl-12 pr-4 py-3 text-slate-805 text-xs sm:text-sm focus:border-amber-500/70 focus:outline-none focus:bg-white transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* District and Upazila Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customer-district" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      জেলা নির্বাচন করুন <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="customer-district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-[#FAF6EE]/55 border border-[#8FA88B]/25 rounded-xl px-4 py-3 text-slate-805 text-xs sm:text-sm focus:border-amber-500/70 focus:outline-none focus:bg-white transition-colors cursor-pointer"
                    >
                      {districtsOfBangladesh.map((dist) => (
                        <option key={dist} value={dist} className="bg-white text-slate-800">
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="customer-upazila" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      থানা/উপজেলা <span className="text-rose-500">*</span>
                    </label>
                    {upazilasOfBangladesh[district] ? (
                      <select
                        id="customer-upazila"
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full bg-[#FAF6EE]/55 border border-[#8FA88B]/25 rounded-xl px-4 py-3 text-slate-805 text-xs sm:text-sm focus:border-amber-500/70 focus:outline-none focus:bg-white transition-colors cursor-pointer"
                      >
                        {upazilasOfBangladesh[district].map((up) => (
                          <option key={up} value={up} className="bg-white text-slate-850">
                            {up}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="customer-upazila"
                        required
                        placeholder="উদাঃ ধানমন্ডি"
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full bg-[#FAF6EE]/55 border border-[#8FA88B]/25 rounded-xl px-4 py-3 text-slate-805 text-xs sm:text-sm focus:border-amber-500/70 focus:outline-none focus:bg-white transition-colors"
                      />
                    )}
                  </div>
                </div>

                {/* Detailed Address */}
                <div>
                  <label htmlFor="customer-address" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    সম্পূর্ণ এলাকা ও বিল্ডিং ঠিকানা <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="customer-address"
                    required
                    rows={3}
                    placeholder="উদাঃ বাসা নং ২৪, রোড নং ৩, ব্লক-সি, মিরপুর-১১, ঢাকা"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#FAF6EE]/55 border border-[#8FA88B]/25 rounded-xl px-4 py-3 text-slate-805 text-xs sm:text-sm focus:border-amber-500/70 focus:outline-none focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-[#cfa856] hover:from-amber-400 hover:to-amber-500 text-white shadow-md shadow-amber-500/5 hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer font-sans text-xs sm:text-sm"
                  >
                    <ShoppingBag className="h-5 w-5 stroke-[2]" />
                    <span>অর্ডার কনফার্ম করুন</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Checkout Items Summary Tally */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="bg-white border border-[#8FA88B]/25 rounded-3xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 text-[#8FA88B]/10 pointer-events-none">
                  <Gift className="h-full w-full" />
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-850 mb-4 pb-3 border-b border-[#EADFC9]/50">
                  আপনার কার্ট আইটেমস ({totalQty} পিস)
                </h3>

                {/* Items loop */}
                <div className="divide-y divide-[#EADFC9]/40 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-3 flex items-center gap-3">
                      {/* Leaf badge icon as fallback visual representation to prevent broken images */}
                      <div className="h-10 w-10 rounded-lg bg-[#FAF6EE] border border-[#8FA88B]/25 flex items-center justify-center text-[#5D7A5C] shrink-0 text-sm font-bold shadow-inner">
                        🌿
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                          {item.product.nameBangla}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          ওজন: {item.product.weightRange}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {/* +/- counter inside tally */}
                        <div className="flex items-center bg-slate-50 border border-[#8FA88B]/20 rounded p-0.5 scale-90">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="h-5 w-5 text-[#5D7A5C] hover:bg-white rounded flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-slate-750">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="h-5 w-5 text-[#5D7A5C] hover:bg-white rounded flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                        
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {item.product.price * item.quantity} টাকা
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic offer details badge */}
                {freeCones > 0 && (
                  <div className="mt-4 p-3 bg-[#FFEAEA] border border-pink-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-bold animate-pulse">
                    <Gift className="h-4 w-4 shrink-0" />
                    <span>অভিনন্দন! ঈদ অফারে পাচ্ছেন অতিরিক্ত {freeCones} পিস মেহেদী সম্পূর্ণ ফ্রি।</span>
                  </div>
                )}

                {/* Prices Tally list */}
                <div className="space-y-2.5 pt-4 border-t border-[#EADFC9]/50 text-xs mt-4 text-slate-550">
                  <div className="flex justify-between">
                    <span>সাবটোটাল মূল্য</span>
                    <span className="font-bold text-slate-850">{subtotal} টাকা</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      <span>হোম ডেলিভারি চার্জ ({district})</span>
                    </span>
                    {hasFreeDelivery ? (
                      <span className="text-[#5D7A5C] font-bold bg-[#8FA88B]/15 px-2.5 py-0.5 rounded border border-[#8FA88B]/25 text-[10px]">
                        ফ্রি হোম ডেলিভারি 🎁
                      </span>
                    ) : (
                      <span className="font-bold text-slate-800 font-mono">{deliveryChargeBeforeDiscount} টাকা</span>
                    )}
                  </div>

                  {/* Free Delivery Promo Motivation */}
                  {!hasFreeDelivery && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] sm:text-xs rounded-xl mt-2 text-center font-semibold">
                      আর মাত্র {3 - totalQty} পিস যোগ করলেই পাবেন সম্পূর্ণ ফ্রি ডেলিভারি!
                    </div>
                  )}

                  <div className="flex justify-between text-slate-800 font-bold text-base sm:text-lg border-t border-[#EADFC9]/50 pt-3 mt-3">
                    <span>সর্বমোট প্রদেয় বিল</span>
                    <span className="text-amber-600">{grandTotal} টাকা</span>
                  </div>
                </div>
              </div>

              {/* Security Shield Sign */}
              <div className="bg-white p-4.5 border border-[#8FA88B]/25 rounded-3xl flex items-center gap-3 shadow-sm select-none">
                <ShieldCheck className="h-10 w-10 text-[#5D7A5C] shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-805">১০০% ক্যাশ অন ডেলিভারি</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed font-bengali mt-0.5">
                    পণ্য হাতে পেয়ে পুরোপুরি লাইভ চেক করে সন্তুষ্ট হয়ে তবেই মূল্য পরিশোধ করুন। কোনো রকমের লুকানো ফি বা অতিরিক্ত আজেবাজে চাষ নেই।
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Premium bKash Payment Popup Modal */}
        <AnimatePresence>
          {isBKashModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm bg-[#e2136e] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#ff3290]"
              >
                
                {/* Official Signature Logo Frame */}
                <div className="bg-[#d11164] py-5 px-6 flex items-center justify-between border-b border-[#fe2e8f] relative">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbnyuS-YC27I4ySpgdmbsHewa5jYjNIzc2XsYseIwtPmn3R12_AFwdRA&s=10"
                      alt="bKash Logo"
                      className="h-10 bg-white p-1 rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-white text-left">
                      <h4 className="text-sm font-bold tracking-wide font-serif"> জান্নাত’স বিকাশ গেটওয়ে</h4>
                      <p className="text-[9px] text-pink-100 uppercase tracking-widest font-mono">bKash Merchant Pay</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBKashModalOpen(false)}
                    className="text-white hover:text-pink-200 bg-white/10 rounded-full h-8 w-8 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Instructions Body */}
                <div className="p-6 text-white text-left space-y-4">
                  {hasFreeDelivery ? (
                    /* Free Delivery Promo logic */
                    <div className="space-y-4 bg-pink-900/10 border border-pink-400/20 p-5 rounded-2xl text-center">
                      <Gift className="h-9 w-9 text-amber-300 mx-auto animate-bounce" />
                      <h4 className="text-base font-bold text-amber-200">অভিনন্দন! আপনার ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!</h4>
                      <p className="text-xs text-pink-100 leading-relaxed font-bengali">
                        ঈদ ধামাকা অফারে ৩+ পিস যুক্ত করায় আপনার জন্য অগ্রিম কোনো ভেরিফিকেশন পেমেন্টের প্রয়োজন নেই। আপনি সরাসরি নিচের বাটনে ক্লিক করে ফুল ক্যাশ-অন-ডেলিভারি অর্ডারটি সম্পন্ন করতে পারেন!
                      </p>
                      
                      <div className="text-xs text-white/90 bg-black/25 p-2.5 rounded-xl border border-pink-500/20 font-bold font-mono">
                        ১০০% ক্যাশ অন ডেলিভারি টোটাল: {grandTotal} টাকা
                      </div>
                    </div>
                  ) : (
                    /* Paid Delivery Charge logic */
                    <div className="space-y-4">
                      
                      <div className="bg-pink-950/20 p-4 rounded-xl border border-pink-400/20">
                        <p className="text-xs text-pink-100 leading-relaxed font-bengali flex items-start gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>অর্ডার কনফার্ম করতে আগে ডেলিভারি চার্জ <span className="font-bold underline text-white">Send Money</span> করুন।</span>
                        </p>
                        
                        <div className="flex justify-between items-center text-xs mt-3 pt-2.5 border-t border-pink-500/20 text-pink-200">
                          <span>প্রদেয় ডেলিভারি চার্জ:</span>
                          <span className="text-lg font-serif font-bold text-white bg-[#d11164] px-3 py-1 rounded">{deliveryCharge} টাকা</span>
                        </div>
                      </div>

                      {/* Number Card */}
                      <div className="bg-black/25 p-4 rounded-xl border border-pink-500/25 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-pink-100">বিকাশ পার্সোনাল নাম্বার:</p>
                          <p className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">+880 1876-661010</p>
                          <p className="text-[9px] text-pink-200/80 mt-0.5 font-semibold">টাইপ: Personal (Send Money)</p>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-pink-700 hover:bg-pink-100 text-xs font-bold transition-all shadow cursor-pointer"
                        >
                          {copied ? (
                            <span>কপি হয়েছে</span>
                          ) : (
                            <span>কপি করুন</span>
                          )}
                        </button>
                      </div>

                      {/* Input fields */}
                      <div className="space-y-3 pt-2">
                        {/* Sender Number */}
                        <div>
                          <label className="block text-xs font-bold text-pink-100 mb-1">
                            ১. যে নাম্বার থেকে সেন্ড করেছেন (Sender Number):
                          </label>
                          <input
                            type="tel"
                            maxLength={11}
                            placeholder="01XXXXXXXXX"
                            value={bKashSender}
                            onChange={(e) => setBKashSender(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full bg-white text-gray-900 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-white font-mono font-bold"
                          />
                        </div>

                        {/* Transaction ID */}
                        <div>
                          <label className="block text-xs font-bold text-pink-100 mb-1">
                            ২. বিকাশ ট্রানজেকশন আইডি (Transaction ID):
                          </label>
                          <input
                            type="text"
                            placeholder="যেমনঃ AM87YTR59"
                            value={bKashTrxID}
                            onChange={(e) => setBKashTrxID(e.target.value.toUpperCase().trim())}
                            className="w-full bg-white text-gray-900 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-white font-mono font-bold"
                          />
                        </div>
                      </div>

                    </div>
                  )}

                  {validationError && (
                    <p className="text-xs bg-red-900 text-red-100 p-2.5 rounded-lg text-center font-bold">
                      ⚠️ {validationError}
                    </p>
                  )}

                  {/* Submission and confirmations */}
                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsBKashModalOpen(false)}
                      className="flex-1 py-3 text-center rounded-xl bg-pink-900 text-pink-100 text-xs font-bold border border-pink-400/20 hover:bg-pink-950 transition-all cursor-pointer"
                    >
                      বাতিল করুন
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleConfirmOrder}
                      className="flex-1 py-3 text-center rounded-xl bg-white text-pink-800 text-xs font-bold hover:bg-pink-100 shadow-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="h-4.5 w-4.5 text-[#e2136e]" />
                      <span>অর্ডার প্লেস করুন</span>
                    </button>
                  </div>
                </div>

                {/* Footer disclaimer */}
                <div className="bg-[#99044b] py-3 text-center text-[10px] text-pink-200 select-none">
                  নিরাপদ ও বিশ্বস্ত শপিং ও উৎসব মেজাজ - Jannat's Henna © 2026
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
