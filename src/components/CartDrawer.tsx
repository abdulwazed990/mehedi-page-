/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Trash2, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  district: string;
  setDistrict: (district: string) => void;
  scrollToSection: (id: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  setCart,
  district,
  setDistrict,
  scrollToSection
}: CartDrawerProps) {
  const totalCartQty = cart.reduce((val, item) => val + item.quantity, 0);
  const subtotal = cart.reduce((val, item) => val + (item.product.price * item.quantity), 0);
  
  // Delivery config
  const baseDeliveryCharge = district === 'ঢাকা' ? 70 : 150;
  const isFreeDelivery = totalCartQty >= 3;
  const deliveryCharge = isFreeDelivery ? 0 : baseDeliveryCharge;

  let freeCones = 0;
  if (totalCartQty >= 10) {
    freeCones = 2;
  } else if (totalCartQty >= 5) {
    freeCones = 1;
  }

  const grandTotal = subtotal + deliveryCharge;

  const updateQuantity = (productId: string, val: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + val;
            return { ...item, quantity: nextQty > 0 ? nextQty : 1 };
          }
          return item;
        })
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckoutClick = () => {
    onClose();
    setTimeout(() => {
      scrollToSection('checkout-form-section');
    }, 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Black glass overlay backplate */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10" id="cart-drawer-container">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#FAF6EE] border-l border-[#EADFC9]/75 text-left flex flex-col justify-between shadow-2xl"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#EADFC9]/50 flex items-center justify-between bg-white/70">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-[#5D7A5C]" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-slate-800">আপনার শপিং ব্যাগ</h3>
                  <span className="bg-[#8FA88B]/15 text-[#5D7A5C] text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {totalCartQty}
                  </span>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1 px-2.5 text-slate-500 hover:text-[#5D7A5C] transition-colors bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>বন্ধ করুন</span>
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Cart List */}
              <div className="flex-grow overflow-y-auto px-5 py-3 divide-y divide-[#EADFC9]/40">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-72 text-center select-none">
                    <ShoppingCart className="h-12 w-12 text-[#8FA88B]/30 mb-3" />
                    <h4 className="text-slate-800 font-bold mb-1">কার্টটি খালি!</h4>
                    <p className="text-xs text-slate-400 max-w-xs font-bengali">
                      আপনার পছন্দমতো খাঁটি সুজি পাতা মেহেদী কার্টে যোগ করতে শপ ভিজিট করুন।
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="py-4 flex items-center gap-3">
                      {/* Beautiful Leaf emblem representation */}
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white to-[#FFEAEA] border border-[#8FA88B]/25 flex items-center justify-center text-[#5D7A5C] shrink-0 font-serif text-lg shadow-sm">
                        🌿
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="text-sm font-bold text-slate-800">
                          {item.product.nameBangla}
                        </h4>
                        <p className="text-[11px] text-[#5D7A5C] font-mono mt-0.5">
                          {item.product.price} টাকা / পিস | ওজন: {item.product.weightRange}
                        </p>
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center mt-2.5 bg-white border border-[#8FA88B]/20 rounded-lg p-0.5 w-fit">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="h-6 w-6 text-[#5D7A5C] hover:bg-[#FAF6EE] rounded flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="h-6 w-6 text-[#5D7A5C] hover:bg-[#FAF6EE] rounded flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between shrink-0 h-16">
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 bg-slate-100 hover:bg-rose-50 rounded transition-all cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <span className="text-sm font-bold text-slate-800 font-mono">
                          {item.product.price * item.quantity} টাকা
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer pricing sheet */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-[#EADFC9]/50 bg-white space-y-4">
                  {/* Delivery charge fast simulation selector */}
                  <div className="p-3.5 bg-[#FAF6EE] rounded-2xl border border-[#8FA88B]/15 text-xs text-slate-600">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="font-bold">ডেলিভারি এলাকা সিলেক্ট করুন:</span>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="bg-white border border-[#8FA88B]/25 text-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-[#cfa856] font-medium cursor-pointer"
                      >
                        <option value="ঢাকা">ঢাকার ভিতরে (৭০ টাকা)</option>
                        <option value="রংপুর">ঢাকার বাহিরে (১৫০ টাকা)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#EADFC9]/40">
                      <span>ডেলিভারি চার্জ:</span>
                      {isFreeDelivery ? (
                        <span className="text-[#5D7A5C] font-bold bg-[#8FA88B]/15 border border-[#8FA88B]/25 px-2 py-0.5 rounded text-[10px]">ফ্রি ডেলিভারি 🎁</span>
                      ) : (
                        <span className="font-bold font-mono">{baseDeliveryCharge} টাকা</span>
                      )}
                    </div>
                  </div>

                  {/* Free Cones Display */}
                  {freeCones > 0 && (
                    <div className="p-2.5 bg-[#FFEAEA] border border-pink-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse">
                      <Gift className="h-4 w-4 shrink-0" />
                      <span>ঈদ অফার: পাচ্ছেন অতিরিক্ত +{freeCones} পিস মেহেদী গিফট!</span>
                    </div>
                  )}

                  {/* Price breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-550">
                    <div className="flex justify-between">
                      <span>সাবটোটাল মূল্য:</span>
                      <span className="text-slate-800 font-bold font-mono">{subtotal} টাকা</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-800 pt-2 border-t border-[#EADFC9]/40">
                      <span>টোটাল প্রদেয় মূল্য:</span>
                      <span className="text-amber-600 text-lg font-bold font-mono">{grandTotal} টাকা</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-amber-500 to-[#cfa856] text-white font-bold text-center block text-xs shadow-md shadow-amber-500/10 cursor-pointer hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5 font-sans"
                  >
                    <span>অর্ডারের দিকে এগিয়ে যান</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
                    <X className="h-3.5 w-3.5" />
                    <span>১০০% প্রিমিয়াম ও নিরাপদ অর্গানিক কোণ</span>
                  </div>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}
