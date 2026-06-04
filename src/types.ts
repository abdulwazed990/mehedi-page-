/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  nameBangla: string;
  weightRange: string;
  price: number;
  image: string;
  fbImageLink: string;
  category: 'hand' | 'nail';
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SliderItem {
  id: string;
  image: string;
  badge: string;
  titleBangla: string;
  titleEnglish: string;
  fbLink: string;
  fallbacks?: string[];
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  district: string;
  upazila: string;
  address: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  quantity: number;
  subtotal: number;
  deliveryCharge: number;
  freeOptionApplied: {
    freeDelivery: boolean;
    freeCones: number;
  };
  totalAmountPaid: number;
  bKashSender: string;
  bKashTrxID: string;
  paidAmount: number;
  orderDate: string;
  status: 'Pending Verification' | 'Processing' | 'Shipped' | 'Cancelled';
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  avatar: string;
  image?: string;
  date: string;
}
