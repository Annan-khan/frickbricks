'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Mail, Phone } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 text-xs text-gray-600 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <a href="mailto:figbrickss@gmail.com" className="flex items-center gap-1.5 hover:text-red-600 transition">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-600">figbrickss@gmail.com</span>
            </a>
            <div className="hidden sm:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="text-gray-600 hover:text-red-600 transition">
              My Wishlist (0)
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/track-order" className="text-gray-600 hover:text-red-600 transition">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4 bg-white">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#d91e18] uppercase hover:opacity-90">
            FIGBRICKS
          </span>
        </Link>

        {/* Search Bar (Red border, matching screenshot) */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl relative mx-2 sm:mx-6"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 sm:py-2.5 text-sm text-gray-900 bg-white border-2 border-[#d91e18] rounded-md focus:outline-none focus:ring-1 focus:ring-[#d91e18] placeholder-gray-400"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
            />
            <button
              type="submit"
              className="absolute right-3 text-[#d91e18] hover:scale-110 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Action icons */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/cart"
            className="flex items-center text-gray-800 hover:text-[#d91e18] relative group"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-[#d91e18]" />
              <span className="absolute -top-2 -right-2 bg-[#d91e18] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:text-[#d91e18] transition"
          >
            <User className="w-4 h-4 text-gray-600" />
            <span className="hidden sm:inline text-gray-700">Admin / Manage</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
