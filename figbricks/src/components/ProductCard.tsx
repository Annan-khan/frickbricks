'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, RotateCw, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: Product;
}

const defaultMinifigSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 240' width='200' height='240'%3E%3Crect width='200' height='240' fill='%23ffffff'/%3E%3Cpath d='M80 30 h40 v15 h-40 z' fill='%23e2e8f0' stroke='%23cbd5e1' stroke-width='2'/%3E%3Crect x='72' y='45' width='56' height='48' rx='8' fill='%23fef08a' stroke='%23facc15' stroke-width='2'/%3E%3Ccircle cx='88' cy='65' r='3.5' fill='%231e293b'/%3E%3Ccircle cx='112' cy='65' r='3.5' fill='%231e293b'/%3E%3Cpath d='M92 78 Q100 85 108 78' stroke='%231e293b' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M60 98 L72 94 L128 94 L140 98 L135 155 L65 155 Z' fill='%23f1f5f9' stroke='%2394a3b8' stroke-width='2'/%3E%3Crect x='68' y='155' width='64' height='12' fill='%23334155'/%3E%3Crect x='68' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Crect x='102' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Cpath d='M68 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3Cpath d='M102 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3C/svg%3E";

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const mainImage = product.images?.[0] || defaultMinifigSvg;

  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col items-center bg-white p-3 rounded-lg transition">
      {/* Discount badge in top-left matching screenshot */}
      {discountPercent && (
        <span className="absolute top-2 left-2 bg-[#e8f5e9] text-[#2e7d32] text-[11px] font-bold px-2 py-0.5 rounded">
          -{discountPercent}% OFF
        </span>
      )}

      {/* Action icons (Wishlist & Flip circle button in screenshots) */}
      <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition z-10">
        <button
          className="w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-gray-500 hover:text-amber-500 transition"
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
        <button
          className="w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-500 transition"
          title="Rotate / Alternate View"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image on Clean Pure White Background */}
      <Link href={`/products/${product.slug}`} className="w-full flex items-center justify-center py-4 relative">
        <div className="w-44 h-44 sm:w-52 sm:h-52 relative flex items-center justify-center overflow-hidden bg-white">
          <img
            src={mainImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
          />
        </div>
      </Link>

      {/* Circular Red Add-To-Cart Bag Button (Matching screenshots) */}
      <button
        onClick={() =>
          addToCart({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: mainImage,
            stock: product.stock,
          })
        }
        className="w-10 h-10 rounded-full bg-white border-2 border-[#d91e18] text-[#d91e18] flex items-center justify-center hover:bg-[#d91e18] hover:text-white transition shadow-sm -mt-5 mb-2 z-10 active:scale-95"
        title="Add to Cart"
      >
        <ShoppingBag className="w-4 h-4" />
      </button>

      {/* Product Name (black text, clean typography from screenshot) */}
      <div className="w-full text-center mt-1">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-gray-900 hover:text-[#d91e18] transition line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Pricing matching screenshot (crossed out old price + current price) */}
        <div className="flex items-center justify-center gap-2 mt-1">
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ৳ {product.oldPrice}
            </span>
          )}
          <span className="text-sm font-bold text-gray-900">
            ৳ {product.price}
          </span>
        </div>
      </div>
    </div>
  );
}
