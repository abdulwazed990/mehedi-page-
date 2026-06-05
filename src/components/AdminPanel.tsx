/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Jannat's Henna Admin Control System - Fully Optimized, Ultra-Secure
 * Featuring: Soft Sweet Green Garden Theme, Date-to-Date Statement reports,
 * double database persistence mirroring, and default expanded detailed logs.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Key, LogOut, Check, X, Clipboard, Inbox, RefreshCw, 
  Search, Shield, Truck, FileText, Settings, TrendingUp, Calendar, 
  AlertCircle, Gift, DollarSign, UserCheck, Eye, Copy, ArrowRight
} from 'lucide-react';
import { Order } from '../types';

// Password Utility - SHA-256 Encryption
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Bengali Numeral Parser Helper
function parseBengaliDate(orderDateStr: string): Date | null {
  if (!orderDateStr) return null;
  
  const bnToEnDigits: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  
  let converted = orderDateStr;
  for (const [bnDigit, enDigit] of Object.entries(bnToEnDigits)) {
    converted = converted.split(bnDigit).join(enDigit);
  }
  
  // Extract month index (0-11)
  const bnMonths: { [key: string]: number } = {
    'জানুয়ারি': 0, 'ফেব্রুয়ারি': 1, 'মার্চ': 2, 'এপ্রিল': 3,
    'মে': 4, 'জুন': 5, 'জুলাই': 6, 'আগস্ট': 7,
    'সেপ্টেম্বর': 8, 'অক্টোবর': 9, 'নভেম্বর': 10, 'ডিসেম্বর': 11
  };
  
  let month = 0;
  let foundMonth = false;
  for (const [mName, mIdx] of Object.entries(bnMonths)) {
    if (orderDateStr.includes(mName)) {
      month = mIdx;
      foundMonth = true;
      break;
    }
  }
  
  // Split spaces and commas to parse
  const cleanStr = converted.replace(/[,:/]/g, ' ');
  const parts = cleanStr.split(/\s+/).filter(Boolean);
  
  let year = new Date().getFullYear();
  const yearP = parts.find(p => p.length === 4 && /^\d+$/.test(p));
  if (yearP) {
    year = parseInt(yearP, 10);
  }
  
  let day = 1;
  const dayP = parts.find(p => /^\d+$/.test(p) && p.length <= 2 && p !== yearP);
  if (dayP) {
    day = parseInt(dayP, 10);
  }
  
  if (!foundMonth) {
    const fallbackDate = new Date(orderDateStr);
    if (!isNaN(fallbackDate.getTime())) {
      return fallbackDate;
    }
  }
  
  return new Date(year, month, day, 12, 0, 0);
}

interface AdminPanelProps {
  onOrdersUpdated: () => void;
  onAdminLoginStateChange?: (loggedIn: boolean) => void;
}

export default function AdminPanel({ onOrdersUpdated, onAdminLoginStateChange }: AdminPanelProps) {
  // Core State
  const [isOpenInput, setIsOpenInput] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('jannats_henna_admin_logged_in') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Notify parent component when admin login state changes
  useEffect(() => {
    sessionStorage.setItem('jannats_henna_admin_logged_in', isAdminLoggedIn ? 'true' : 'false');
    onAdminLoginStateChange?.(isAdminLoggedIn);
  }, [isAdminLoggedIn, onAdminLoginStateChange]);
  
  // Security States
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  
  // Active Navigation Mode
  const [activeMenu, setActiveMenu] = useState<'new' | 'running' | 'cancelled' | 'daily' | 'statement' | 'search' | 'settings'>('new');
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [dailyReportDate, setDailyReportDate] = useState<string>(''); // YYYY-MM-DD
  const [cancelReasonInput, setCancelReasonInput] = useState<{[orderId: string]: string}>({});
  const [activeCancelInputId, setActiveCancelInputId] = useState<string | null>(null);
  
  // Date-to-Date Statement States
  const [statementStartDate, setStatementStartDate] = useState('');
  const [statementEndDate, setStatementEndDate] = useState('');
  const [statementSearchQuery, setStatementSearchQuery] = useState('');
  
  // Password Change States
  const [currentPasswordConfirm, setCurrentPasswordConfirm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [settingsMessage, setSettingsMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });

  // Constants keys for security (Changed to v2 key to automatically reset and apply 12345678)
  const DEFAULT_PASSWORD_HASH_KEY = 'jannats_henna_admin_pass_hash_v2';
  const DEFAULT_PASSWORD_PLAINTEXT = '12345678';

  // Load orders with secure fallback replication system inside standard hook
  useEffect(() => {
    loadLocalOrders();
    initDefaultPasswordHash();
    
    // Default daily report to current date in timezone string
    const todayStr = new Date().toISOString().split('T')[0];
    setDailyReportDate(todayStr);
    
    // Set default statement date lookup ranges (Start: 7 Days prior, End: Current day)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    setStatementStartDate(sevenDaysAgo.toISOString().split('T')[0]);
    setStatementEndDate(todayStr);
  }, []);

  // Sync / monitor active inactivity session timeout triggers
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    const interval = setInterval(() => {
      const inactiveMs = Date.now() - lastActivity;
      const fiveMinutes = 5 * 60 * 1000;
      if (inactiveMs >= fiveMinutes) {
        handleLogout('নিরাপত্তার স্বার্থে ৫ মিনিট অ্যাক্টিভিটি না থাকায় সেশন স্বয়ংক্রিয়ভাবে বন্ধ করা হয়েছে।');
      }
    }, 10000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [isAdminLoggedIn, lastActivity]);

  // Lockout countdown timer reducer
  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;
    const timer = setTimeout(() => {
      setLockoutTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [lockoutTimeLeft]);

  const initDefaultPasswordHash = async () => {
    if (!localStorage.getItem(DEFAULT_PASSWORD_HASH_KEY)) {
      const defaultHash = await sha256(DEFAULT_PASSWORD_PLAINTEXT);
      localStorage.setItem(DEFAULT_PASSWORD_HASH_KEY, defaultHash);
    }
  };

  // Safe loading reads active data plus verifies mirrored backup is sync
  const loadLocalOrders = () => {
    const rawData = localStorage.getItem('jannats_henna_orders');
    const backupData = localStorage.getItem('jannats_henna_orders_backup');
    
    let parsedOrders: Order[] = [];
    
    if (rawData) {
      try {
        parsedOrders = JSON.parse(rawData);
      } catch (err) {
        console.error("Error decoding order dataset, trying backup recovery:", err);
      }
    }
    
    // Safe recovery trigger from mirror key
    if (parsedOrders.length === 0 && backupData) {
      try {
        parsedOrders = JSON.parse(backupData);
        localStorage.setItem('jannats_henna_orders', JSON.stringify(parsedOrders));
      } catch (e) {
        console.error("Backup dataset recovery failed too:", e);
      }
    }
    
    setOrders(parsedOrders);
  };

  // Overwrite database keys securely ensuring backups sync perfectly 
  const updateOrdersAndNotify = (newOrdersList: Order[]) => {
    localStorage.setItem('jannats_henna_orders', JSON.stringify(newOrdersList));
    localStorage.setItem('jannats_henna_orders_backup', JSON.stringify(newOrdersList)); // Secure mirror backup
    setOrders(newOrdersList);
    onOrdersUpdated();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimeLeft > 0) {
      setLoginError(`অতিরক্ত প্রবেশের ভুলের কারণে প্যানেলটি লক রয়েছে। ${lockoutTimeLeft} সেকেন্ড পর আবার টাইপ করুন।`);
      return;
    }

    if (!passwordInput.trim()) {
      setLoginError('দয়া করে সঠিক পাসওয়ার্ডটি টাইপ করুন।');
      return;
    }

    const inputHash = await sha256(passwordInput);
    const storedHash = localStorage.getItem(DEFAULT_PASSWORD_HASH_KEY);

    if (inputHash === storedHash) {
      setIsAdminLoggedIn(true);
      setLoginError('');
      setPasswordInput('');
      setFailedAttempts(0);
      setLastActivity(Date.now());
      loadLocalOrders();
    } else {
      const nextFailCount = failedAttempts + 1;
      setFailedAttempts(nextFailCount);
      setPasswordInput('');
      
      if (nextFailCount >= 5) {
        setLockoutTimeLeft(30);
        setLoginError('❌ টানা ৫ বার ভুল পাসওয়ার্ড দেওয়ার কারণে সিকিউরিটি অনুযায়ী ৩০ সেকেন্ডের জন্য এক্সেস লক করা হয়েছে!');
      } else {
        setLoginError(`ভুল পাসওয়ার্ড! চেষ্টা করুন আবার। (অবশিষ্ট সুযোগ: ${5 - nextFailCount} বার)`);
      }
    }
  };

  const handleLogout = (message?: string) => {
    setIsAdminLoggedIn(false);
    setActiveMenu('new');
    if (message) {
      setLoginError(message);
    } else {
      setLoginError('');
    }
  };

  // Clipboard copy feedback tool helper
  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Fast developer Dummy logs generation to play statement ranges immediately
  const handleSeedDummyOrders = () => {
    const defaultProducts = [
      { productId: "mehendi-combo-1", productName: "প্রাকৃতিক মেহেদী ঝটপট কম্বো-১ 🌿", quantity: 2, price: 350 },
      { productId: "mehendi-combo-2", productName: "ঈদ ধামাকা স্পেশাল কম্বো-২ 🌿", quantity: 1, price: 550 },
      { productId: "hand-henna-premium-large", productName: "অর্গানিক হেনা কোণ (প্রিমিয়াম)", quantity: 3, price: 120 }
    ];

    const dummyOrders: Order[] = [
      {
        id: "JH-982124",
        customerName: "তাসনোভা রহমান তানিয়া",
        phone: "01728345911",
        district: "ঢাকা",
        upazila: "মিরপুর",
        address: "রোড ২, ব্লক সি, মিরপুর ১০, ঢাকা",
        products: [defaultProducts[0]],
        quantity: 2,
        subtotal: 700,
        deliveryCharge: 0,
        freeOptionApplied: { freeDelivery: true, freeCones: 1 },
        totalAmountPaid: 700,
        bKashSender: "01728345911",
        bKashTrxID: "TRX8N9B10X",
        paidAmount: 70,
        orderDate: "০৫ জুন ২০২৬, দুপুর ১২:১৫ মিনিট",
        status: "Pending Verification"
      },
      {
        id: "JH-772189",
        customerName: "ফারিয়া সুলতানা জীম",
        phone: "01829334411",
        district: "চট্টগ্রাম",
        upazila: "কোতোয়ালি",
        address: "নূর ম্যানশন, জিসি মোড়, চট্টগ্রাম",
        products: [defaultProducts[1]],
        quantity: 1,
        subtotal: 550,
        deliveryCharge: 0,
        freeOptionApplied: { freeDelivery: true, freeCones: 1 },
        totalAmountPaid: 550,
        bKashSender: "01829334411",
        bKashTrxID: "TRX3K1P22M",
        paidAmount: 150,
        orderDate: "০৫ জুন ২০২৬, সকাল ১০:৩০ মিনিট",
        status: "Processing",
        deliveryStatus: "Processing"
      },
      {
        id: "JH-345321",
        customerName: "মালিহা জাহান রিয়া",
        phone: "01912998877",
        district: "সিলেট",
        upazila: "শাহজালাল উপশহর",
        address: "সেক্টর ৩, ৩য় রোড, শাহজালাল উপশহর, সিলেট",
        products: [defaultProducts[0], defaultProducts[2]],
        quantity: 5,
        subtotal: 1060,
        deliveryCharge: 0,
        freeOptionApplied: { freeDelivery: true, freeCones: 2 },
        totalAmountPaid: 1060,
        bKashSender: "01912998877",
        bKashTrxID: "TRX4492KJL",
        paidAmount: 130,
        orderDate: "০২ জুন ২০২৬, বিকাল ০৪:১০ মিনিট",
        status: "Delivered",
        deliveryStatus: "Delivered",
        deliveredDate: "০৪ জুন ২০২৬"
      },
      {
        id: "JH-552611",
        customerName: "নুসরাত জাহান মিম",
        phone: "01992113322",
        district: "রাজশাহী",
        upazila: "বোয়ালিয়া",
        address: "মহিষবাথান মোড়, মিম কুটির, রাজশাহী",
        products: [defaultProducts[2]],
        quantity: 3,
        subtotal: 360,
        deliveryCharge: 0,
        freeOptionApplied: { freeDelivery: true, freeCones: 0 },
        totalAmountPaid: 360,
        bKashSender: "01992113322",
        bKashTrxID: "TRX9O8K71A",
        paidAmount: 0,
        orderDate: "০৪ জুন ২০২৬, রাত ০৯:৪৫ মিনিট",
        status: "Delivered",
        deliveryStatus: "Delivered",
        deliveredDate: "০৫ জুন ২০২৬"
      },
      {
        id: "JH-128912",
        customerName: "সাদিয়া নওশীন",
        phone: "01511223344",
        district: "ঢাকা",
        upazila: "ধানমন্ডি",
        address: "বাসা ১২/এ, রোড ১৫, ধানমন্ডি, ঢাকা",
        products: [defaultProducts[2]],
        quantity: 3,
        subtotal: 360,
        deliveryCharge: 0,
        freeOptionApplied: { freeDelivery: true, freeCones: 0 },
        totalAmountPaid: 360,
        bKashSender: "01511223344",
        bKashTrxID: "TRXINVALID",
        paidAmount: 70,
        orderDate: "০৩ জুন ২০২৬, দুপুর ০২:১৫ মিনিট",
        status: "Cancelled",
        cancelReason: "ভুল ইনভ্যালিড বিকাশ ট্রানজেকশন আইডি এবং পেমেন্ট রিসিভ হয়নি।"
      }
    ];

    // Merge keeping unique IDs
    const ordersMap = new Map<string, Order>();
    orders.forEach(o => ordersMap.set(o.id, o));
    dummyOrders.forEach(o => ordersMap.set(o.id, o));
    
    updateOrdersAndNotify(Array.from(ordersMap.values()));
    alert("🎉 ৩টি ভিন্ন ডেটের ৫টি প্রফেশনাল টেস্ট ডাটা সফলভাবে ডাটাবেজে সংযুক্ত করা হয়েছে! আপনি ডেট-টু-ডেট স্টেটমেন্ট ট্যাব থেকে টেস্ট করতে পারবেন।");
  };

  // Password editing logic
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage({ text: '', type: 'success' });

    if (!currentPasswordConfirm || !newPassword || !confirmNewPassword) {
      setSettingsMessage({ text: 'সবগুলো ইনপুট ঘর পূরণ করুন।', type: 'error' });
      return;
    }

    const currentHash = localStorage.getItem(DEFAULT_PASSWORD_HASH_KEY);
    const checkedInputHash = await sha256(currentPasswordConfirm);

    if (checkedInputHash !== currentHash) {
      setSettingsMessage({ text: 'আপনার বর্তমান পাসওয়ার্ডটি মিলছে না!', type: 'error' });
      return;
    }

    if (newPassword.length < 5) {
      setSettingsMessage({ text: 'নতুন পাসওয়ার্ড কমপক্ষে ৫ অক্ষরের হতে হবে।', type: 'error' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSettingsMessage({ text: 'নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড এক নয়!', type: 'error' });
      return;
    }

    const newHash = await sha256(newPassword);
    localStorage.setItem(DEFAULT_PASSWORD_HASH_KEY, newHash);
    
    setCurrentPasswordConfirm('');
    setNewPassword('');
    setConfirmNewPassword('');
    setSettingsMessage({ text: '✅ পাসওয়ার্ড পরিবর্তন সম্পন্ন হয়েছে! এটি ডক ফাইল বা ডায়েরিতে লিখে রাখুন।', type: 'success' });
  };

  const handleAcceptOrder = (orderId: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Processing' as const,
          deliveryStatus: 'Processing' as const
        };
      }
      return o;
    });
    updateOrdersAndNotify(updated);
  };

  const handleCancelOrder = (orderId: string) => {
    const reason = cancelReasonInput[orderId]?.trim() || "গ্রাহকের ভুল তথ্য বা কাস্টমার অনাগ্রহের কারণে অর্ডার বাতিল করা হয়েছে।";
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Cancelled' as const,
          cancelReason: reason
        };
      }
      return o;
    });
    updateOrdersAndNotify(updated);
    setActiveCancelInputId(null);
    setCancelReasonInput(prev => ({ ...prev, [orderId]: '' }));
  };

  const handleUpdateDeliveryStatus = (orderId: string, statusText: 'Processing' | 'Packaging' | 'Ready to Ship' | 'Delivered') => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const orderDateStr = new Date().toLocaleDateString('bn-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        return {
          ...o,
          status: statusText === 'Delivered' ? ('Delivered' as const) : ('Processing' as const),
          deliveryStatus: statusText,
          deliveredDate: statusText === 'Delivered' ? orderDateStr : undefined
        };
      }
      return o;
    });
    updateOrdersAndNotify(updated);
  };

  // Filter Categories
  const newOrders = orders.filter(o => o.status === 'Pending Verification');
  const runningOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped');
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled');

  // Search filter Engine
  const searchResults = orders.filter(o => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return false;
    return (
      o.id.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.phone.includes(query) ||
      o.district.toLowerCase().includes(query) ||
      o.upazila.toLowerCase().includes(query) ||
      o.bKashTrxID.toLowerCase().includes(query)
    );
  });

  const translateStatus = (s?: string) => {
    switch (s) {
      case 'Processing': return 'প্রোডাকশন সচল 📦';
      case 'Packaging': return 'প্যাকেজিং এবং লেবেলিং 🏷️';
      case 'Ready to Ship': return 'কুরিয়ারে শিপমেন্টের প্রস্তুতি 📦';
      case 'Delivered': return 'ডেলিভারি সম্পন্ন 💝';
      default: return 'প্রস্তুতকরণ সায়েন্টফিক';
    }
  };

  // Daily report date-to-date aggregates calculator
  const getDailyReportMetrics = () => {
    if (!dailyReportDate) return { totalCreated: 0, acceptedCount: 0, cancelledCount: 0, rawEarnings: 0, deliveryCharge: 0, deliveredCount: 0, list: [] };
    
    const selectedDateObj = new Date(dailyReportDate);
    const monthBengali = selectedDateObj.toLocaleDateString('bn-BD', { month: 'long' });
    const formattedBanglaDay = selectedDateObj.toLocaleDateString('bn-BD', { day: 'numeric' });

    const matchOrdersList = orders.filter(o => {
      const orderDateStr = o.orderDate;
      const parsedMatch = orderDateStr.includes(formattedBanglaDay) && orderDateStr.includes(monthBengali);
      const parsedMatchGregorian = orderDateStr.includes(dailyReportDate.split('-')[2]) && orderDateStr.includes(dailyReportDate.split('-')[1]);
      return parsedMatch || parsedMatchGregorian || orderDateStr.includes(dailyReportDate);
    });

    const acceptedList = matchOrdersList.filter(o => o.status !== 'Cancelled');
    const cancelledList = matchOrdersList.filter(o => o.status === 'Cancelled');
    const deliveredList = matchOrdersList.filter(o => o.status === 'Delivered');

    const rawEarnings = acceptedList.reduce((sum, o) => sum + o.totalAmountPaid, 0);
    const deliveryCharge = acceptedList.reduce((sum, o) => sum + o.deliveryCharge, 0);

    return {
      totalCreated: matchOrdersList.length,
      acceptedCount: acceptedList.length,
      cancelledCount: cancelledList.length,
      rawEarnings,
      deliveryCharge,
      deliveredCount: deliveredList.length,
      list: matchOrdersList
    };
  };

  const dailyMetrics = getDailyReportMetrics();

  // Date-to-Date statement filters logic (Core Requirement)
  const getStatementRangeMetrics = () => {
    if (!statementStartDate || !statementEndDate) {
      return { totalCount: 0, acceptedCount: 0, cancelledCount: 0, deliveredCount: 0, totalRevenue: 0, totalCollected: 0, billingOutstanding: 0, list: [], productCounts: {} };
    }
    
    // Normalize bounds
    const start = new Date(statementStartDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(statementEndDate);
    end.setHours(23, 59, 59, 999);
    
    // Sort all orders by range
    const inRange = orders.filter(o => {
      const parsed = parseBengaliDate(o.orderDate);
      if (!parsed) return false;
      return parsed >= start && parsed <= end;
    });
    
    // Filter by search field if keyword is populated
    const keyword = statementSearchQuery.toLowerCase().trim();
    const searchedRange = inRange.filter(o => {
      if (!keyword) return true;
      return (
        o.id.toLowerCase().includes(keyword) ||
        o.customerName.toLowerCase().includes(keyword) ||
        o.phone.includes(keyword) ||
        o.district.toLowerCase().includes(keyword) ||
        o.upazila.toLowerCase().includes(keyword) ||
        o.bKashTrxID.toLowerCase().includes(keyword)
      );
    });
    
    const acceptedList = searchedRange.filter(o => o.status !== 'Cancelled');
    const cancelledList = searchedRange.filter(o => o.status === 'Cancelled');
    const deliveredList = searchedRange.filter(o => o.status === 'Delivered');
    
    // Calculations
    const totalRevenue = acceptedList.reduce((sum, o) => sum + o.totalAmountPaid, 0);
    
    // Actual realized income collected (bkash advance delivery fees + cash balance if delivered)
    const totalCollected = acceptedList.reduce((sum, o) => {
      let realized = o.paidAmount; // Booking deposit
      if (o.status === 'Delivered') {
        realized += (o.totalAmountPaid - o.paidAmount); // Remainder COD
      }
      return sum + realized;
    }, 0);
    
    // Outstanding Cash on Delivery to collect for other processing packages
    const pendingOrdersInRange = searchedRange.filter(o => o.status !== 'Cancelled' && o.status !== 'Delivered');
    const billingOutstanding = pendingOrdersInRange.reduce((sum, o) => sum + (o.totalAmountPaid - o.paidAmount), 0);
    
    // Group sold items to aid production planning
    const productCounts: { [name: string]: number } = {};
    acceptedList.forEach(order => {
      order.products.forEach(p => {
        productCounts[p.productName] = (productCounts[p.productName] || 0) + p.quantity;
      });
    });
    
    return {
      totalCount: searchedRange.length,
      acceptedCount: acceptedList.length,
      cancelledCount: cancelledList.length,
      deliveredCount: deliveredList.length,
      totalRevenue,
      totalCollected,
      billingOutstanding,
      list: searchedRange,
      productCounts
    };
  };

  const statementMetrics = getStatementRangeMetrics();

  // Print system handler
  const handlePrint = () => {
    window.print();
  };

  // Re-usable order renderer structure with customer details ALWAYS expanded as requested (Default by default)
  const renderDetailedOrderList = (orderList: Order[], labelPrefix: string) => {
    if (orderList.length === 0) {
      return (
        <div className="py-12 text-center text-[#5D7A5C] border-2 border-dashed border-[#D2E4D0] rounded-3xl font-bengali bg-white/50 p-6">
          🌿 এই তালিকায় কোনো অর্ডার পাওয়া যায়নি।
          <p className="text-xs text-slate-400 font-sans mt-1">Status queue is empty. Submissions will populate here.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {orderList.map((order, index) => {
          // Status Border Highlight Match
          let borderThickColor = "border-l-[#5D7A5C]";
          let badgeColorStyle = "bg-[#EAF4E8] text-[#2B4429] border-[#D2E4D0]";
          
          if (order.status === 'Pending Verification') {
            borderThickColor = "border-l-amber-500";
            badgeColorStyle = "bg-amber-100 text-amber-800 border-amber-200";
          } else if (order.status === 'Cancelled') {
            borderThickColor = "border-l-[#D23333]";
            badgeColorStyle = "bg-rose-100 text-rose-800 border-rose-200";
          } else if (order.status === 'Delivered') {
            borderThickColor = "border-l-emerald-600";
            badgeColorStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
          }

          const outstandingCOD = order.totalAmountPaid - order.paidAmount;

          return (
            <div 
              key={order.id} 
              id={`order-${order.id}`}
              className={`bg-white border-2 border-[#EAF4E8] hover:border-[#D2E4D0] rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all duration-200 border-l-4 ${borderThickColor}`}
            >
              {/* Badge Status Row */}
              <div className="absolute top-0 right-0 py-1.5 px-4 bg-[#F2F8F1] border-b border-l border-[#EAF4E8] text-[#5D7A5C] text-[10px] font-bold rounded-bl-2xl font-sans tracking-wide uppercase flex items-center gap-1.5 print:hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5D7A5C] animate-ping" />
                <span>{labelPrefix} | {order.id}</span>
              </div>

              {/* SECTION A: Order identification overview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-slate-100 items-start">
                <div className="md:col-span-5 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans block mb-1">
                    অর্ডার ইউনিক আইডি (Unique Code)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-[#2B4429] tracking-wider select-all font-mono">
                      #{order.id}
                    </span>
                    <button 
                      onClick={() => handleCopyToClipboard(order.id, order.id)}
                      className="p-1 rounded bg-[#EAF4E8] hover:bg-[#D6E8D4] text-[#5D7A5C] transition-colors print:hidden"
                      title="অর্ডার আইডি কপি করুন"
                    >
                      {copiedOrderId === order.id ? (
                        <span className="text-[9px] font-bold text-emerald-700 px-1 font-bengali">কপি হয়েছে!</span>
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-4 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans block mb-1">
                    অর্ডার জমা করার সময় (Submit Schedule)
                  </span>
                  <p className="text-xs font-bold text-[#2B4429] font-bengali flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#5D7A5C] shrink-0" />
                    <span>{order.orderDate}</span>
                  </p>
                </div>

                <div className="md:col-span-3 md:text-right text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans block mb-1">
                    ভেরিফিকেশন ক্যাটাগরি
                  </span>
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border font-bengali leading-none ${badgeColorStyle}`}>
                    ● {order.status === 'Pending Verification' ? 'পেন্ডিং ভেরিফিকেশন' : 
                       order.status === 'Processing' ? 'প্রোডাকশন/প্রসেসিং' : 
                       order.status === 'Cancelled' ? 'বাতিলকৃত' : 
                       order.status === 'Delivered' ? 'বিল পরিশোধিত/ডেলিভার্ড' : order.status}
                  </span>
                </div>
              </div>

              {/* SECTION B: Customer Details Shown Always by Default (Strict Requirement) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-4 border-b border-slate-100">
                
                {/* Customer Address Details Table */}
                <div className="lg:col-span-7 space-y-2 text-left">
                  <h4 className="text-[11px] text-[#5D7A5C] font-extrabold uppercase tracking-widest border-b border-[#EAF4E8] pb-1.5 font-bengali flex items-center gap-1.5">
                    👤 গ্রাহকের নাম ও শিপিং ঠিকানা
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 text-xs text-slate-700">
                    <span className="sm:col-span-3 font-semibold text-slate-400 font-bengali">কাস্টমার নাম:</span>
                    <span className="sm:col-span-9 font-bold text-slate-800 font-bengali">{order.customerName}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 text-xs text-slate-700">
                    <span className="sm:col-span-3 font-semibold text-slate-400 font-bengali">যোগাযোগ ফোন:</span>
                    <span className="sm:col-span-9">
                      <a href={`tel:${order.phone}`} className="text-[#5D7A5C] hover:underline font-extrabold font-mono text-sm bg-emerald-50 px-2 py-0.5 rounded border border-[#D2E4D0]">
                        {order.phone}
                      </a>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 text-xs text-slate-700">
                    <span className="sm:col-span-3 font-semibold text-slate-400 font-bengali">এলাকা/উপজেলা:</span>
                    <span className="sm:col-span-9 font-bold text-slate-800 font-bengali">
                      {order.upazila} <span className="text-[#5D7A5C] font-mono">({order.district} জেলা)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 text-xs text-slate-700">
                    <span className="sm:col-span-3 font-semibold text-slate-400 font-bengali">পূর্ণাঙ্গ ঠিকানা:</span>
                    <span className="sm:col-span-9 font-semibold text-slate-800 font-bengali bg-[#FAFDF9] p-1.5 rounded border border-[#EAF4E8]/60 inline-block w-full">
                      {order.address}
                    </span>
                  </div>
                </div>

                {/* bKash Payment Details Box */}
                <div className="lg:col-span-5 bg-[#FFFDF6] p-4 rounded-2xl border border-[#FAEDCD] text-left">
                  <h4 className="text-[11px] text-amber-800 font-extrabold uppercase tracking-widest border-b border-[#FAEDCD] pb-1.5 font-bengali flex items-center gap-1.5">
                    💳 বিকাশ লেনদেন ও পেমেন্ট ভেরিফিকেশন
                  </h4>
                  
                  <div className="mt-2 space-y-1.5 text-xs font-bengali text-amber-950">
                    <div className="flex justify-between">
                      <span>পণ্যের মোট দাম:</span>
                      <strong className="font-bold">{order.subtotal} টাকা</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>কুরিয়ার চার্জ:</span>
                      <strong className="font-bold">
                        {order.freeOptionApplied?.freeDelivery ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">ফ্রি ডেলিভারি 🎁</span>
                        ) : (
                          `${order.deliveryCharge} টাকা`
                        )}
                      </strong>
                    </div>
                    <div className="flex justify-between border-t border-[#FAEDCD] pt-1 mt-1 font-bold">
                      <span>সর্বমোট বিল:</span>
                      <span className="text-[#2B4429] text-base">
                        {order.subtotal + (order.freeOptionApplied?.freeDelivery ? 0 : order.deliveryCharge)} টাকা
                      </span>
                    </div>

                    <div className="space-y-1 bg-white p-2 rounded-xl border border-[#FAEDCD]/80 text-[11px] text-slate-700 mt-2.5">
                      <p>
                        <strong className="text-slate-500">বিকাশ প্রেরক নাম্বার:</strong>{' '}
                        <span className="font-mono font-bold text-slate-800">{order.bKashSender}</span>
                      </p>
                      <div className="flex justify-between items-center text-rose-800 font-bold">
                        <span>অগ্রিম পেইড (বুকিং ফি):</span>
                        <span className="text-xs px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200">{order.paidAmount} টাকা</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-800 font-bold border-t border-dashed border-slate-100 pt-1 mt-1">
                        <span>বাকি COD বিল (কুরিয়ারে আদায়যোগ্য):</span>
                        <span className="text-xs font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">{outstandingCOD} টাকা</span>
                      </div>
                      <p className="border-t border-slate-100 pt-1 mt-1.5 text-[11px] leading-snug">
                        <span className="text-slate-500 block font-bold">বিকাশ TrxID:</span>
                        <code className="font-mono bg-amber-50 text-[#5D7A5C] font-extrabold px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5 select-all tracking-wider">
                          {order.bKashTrxID}
                        </code>
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              {/* SECTION C: Product Items breakdowns on order */}
              <div className="py-3 text-left">
                <span className="text-[10px] text-[#5D7A5C] font-bold uppercase tracking-widest block mb-2 font-bengali">
                  🛒 অর্ডারকৃত পণ্যের আইটেম লিস্ট ও পরিমাণ:
                </span>
                <div className="space-y-1.5 bg-[#FAFDF9] p-3 rounded-2xl border border-[#EAF4E8] text-xs">
                  {order.products.map((p, pIdx) => (
                    <div key={pIdx} className="flex justify-between items-center font-bengali text-[#2B4429]">
                      <span className="font-semibold flex items-center gap-1.5">
                        🍃 {p.productName} 
                        <strong className="text-[#5D7A5C] font-bold">({p.quantity} পিস)</strong>
                      </span>
                      <span className="font-bold">{p.price * p.quantity} টাকা</span>
                    </div>
                  ))}
                  
                  {order.freeOptionApplied?.freeCones > 0 && (
                    <div className="text-[11px] text-emerald-800 font-bold border-t border-[#D2E4D0] pt-2 mt-2 flex items-center gap-1 text-emerald-700">
                      <Gift className="h-4 w-4 text-amber-500 animate-bounce" />
                      <span>ঈদ অফার গিফট: অতিরিক্ত {order.freeOptionApplied.freeCones} পিস হেনা গিফট কোণ যুক্ত আছে!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION D: Actions controls depending on current status */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2.5 justify-end print:hidden">
                {order.status === 'Pending Verification' && (
                  <div className="w-full flex flex-col gap-2">
                    {activeCancelInputId === order.id ? (
                      <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row gap-2 mt-2">
                        <input 
                          type="text" 
                          value={cancelReasonInput[order.id] || ''}
                          onChange={(e) => setCancelReasonInput(prev => ({ ...prev, [order.id]: e.target.value }))}
                          placeholder="অর্ডার বাতিল করার সুস্পষ্ট কারণ লিখুন (যেমন: ভুয়া TrxID/পেমেন্ট রিসিভ হয়নি ইত্যাদি)..."
                          className="flex-1 bg-white border border-[#D2E4D0] focus:border-rose-500 py-1.5 px-3 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
                        />
                        <div className="flex gap-2 justify-end shrink-0">
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="py-1.5 px-4 bg-rose-600 font-[#2B4429] font-bold rounded-xl text-xs hover:bg-[#D23333] cursor-pointer text-white transition-all shadow-sm"
                          >
                            বাতিল নিশ্চিত
                          </button>
                          <button 
                            onClick={() => setActiveCancelInputId(null)}
                            className="py-1.5 px-3 bg-white border border-slate-300 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                          >
                            ফিরে যান
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2.5 justify-end">
                        <button 
                          onClick={() => setActiveCancelInputId(order.id)}
                          className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold cursor-pointer transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span>বাতিল করুন ❌</span>
                        </button>
                        <button 
                          onClick={() => handleAcceptOrder(order.id)}
                          className="inline-flex items-center gap-1.5 py-2 px-5 rounded-xl bg-[#5D7A5C] hover:bg-[#4E6A4D] text-white text-xs font-bold cursor-pointer transition-transform transform active:scale-95 shadow-md shadow-emerald-950/10"
                        >
                          <Check className="h-4 w-4" />
                          <span>অর্ডার টিম এক্সেপ্ট (Accept) ✅</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {order.status === 'Processing' && (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-[#FAFDF9] p-3 rounded-2xl border border-[#EAF4E8] mt-1.5">
                    <span className="text-[11px] text-[#5D7A5C] font-bold uppercase tracking-wider font-bengali">
                      🚚 ডেলিভারি অবস্থা পরিবর্তন করতে ক্লিক করুন:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <button 
                        onClick={() => handleUpdateDeliveryStatus(order.id, 'Processing')}
                        className={`py-1.5 px-2.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                          (order.deliveryStatus === 'Processing' || !order.deliveryStatus) 
                            ? 'bg-[#5D7A5C] text-white font-extrabold shadow-sm' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        📦 প্রসেসিং
                      </button>
                      <button 
                        onClick={() => handleUpdateDeliveryStatus(order.id, 'Packaging')}
                        className={`py-1.5 px-2.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                          order.deliveryStatus === 'Packaging' 
                            ? 'bg-[#8FA88B] text-white font-extrabold shadow-sm' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        🏷️ প্যাকেজিং সচল
                      </button>
                      <button 
                        onClick={() => handleUpdateDeliveryStatus(order.id, 'Ready to Ship')}
                        className={`py-1.5 px-2.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                          order.deliveryStatus === 'Ready to Ship' 
                            ? 'bg-amber-600 text-white font-extrabold shadow-sm' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        🚀 রেডি টু কুরিয়ার
                      </button>
                      <button 
                        onClick={() => handleUpdateDeliveryStatus(order.id, 'Delivered')}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg cursor-pointer transition-transform active:scale-95 shadow-sm text-[10px]"
                      >
                        💝 কুরিয়ার ডেলিভার্ড সম্পন্ন করুন
                      </button>
                    </div>
                  </div>
                )}

                {order.status === 'Cancelled' && (
                  <div className="w-full p-3.5 bg-rose-50/50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bengali">
                    <p className="font-extrabold flex items-center gap-1.5 mb-1.5">
                      <AlertCircle className="h-4.5 w-4.5 text-rose-600" />
                      <span>বাতিল করার অফিসিয়াল কারণ:</span>
                    </p>
                    <p className="italic bg-white p-2.5 rounded-xl border border-rose-150 text-slate-600 leading-relaxed">
                      "{order.cancelReason || "সুনির্দিষ্ট কোনো কারণ এডমিন কর্তৃক উল্লেখ করা হয়নি।"}"
                    </p>
                  </div>
                )}

                {order.status === 'Delivered' && (
                  <div className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-bengali text-[#2B4429]">
                    <span className="font-bold flex items-center gap-1">
                      💝 পণ্য কাস্টমারের নিকট সফলভাবে হস্তান্তরিত হয়েছে।
                    </span>
                    {order.deliveredDate && (
                      <span className="text-[11px] font-extrabold bg-white px-3 py-1 rounded-xl border border-emerald-200 text-emerald-850">
                        তারিখ: {order.deliveredDate}
                      </span>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-12 bg-gradient-to-b from-[#F2F8F1] via-[#FAFDF9] to-[#F1F7F0] border-t-4 border-[#5D7A5C] text-slate-800 py-12 px-4 relative overflow-hidden rounded-3xl border border-[#D2E4D0]" id="admin-root-section">
      {/* Absolute decorative sweet mehendi leaf borders (Beautiful design concept) */}
      <div className="absolute top-[5%] right-[2%] w-64 h-64 bg-[#8FA88B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[2%] left-[2%] w-64 h-64 bg-[#5D7A5C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10 relative print:hidden">
          <span className="p-3 rounded-2xl bg-[#EAF4E8] text-[#5D7A5C] inline-flex mb-3 border border-[#B1D5AD]/60 shadow-sm shadow-[#5D7A5C]/5">
            <Shield className="h-7 w-7 stroke-[1.8]" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#2B4429] tracking-wide font-bengali">
            জান্নাত’স হেনা এডমিন কন্ট্রোল সিস্টেম প্যানেল
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 font-bengali font-medium max-w-xl mx-auto leading-relaxed">
            🌿 নিখাদ লাল রঙের নিশ্চয়তা! এডমিন ব্যতিরেকে কোনো তৃতীয় ব্যক্তির অনধিকার প্রবেশ ও কারচুপি কঠোর সুরক্ষায় ট্র্যাক করা হয়।
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 justify-center">
            {!isAdminLoggedIn ? (
              <button 
                onClick={() => setIsOpenInput(!isOpenInput)}
                className="inline-flex items-center gap-2 py-2 px-5 text-xs font-bold rounded-full bg-[#5D7A5C] hover:bg-[#4E6A4D] text-white cursor-pointer transition-all shadow-md shadow-[#5D7A5C]/15 uppercase tracking-wide"
              >
                <Lock className="h-4 w-4" />
                <span>{isOpenInput ? 'পাসওয়ার্ড প্যানেল বন্ধ করুন' : 'ঝটপট এডমিন লগইন করুন 🔒'}</span>
              </button>
            ) : (
              <div className="flex flex-wrap gap-2.5 justify-center">
                <button 
                  onClick={() => handleLogout()}
                  className="inline-flex items-center gap-1.5 py-2 px-5 text-xs font-extrabold rounded-full bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-all shadow-md shadow-rose-600/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>লগআউট (Exit Dashboard)</span>
                </button>
                <button 
                  onClick={handleSeedDummyOrders}
                  className="inline-flex items-center gap-1.5 py-2 px-5 text-xs font-semibold rounded-full bg-orange-600 hover:bg-orange-500 text-white cursor-pointer transition-all shadow-md"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>টেস্ট ডেটা যোগ করুন (Seed Dummy Logs)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- SECURITY LOGIN PORTAL ZONE --- */}
        <AnimatePresence>
          {(isOpenInput && !isAdminLoggedIn) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-md mx-auto bg-white border-2 border-[#D2E4D0] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-12 text-left"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5D7A5C] via-[#8FA88B] to-[#5D7A5C]" />
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-[#2B4429] font-serif font-bengali">পাসওয়ার্ড ভেরিফিকেশন সেশন</h3>
                <p className="text-xs text-slate-500 mt-1 font-bengali">
                  নিরাপত্তা বলয় ভেদ করতে প্যানেলের গোপন সিক্রেট পাসওয়ার্ড প্রদান করুন।
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-700 text-xs flex items-start gap-2.5 mb-5 font-bengali text-left">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="font-semibold leading-relaxed">{loginError}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs text-[#2B4429] font-extrabold uppercase mb-2">
                    এডমিন সিকিউরিটি পাসওয়ার্ড (Access Key):
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Key className="h-4 w-4" />
                    </span>
                    <input 
                      type={isPasswordVisible ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="সিক্রেট পাসওয়ার্ড দিন..."
                      disabled={lockoutTimeLeft > 0}
                      className="w-full bg-slate-50 border-2 border-[#EAF4E8] focus:border-[#5D7A5C] rounded-2xl py-3 pl-11 pr-11 text-[#2B4429] font-mono placeholder-slate-400 focus:outline-none transition-colors text-sm"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {lockoutTimeLeft > 0 ? (
                  <div className="py-3 text-center text-rose-600 text-xs font-bold font-bengali animate-pulse bg-rose-50 border border-rose-200 rounded-2xl">
                    🚫 ক্ষণস্থায়ী লক আউট! অনুগ্রহ করে {lockoutTimeLeft} সেকেন্ড অপেক্ষা করুন।
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#5D7A5C] hover:bg-[#4E6A4D] text-white font-extrabold rounded-2xl text-xs transition-transform transform active:scale-[0.98] outline-none flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>এডমিন পোর্টাল প্রবেশ করুন</span>
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN WORKSPACE AREA --- */}
        {isAdminLoggedIn ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6 bg-white border border-[#D2E4D0] p-4 sm:p-6 rounded-3xl shadow-sm min-h-[600px] print:border-none print:shadow-none print:p-0">
            
            {/* 1. LEFT SIDEBAR (Hide during print statements) */}
            <div className="lg:col-span-3 border-r border-[#EAF4E8] pr-0 lg:pr-5 flex flex-col justify-between space-y-6 print:hidden self-stretch lg:sticky lg:top-4">
              <div>
                <div className="flex items-center gap-3 pb-6 border-b border-[#EAF4E8] mb-6">
                  <div className="h-11 w-11 rounded-2xl bg-[#EAF4E8] border border-[#B1D5AD]/60 flex items-center justify-center text-[#5D7A5C] shadow-sm">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="text-left font-bengali">
                    <p className="text-[11px] text-[#5D7A5C] font-extrabold uppercase tracking-widest leading-none">অফিসিয়াল এডমিন</p>
                    <p className="text-sm font-black text-[#2B4429] mt-1">Jannat's Official</p>
                  </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex flex-col gap-1.5 text-left font-bengali">
                  
                  {/* Tab 1: নতুন অর্ডার */}
                  <button
                    onClick={() => setActiveMenu('new')}
                    className={`flex items-center justify-between py-3 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                      activeMenu === 'new' 
                        ? 'bg-[#5D7A5C] text-white shadow-md shadow-[#5D7A5C]/15' 
                        : 'text-slate-600 hover:bg-[#F2F8F1] hover:text-[#2B4429]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Inbox className="h-4.5 w-4.5" />
                      <span>নতুন পেন্ডিং অর্ডার</span>
                    </span>
                    <span className={`h-5 min-w-5 px-1.5 text-[9px] font-black rounded-full flex items-center justify-center ${
                      activeMenu === 'new' ? 'bg-[#2B4429] text-white' : 'bg-[#D2E4D0] text-[#2B4429]'
                    }`}>
                      {newOrders.length}
                    </span>
                  </button>

                  {/* Tab 2: রানিং অর্ডার */}
                  <button
                    onClick={() => setActiveMenu('running')}
                    className={`flex items-center justify-between py-3 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                      activeMenu === 'running' 
                        ? 'bg-[#5D7A5C] text-white shadow-md shadow-[#5D7A5C]/15' 
                        : 'text-slate-600 hover:bg-[#F2F8F1] hover:text-[#2B4429]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="h-4.5 w-4.5" />
                      <span>রানিং প্রোডাকশন অর্ডার</span>
                    </span>
                    <span className="h-5 min-w-5 px-1.5 text-[9px] bg-[#EAF4E8] text-[#5D7A5C] rounded-full flex items-center justify-center font-black">
                      {runningOrders.length}
                    </span>
                  </button>

                  {/* Tab 3: বাতিল অর্ডার */}
                  <button
                    onClick={() => setActiveMenu('cancelled')}
                    className={`flex items-center justify-between py-3 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                      activeMenu === 'cancelled' 
                        ? 'bg-rose-600 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-[#F2F8F1] hover:text-[#2B4429]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <X className="h-4.5 w-4.5" />
                      <span>বাতিলকৃত তথ্যসমূহ</span>
                    </span>
                    <span className="h-5 min-w-5 px-1.5 text-[9px] bg-rose-100 text-rose-800 rounded-full flex items-center justify-center font-black">
                      {cancelledOrders.length}
                    </span>
                  </button>

                  <div className="h-px bg-[#EAF4E8] my-3" />

                  {/* Tab 4: স্টেটমেন্ট (Date-to-Date Lookup - Core Goal) */}
                  <button
                    onClick={() => setActiveMenu('statement')}
                    className={`flex items-center gap-2.5 py-3 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                      activeMenu === 'statement' 
                        ? 'bg-[#5D7A5C] text-white shadow-md' 
                        : 'text-slate-600 hover:bg-[#F2F8F1] hover:text-[#2B4429]'
                    }`}
                  >
                    <TrendingUp className="h-4.5 w-4.5" />
                    <span>তারিখ ভিত্তিক স্টেটমেন্ট 📊</span>
                  </button>

                  {/* Tab 5: ডেইলি রিপোর্ট */}
                  <button
                    onClick={() => setActiveMenu('daily')}
                    className={`flex items-center gap-2.5 py-3 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                      activeMenu === 'daily' 
                        ? 'bg-[#5D7A5C] text-white shadow-md' 
                        : 'text-slate-600 hover:bg-[#F2F8F1] hover:text-[#2B4429]'
                    }`}
                  >
                    <Calendar className="h-4.5 w-4.5" />
                    <span>দৈনিক কার্যক্রম অডিট</span>
                  </button>

                  {/* Tab 6: সার্চ */}
                  <button
                    onClick={() => setActiveMenu('search')}
                    className={`flex items-center gap-2.5 py-3 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                      activeMenu === 'search' 
                        ? 'bg-[#5D7A5C] text-white shadow-md' 
                        : 'text-slate-600 hover:bg-[#F2F8F1] hover:text-[#2B4429]'
                    }`}
                  >
                    <Search className="h-4.5 w-4.5" />
                    <span>ইউনিক সার্চ ইঞ্জিন</span>
                  </button>

                  {/* Tab 7: পাসওয়ার্ড সেটিংস */}
                  <button
                    onClick={() => setActiveMenu('settings')}
                    className={`flex items-center gap-2.5 py-3 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                      activeMenu === 'settings' 
                        ? 'bg-[#5D7A5C] text-white shadow-md' 
                        : 'text-slate-600 hover:bg-[#F2F8F1] hover:text-[#2B4429]'
                    }`}
                  >
                    <Settings className="h-4.5 w-4.5" />
                    <span>পাসওয়ার্ড পরিবর্তন</span>
                  </button>
                </nav>
              </div>

              {/* Status footer inside sidebar */}
              <div className="p-3.5 rounded-2xl bg-[#FAFDF9] border border-[#EAF4E8] text-[10px] text-slate-500 font-sans tracking-tight space-y-1 text-left">
                <p className="font-extrabold text-[#5D7A5C]">🔐 Security State Logs</p>
                <p>📍 System Node: Client Side DB</p>
                <p>⚡ Crypto Node: SHA-256 Web</p>
                <p>🧊 Safeguard: Local Double Mirror</p>
              </div>

            </div>

            {/* 2. RIGHT CONTENT PORT (Dynamic report tabs) */}
            <div className="lg:col-span-9 pl-0 lg:pl-5 mt-6 lg:mt-0 print:pl-0 print:mt-0">
              
              {/* TAB 1: NEW PENDING ORDERS */}
              {activeMenu === 'new' && (
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-[#EAF4E8] pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-extrabold text-[#2B4429] flex items-center gap-2 font-bengali">
                        <Inbox className="h-5.5 w-5.5 text-[#5D7A5C]" />
                        <span>নতুন পেন্ডিং ভেরিফিকেশন তালিকা ({newOrders.length})</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-bengali">
                        গ্রাহকদের নতুন সাবমিটকৃত ক্যাশ অন ডেলিভারি, কুরিয়ার চার্জ এবং বুকিং পেমেন্ট ভেরিফাই করুন।
                      </p>
                    </div>
                  </div>

                  {renderDetailedOrderList(newOrders, "পেন্ডিং ভেরিফিকেশন")}
                </div>
              )}

              {/* TAB 2: RUNNING ORDERS */}
              {activeMenu === 'running' && (
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-[#EAF4E8] pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-extrabold text-[#2B4429] flex items-center gap-2 font-bengali">
                        <Truck className="h-5.5 w-5.5 text-[#5D7A5C]" />
                        <span>রানিং প্রোডাকশন ও শিপমেন্ট তালিকা ({runningOrders.length})</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-bengali">
                        মেহেদী কন এবং প্রমো প্যাক তৈরির রানিং প্রোডাকশন ট্র্যাকার ও কুরিয়ার চালান মনিটর।
                      </p>
                    </div>
                  </div>

                  {/* Financial running metrics summary panels */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-[#FAFDF9] border border-[#D2E4D0] p-4 rounded-2xl font-bengali">
                    <div className="p-2.5 bg-white shadow-sm rounded-xl text-center border border-[#EAF4E8]">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">রানিং ওডারস</p>
                      <p className="text-sm font-extrabold text-[#2B4429] mt-0.5">{runningOrders.length} টি</p>
                    </div>
                    <div className="p-2.5 bg-white shadow-sm rounded-xl text-center border border-[#EAF4E8]">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">সর্বমোট মূল্য</p>
                      <p className="text-sm font-extrabold text-[#5D7A5C] mt-0.5">
                        {runningOrders.reduce((sum, o) => sum + o.subtotal + (o.freeOptionApplied?.freeDelivery ? 0 : o.deliveryCharge), 0)} ৳
                      </p>
                    </div>
                    <div className="p-2.5 bg-white shadow-sm rounded-xl text-center border border-[#EAF4E8] text-amber-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">মোট কুরিয়ার</p>
                      <p className="text-sm font-extrabold mt-0.5">
                        {runningOrders.reduce((sum, o) => sum + o.deliveryCharge, 0)} ৳
                      </p>
                    </div>
                    <div className="p-2.5 bg-white shadow-sm rounded-xl text-center border border-[#EAF4E8] text-rose-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">অগ্রিম বুকিং</p>
                      <p className="text-sm font-extrabold mt-0.5">
                        {runningOrders.reduce((sum, o) => sum + o.paidAmount, 0)} ৳
                      </p>
                    </div>
                    <div className="p-2.5 bg-white shadow-sm rounded-xl text-center border border-[#EAF4E8] text-blue-700 col-span-2 md:col-span-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">বাকি বকেয়া COD</p>
                      <p className="text-sm font-extrabold mt-0.5">
                        {runningOrders.reduce((sum, o) => sum + ((o.subtotal + (o.freeOptionApplied?.freeDelivery ? 0 : o.deliveryCharge)) - o.paidAmount), 0)} ৳
                      </p>
                    </div>
                  </div>

                  {renderDetailedOrderList(runningOrders, "রানিং অর্ডার")}
                </div>
              )}

              {/* TAB 3: CANCELLED ORDERS */}
              {activeMenu === 'cancelled' && (
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-[#EAF4E8] pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-extrabold text-[#D23333] flex items-center gap-2 font-bengali">
                        <AlertCircle className="h-5.5 w-5.5 text-[#D23333]" />
                        <span>বাতিলকৃত ও স্থগিত অর্ডারের মূল রেকর্ড ({cancelledOrders.length})</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-bengali">
                        গ্রাহকদের বাতিল হওয়া অর্ডারের সুনির্দিষ্ট কারণ ও ট্রানজেকশন কাস্টমার রেকর্ড। (কোনো রেকর্ড মুছে ফেলা সম্ভব নয়)
                      </p>
                    </div>
                  </div>

                  {/* Summary grid cancelled */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#FAFDF9] rounded-2xl border border-[#D2E4D0] text-center">
                      <p className="text-xs text-slate-500 font-bold uppercase font-bengali">বাতিল হওয়া অর্ডারের সংখ্যা</p>
                      <p className="text-2xl font-black text-rose-600 mt-1 font-sans">{cancelledOrders.length} টি</p>
                    </div>
                    <div className="p-4 bg-[#FAFDF9] rounded-2xl border border-[#D2E4D0] text-center">
                      <p className="text-xs text-slate-500 font-bold uppercase font-bengali">বাজেয়াপ্ত সম্ভাব্য বিল</p>
                      <p className="text-2xl font-black text-slate-600 mt-1 font-sans">
                        {cancelledOrders.reduce((sum, o) => sum + o.subtotal, 0)} ৳
                      </p>
                    </div>
                  </div>

                  {renderDetailedOrderList(cancelledOrders, "বাতিলকৃত অর্ডার")}
                </div>
              )}

              {/* TAB 4: DATE-TO-DATE FIND ORDER STATEMENT SYSTEM (Core Goal & Feature) */}
              {activeMenu === 'statement' && (
                <div className="space-y-6 text-left print:text-black">
                  
                  {/* Title & Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAF4E8] pb-4 print:hidden">
                    <div className="text-left">
                      <h3 className="text-xl font-serif font-extrabold text-[#2B4429] flex items-center gap-2 font-bengali">
                        <TrendingUp className="h-5.5 w-5.5 text-[#5D7A5C]" />
                        <span>তারিখ ভিত্তিক সার্বিক স্টেটমেন্ট ও উৎপাদন হিসাব 📅</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-bengali">
                        শুরুর তারিখ এবং শেষের সীমা নির্ধারণ করে নির্দিষ্ট সীমার সমস্ত অর্ডার স্টেটমেন্ট, বিল হিসাব ও পণ্য চাহিদাপত্র বের করুন।
                      </p>
                    </div>
                    
                    <button 
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-transform active:scale-95 shrink-0"
                    >
                      <span>ইনভয়েস স্টেটমেন্ট প্রিন্ট করুন 🖨️</span>
                    </button>
                  </div>

                  {/* Date Picker Form (Hidden in browser print view automatically with print:hidden) */}
                  <div className="bg-[#FAFDF9] p-5 rounded-3xl border-2 border-[#D2E4D0] space-y-4 print:hidden">
                    <h4 className="text-xs font-bold text-[#2B4429] uppercase tracking-wider font-bengali mb-1">
                      🛠️ ফিল্টার সেট করুন (কনফিগারেশন):
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="space-y-1.5 text-left text-xs font-bengali">
                        <label className="font-bold text-[#2B4429] block">শুরুর তারিখ (Start Date):</label>
                        <input 
                          type="date"
                          value={statementStartDate}
                          onChange={(e) => setStatementStartDate(e.target.value)}
                          className="w-full bg-white border-2 border-[#EAF4E8] focus:border-[#5D7A5C] rounded-xl py-2 px-3 text-[#2B4429] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 text-left text-xs font-bengali">
                        <label className="font-bold text-[#2B4429] block">শেষের তারিখ (End Date):</label>
                        <input 
                          type="date"
                          value={statementEndDate}
                          onChange={(e) => setStatementEndDate(e.target.value)}
                          className="w-full bg-white border-2 border-[#EAF4E8] focus:border-[#5D7A5C] rounded-xl py-2 px-3 text-[#2B4429] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 text-left text-xs font-bengali">
                        <label className="font-bold text-[#2B4429] block">স্টেটমেন্টের ভেতর খুঁজুন (Filter inside):</label>
                        <div className="relative">
                          <input 
                            type="text"
                            value={statementSearchQuery}
                            onChange={(e) => setStatementSearchQuery(e.target.value)}
                            placeholder="নাম, ফোন বা অর্ডার কোড..."
                            className="w-full bg-white border-2 border-[#EAF4E8] focus:border-[#5D7A5C] rounded-xl py-2 px-3 text-[#2B4429] focus:outline-none placeholder-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Print-Only Header Representation */}
                  <div className="hidden print:block text-center border-b-2 border-slate-300 pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">Jannat's Henna - Sales Audit Invoice Statement</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      সময় সীমা: <strong className="text-black">{statementStartDate}</strong> হতে <strong className="text-black">{statementEndDate}</strong> পর্যন্ত
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Generated in Admin Workspace Node at {new Date().toLocaleString()}</p>
                  </div>

                  {/* STATS OVERVIEW CARDS based on Selected Dates */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="p-4 bg-white rounded-2xl border-2 border-[#D2E4D0] shadow-sm text-left">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block font-bengali">মোট ফাইন্ড অর্ডার</span>
                      <p className="text-2xl font-black text-[#2B4429] mt-1 font-sans">{statementMetrics.totalCount} টি</p>
                      <p className="text-[10px] text-slate-400 font-bengali mt-1">
                        সফল: {statementMetrics.acceptedCount} | বাতিল: {statementMetrics.cancelledCount}
                      </p>
                    </div>

                    <div className="p-4 bg-[#FAFDF9] rounded-2xl border-2 border-[#D2E4D0] shadow-sm text-left">
                      <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest block font-bengali">মোট সম্ভাব্য রেভিনিউ</span>
                      <p className="text-2xl font-black text-emerald-700 mt-1 font-sans">{statementMetrics.totalRevenue} ৳</p>
                      <p className="text-[10px] text-slate-400 font-bengali mt-1">সফল অর্ডারের কুরিয়ারসহ মোট বিল</p>
                    </div>

                    <div className="p-4 bg-[#FFFDF6] rounded-2xl border-2 border-[#FAEDCD] shadow-sm text-left">
                      <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-widest block font-bengali">ইতিমধ্যে আদায়কৃত প্রফিট</span>
                      <p className="text-2xl font-black text-amber-700 mt-1 font-sans">{statementMetrics.totalCollected} ৳</p>
                      <p className="text-[10px] text-slate-400 font-bengali mt-1">বিকাশ ডিপোজিট + ডেলিভার্ড ক্যাশ</p>
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-200 shadow-sm text-left">
                      <span className="text-[10px] text-blue-800 font-extrabold uppercase tracking-widest block font-bengali">বকেয়া কুরিয়ার COD ফান্ড</span>
                      <p className="text-2xl font-black text-blue-700 mt-1 font-sans">{statementMetrics.billingOutstanding} ৳</p>
                      <p className="text-[10px] text-slate-400 font-bengali mt-1">প্রসেসিং চালানের বিপরীতে COD বিল</p>
                    </div>

                  </div>

                  {/* ITEM SUMMARY DETAILS BLOCK - Exclusively Awesome for production preparing */}
                  <div className="bg-white p-5 rounded-3xl border-2 border-[#EAF4E8] text-left">
                    <h4 className="text-xs font-bold text-[#5D7A5C] uppercase tracking-wider mb-2.5 font-bengali flex items-center gap-1.5 border-b border-[#EAF4E8] pb-1.5">
                      📊 এই সময়ের মোট পণ্য উৎপাদন চাহিদাপত্র (Item Stock Requirements):
                    </h4>
                    
                    {Object.keys(statementMetrics.productCounts).length === 0 ? (
                      <p className="text-xs text-slate-405 text-slate-500 font-bengali py-4">এই সময়ের ভিতর কোনো সফল পণ্য সামগ্রী সেল হয়নি।</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(statementMetrics.productCounts).map(([prodName, qty]) => (
                          <div key={prodName} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bengali shadow-inner">
                            <span className="font-semibold text-slate-700">🌿 {prodName}</span>
                            <span className="bg-[#5D7A5C] text-white py-0.5 px-2.5 rounded-full font-bold ml-2 font-mono shrink-0">
                              {qty} পিস
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* DETAILED RESULTS LISTING METRICS */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#2B4429] uppercase tracking-wider font-bengali mt-4 block border-b border-slate-100 pb-2">
                      📋 ফিল্টারড সময় সীমার ভেতর পাওয়া সমস্ত অর্ডারের বিবরণ (Default Expanded detailed list):
                    </h4>

                    {renderDetailedOrderList(statementMetrics.list, "ফিল্টারড স্টেটমেন্ট")}
                  </div>

                </div>
              )}

              {/* TAB 5: DAILY SINGLE DATE AUDIT */}
              {activeMenu === 'daily' && (
                <div className="space-y-6 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAF4E8] pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-extrabold text-[#2B4429] flex items-center gap-2 font-bengali">
                        <Calendar className="h-5.5 w-5.5 text-[#5D7A5C]" />
                        <span>নির্দিষ্ট দৈনিক বিক্রয় অডিট লগ 📅</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-bengali">
                        যেকোনো একটি সুনির্দিষ্ট দিনের ক্যাশ অন ডেলিভারি, বুকিং পেমেন্ট এবং অর্ডার ট্র্যাকিং হিস্ট্রি চেক করুন।
                      </p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <input 
                        type="date"
                        value={dailyReportDate}
                        onChange={(e) => setDailyReportDate(e.target.value)}
                        className="bg-white border-2 border-[#EAF4E8] text-[#2B4429] rounded-xl py-1.5 px-3 text-xs w-full focus:outline-none focus:border-[#5D7A5C]"
                      />
                    </div>
                  </div>

                  {/* Summary Metric widgets of chosen date */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFDF9] border border-[#D2E4D0] p-4 rounded-2xl">
                    <div className="p-3 bg-white shadow-sm rounded-xl text-center border border-[#EAF4E8]">
                      <p className="text-[10px] text-slate-400 font-bold uppercase font-bengali">মোট অর্ডার জমা</p>
                      <p className="text-lg font-bold text-[#2B4429] mt-0.5">{dailyMetrics.totalCreated} টি</p>
                    </div>
                    <div className="p-3 bg-white shadow-sm rounded-xl text-center border border-[#EAF4E8] text-emerald-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase font-bengali">সফল অর্ডার</p>
                      <p className="text-lg font-bold mt-0.5">{dailyMetrics.acceptedCount}  টি</p>
                    </div>
                    <div className="p-3 bg-white shadow-sm rounded-xl text-center border border-[#EAF4E8] text-rose-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase font-bengali">বাতিল লিস্ট</p>
                      <p className="text-lg font-bold mt-0.5">{dailyMetrics.cancelledCount} টি</p>
                    </div>
                    <div className="p-3 bg-white shadow-sm rounded-xl text-center border border-[#EAF4E8] text-[#5D7A5C]">
                      <p className="text-[10px] text-slate-400 font-bold uppercase font-bengali">ডেলিভারড সম্পূর্ণ</p>
                      <p className="text-lg font-bold mt-0.5">{dailyMetrics.deliveredCount} টি</p>
                    </div>
                  </div>

                  {/* Financial details container box */}
                  <div className="py-4 px-5 bg-[#FAFDF9] border-2 border-[#D2E4D0] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left font-bengali text-xs sm:text-sm space-y-1 text-slate-705 text-slate-700">
                      <p>✨ নির্বাচিত দিনের আনুমানিক মোট সম্ভাব্য আয়: <strong className="text-emerald-700 font-sans text-base">{dailyMetrics.rawEarnings} টাকা</strong></p>
                      <p>🚚 এর মধ্যে কুরিয়ার চার্জ কাস্টমার বহন করবে: <span className="text-[#5D7A5C] font-bold">{dailyMetrics.deliveryCharge} টাকা</span></p>
                    </div>
                    <span className="text-[10px] font-bold text-[#5D7A5C] bg-[#EAF4E8] border border-[#B1D5AD]/60 px-3 py-1.5 rounded-full font-bengali uppercase tracking-wider">
                      ★ Active Live Monitor ★
                    </span>
                  </div>

                  {renderDetailedOrderList(dailyMetrics.list, "দৈনিক ট্র্যাকার")}
                </div>
              )}

              {/* TAB 6: UNIVERSAL SEARCH FILTER */}
              {activeMenu === 'search' && (
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-[#EAF4E8] pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-extrabold text-[#2B4429] flex items-center gap-2 font-bengali">
                        <Search className="h-5.5 w-5.5 text-[#5D7A5C]" />
                        <span>সার্বজনীন গ্রাহক ও বিকাশ ট্রানজেকশন আইডি সার্চ ইঞ্জিন 🔍</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-bengali">
                        কাস্টমারের নাম, মোবাইল নাম্বার, শিপিং জেলা বা নির্দিষ্ট পেমেন্ট TrxID টাইপ করে নিমিষে খুঁজে বের করুন।
                      </p>
                    </div>
                  </div>

                  {/* Input Search Block */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5D7A5C]">
                      <Search className="h-4.5 w-4.5" />
                    </span>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="গ্রাহকের সম্পূর্ণ নাম, মোবাইল, অর্ডারের ইউনিক কোড কিংবা ট্রানজেকশন আইডি লিখে সার্চ করুন..."
                      className="w-full bg-white border-2 border-[#EAF4E8] focus:border-[#5D7A5C] rounded-2xl py-3 pl-11 pr-4 text-[#2B4429] text-xs sm:text-sm placeholder-slate-400 focus:outline-none transition-colors shadow-sm"
                    />
                  </div>

                  {/* Output block list */}
                  <div className="space-y-4">
                    {searchQuery.trim().length === 0 ? (
                      <p className="text-[#5D7A5C] text-center py-8 font-bengali text-xs">অ্যানালিটিক সার্চ ফিল্টার চালু করতে কীবোর্ড থেকে টাইপ শুরু করুন।</p>
                    ) : searchResults.length === 0 ? (
                      <p className="text-slate-400 text-center py-8 font-bengali text-xs">দুঃখিত! এই কি-ওয়ার্ডে কোনো অর্ডার খুঁজে পাওয়া যায়নি। সঠিক শব্দ বা ট্রানজেকশন কোড টাইপ করুন।</p>
                    ) : (
                      renderDetailedOrderList(searchResults, "সার্চ ফলাফল")
                    )}
                  </div>
                </div>
              )}

              {/* TAB 7: PASSWORD CHANGE SETTINGS */}
              {activeMenu === 'settings' && (
                <div className="space-y-6 text-left max-w-md">
                  <div className="border-b border-[#EAF4E8] pb-4">
                    <h3 className="text-xl font-serif font-extrabold text-[#2B4429] flex items-center gap-2 font-bengali">
                      <Settings className="h-5.5 w-5.5 text-[#5D7A5C]" />
                      <span>পাসওয়ার্ড পরিবর্তন ও নিরাপত্তা সেটিংস ⚙️</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-bengali">
                      আপনার পোর্টালের অননুমোদিত এক্সেস নিয়ন্ত্রণে রাখতে নিয়মিত বিরতিতে পাসওয়ার্ড পরিবর্তন বজায় রাখুন।
                    </p>
                  </div>

                  {settingsMessage.text && (
                    <div className={`p-4 rounded-2xl border text-xs font-bengali ${
                      settingsMessage.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                        : 'bg-rose-50 border-rose-300 text-rose-800'
                    }`}>
                      {settingsMessage.text}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs font-bengali text-[#2B4429]">
                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wide">
                        বর্তমান পাসওয়ার্ড (Current Password):
                      </label>
                      <input 
                        type="password"
                        value={currentPasswordConfirm}
                        onChange={(e) => setCurrentPasswordConfirm(e.target.value)}
                        placeholder="আপনার বর্তমান চালু থাকা গোপন পাসওয়ার্ড"
                        className="w-full bg-white border-2 border-[#EAF4E8] rounded-xl py-2 px-3 text-[#2B4429] placeholder-slate-400 focus:outline-none focus:border-[#5D7A5C]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wide">
                        নতুন পিন/পাসওয়ার্ড (New Password):
                      </label>
                      <input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="কমপক্ষে ৫ সংখ্যার নতুন পাসওয়ার্ডটি দিন"
                        className="w-full bg-white border-2 border-[#EAF4E8] rounded-xl py-2 px-3 text-[#2B4429] placeholder-slate-400 focus:outline-none focus:border-[#5D7A5C]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold uppercase tracking-wide">
                        নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password):
                      </label>
                      <input 
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="একই নতুন পাসওয়ার্ড আবার লিখুন পুনরায়"
                        className="w-full bg-white border-2 border-[#EAF4E8] rounded-xl py-2 px-3 text-[#2B4429] placeholder-slate-400 focus:outline-none focus:border-[#5D7A5C]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 py-2.5 px-6 bg-[#5D7A5C] hover:bg-[#4E6A4D] text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>পাসওয়ার্ড সংরক্ষণ ও পরিবর্তন করুন</span>
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* Locked Landing Banner */
          <div className="p-10 text-center bg-white border-2 border-[#D2E4D0] rounded-3xl max-w-lg mx-auto shadow-sm">
            <Lock className="h-11 w-11 text-[#5D7A5C]/40 mx-auto stroke-[1.2] mb-3" />
            <p className="text-xs text-[#5D7A5C] font-mono tracking-wider uppercase font-bold">Secure Verification Active</p>
            <p className="text-xs font-medium text-slate-500 font-bengali mt-2 leading-relaxed">
              জান্নাত’স হেনার সুরক্ষাজনিত কারণে এডমিন ড্যাশবোর্ডে প্রবেশাধিকার তালাবদ্ধ রয়েছে। প্যানেলে প্রবেশ করতে উপরের লক বাটনটি প্রেস করে সঠিক পাসওয়ার্ড ভেরিফাই সম্পন্ন করুন।
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
