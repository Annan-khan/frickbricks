'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Minus, Plus, Trash2, FolderPlus, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    city: 'Dhaka',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalAmount: cartTotal,
          items: cart.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderComplete(data.data);
        clearCart();
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting order');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center bg-white">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Thank You For Your Order!</h2>
          <p className="text-sm text-gray-600 mt-2">
            Your order ID is <span className="font-mono font-bold text-[#d91e18]">#{orderComplete.id?.slice(0, 8)}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            We will contact you at {orderComplete.customerPhone} to confirm shipping.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/"
              className="bg-[#d91e18] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-[#b81410] transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center bg-white">
        <div className="w-36 h-36 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center relative mb-6 shadow-inner">
          <FolderPlus className="w-16 h-16 text-gray-300 stroke-1" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Your Order List is Empty!
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm">
          Sorry! your cart has no item to show. Please add some product to see here.
        </p>

        <Link
          href="/"
          className="mt-6 bg-[#d91e18] hover:bg-[#b81410] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-md transition shadow-sm active:scale-95"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ---- Shared Tailwind classes for every form input ---- */
  const inputClasses =
    'w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91e18] focus:border-[#d91e18]';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 divide-y divide-gray-100">
          {cart.map((item) => (
            <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
              <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg p-1 shrink-0 flex items-center justify-center">
                <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {item.name}
                </h3>
                <div className="text-xs font-bold text-[#d91e18] mt-0.5">
                  ৳ {item.price}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded bg-white">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="p-1.5 text-gray-600 hover:bg-gray-100"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-1.5 text-gray-600 hover:bg-gray-100"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="text-sm font-bold text-gray-900 w-20 text-right">
                ৳ {item.price * item.quantity}
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="pt-4 flex justify-between items-center text-xs text-gray-500">
            <button onClick={clearCart} className="hover:text-red-500 underline">
              Clear All Cart Items
            </button>
            <Link href="/" className="hover:text-[#d91e18] underline">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary & Checkout Form */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Summary
          </h2>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="text-gray-900 font-semibold">৳ {cartTotal}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Estimated Delivery</span>
            <span className="text-emerald-600 font-medium">Free</span>
          </div>

          <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-100">
            <span>Total</span>
            <span className="text-[#d91e18]">৳ {cartTotal}</span>
          </div>

          {!checkoutOpen ? (
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full bg-[#d91e18] hover:bg-[#b81410] text-white py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <form onSubmit={handleSubmitOrder} className="pt-2 space-y-3">
              <h3 className="text-xs font-bold uppercase text-gray-700">Delivery Information</h3>
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className={inputClasses}
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
              <input
                type="tel"
                placeholder="Phone Number (e.g. 017xxxxxxxx) *"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className={inputClasses}
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
              <input
                type="email"
                placeholder="Email Address (optional)"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className={inputClasses}
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
              <textarea
                placeholder="Full Street Address *"
                required
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={inputClasses}
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
              <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-xs text-amber-800 font-medium">
                💵 Payment: Cash on Delivery / bKash Manual Payment upon delivery
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? 'Placing Order...' : 'Confirm Order (Cash on Delivery)'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
