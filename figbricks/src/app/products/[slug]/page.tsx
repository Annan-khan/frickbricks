'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Minus, Plus, ShoppingCart, Zap, Star } from 'lucide-react';

const defaultMinifigSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 240' width='200' height='240'%3E%3Crect width='200' height='240' fill='%23ffffff'/%3E%3Cpath d='M80 30 h40 v15 h-40 z' fill='%23e2e8f0' stroke='%23cbd5e1' stroke-width='2'/%3E%3Crect x='72' y='45' width='56' height='48' rx='8' fill='%23fef08a' stroke='%23facc15' stroke-width='2'/%3E%3Ccircle cx='88' cy='65' r='3.5' fill='%231e293b'/%3E%3Ccircle cx='112' cy='65' r='3.5' fill='%231e293b'/%3E%3Cpath d='M92 78 Q100 85 108 78' stroke='%231e293b' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M60 98 L72 94 L128 94 L140 98 L135 155 L65 155 Z' fill='%23f1f5f9' stroke='%2394a3b8' stroke-width='2'/%3E%3Crect x='68' y='155' width='64' height='12' fill='%23334155'/%3E%3Crect x='68' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Crect x='102' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Cpath d='M68 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3Cpath d='M102 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3C/svg%3E";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    params.then(({ slug }) => {
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setProduct(res.data);
            setActiveImage(res.data.images?.[0] || '');
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d91e18]"></div>
      </div>
    );
  }

  const currentProduct = product || {
    id: 'demo-1',
    name: 'Eleven',
    slug: 'eleven',
    price: 200,
    oldPrice: 300,
    stock: 25,
    description: 'Stranger Things Eleven Minifigure with bike and accessories.',
    images: [defaultMinifigSvg],
    category: {
      name: 'Stranger Things',
      slug: 'stranger-things',
      products: [
        { id: 'rel-1', name: 'Eddie Munson', slug: 'eddie-munson', price: 200, stock: 10, images: [defaultMinifigSvg] },
        { id: 'rel-2', name: 'Will Byers', slug: 'will-byers', price: 200, stock: 8, images: [defaultMinifigSvg] },
        { id: 'rel-3', name: 'Max', slug: 'max', price: 200, stock: 12, images: [defaultMinifigSvg] }
      ]
    }
  };

  const selectedImg = activeImage || currentProduct.images?.[0] || defaultMinifigSvg;
  const discountAmount = currentProduct.oldPrice ? currentProduct.oldPrice - currentProduct.price : null;
  const discountPercent = currentProduct.oldPrice
    ? Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(
      {
        id: currentProduct.id,
        productId: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: selectedImg,
        stock: currentProduct.stock,
      },
      quantity
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Images on pure white with discount tag */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-100 relative">
          {discountPercent && (
            <span className="absolute top-4 left-4 bg-[#e8f5e9] text-[#2e7d32] text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}% OFF
            </span>
          )}

          <div className="w-full h-80 sm:h-96 flex items-center justify-center p-4 bg-white">
            <img
              src={selectedImg}
              alt={currentProduct.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {currentProduct.images?.length > 1 && (
            <div className="flex gap-2 justify-center mt-4">
              {currentProduct.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-lg border-2 p-1 overflow-hidden transition bg-white ${
                    selectedImg === img ? 'border-[#d91e18]' : 'border-gray-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Details matching Screenshot 2 */}
        <div className="lg:col-span-4 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {currentProduct.name}
          </h1>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5" />
              ))}
            </div>
            <span>(0 reviews)</span>
          </div>

          {/* Price Header with Taka Symbol ৳ */}
          <div className="flex items-baseline gap-3 py-2">
            <span className="text-4xl font-extrabold text-[#d91e18] flex items-center">
              <span className="text-3xl mr-1">৳</span>
              {currentProduct.price}
            </span>
            {currentProduct.oldPrice && (
              <div className="flex flex-col">
                <span className="text-xs text-amber-600 font-semibold">
                  ৳ {discountAmount} Off
                </span>
                <span className="text-base text-gray-400 line-through">
                  ৳ {currentProduct.oldPrice}
                </span>
              </div>
            )}
          </div>

          {/* Quantity and Actions matching Screenshot 2 */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center border border-gray-300 rounded-md bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-base text-gray-900 bg-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(currentProduct.stock || 99, q + 1))}
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-[140px] bg-[#d91e18] hover:bg-[#b81410] text-white py-2.5 px-4 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to cart
            </button>

            <Link
              href="/cart"
              onClick={handleAddToCart}
              className="min-w-[120px] bg-[#f7c948] hover:bg-[#e2b336] text-gray-900 py-2.5 px-4 rounded-md font-bold text-sm flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
            >
              <Zap className="w-4 h-4 fill-gray-900" />
              Buy Now
            </Link>
          </div>

          <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
            Category:{' '}
            <Link
              href={`/products?category=${currentProduct.category?.slug}`}
              className="text-[#d91e18] font-medium hover:underline"
            >
              {currentProduct.category?.name || 'General'}
            </Link>
          </div>

          {currentProduct.description && (
            <div className="pt-3">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-1">Description</h3>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {currentProduct.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Related Products matching Screenshot 2 */}
        <div className="lg:col-span-3 bg-white p-5 rounded-xl border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 pb-2 border-b-2 border-[#d91e18] mb-4">
            Related Products
          </h3>

          <div className="space-y-4">
            {currentProduct.category?.products?.map((rel: any) => (
              <Link
                key={rel.id}
                href={`/products/${rel.slug}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition group"
              >
                <div className="w-14 h-14 bg-white rounded p-1 flex items-center justify-center border border-gray-100 shrink-0">
                  <img
                    src={rel.images?.[0] || defaultMinifigSvg}
                    alt={rel.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-800 truncate group-hover:text-[#d91e18] transition">
                    {rel.name}
                  </h4>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">
                    ৳ {rel.price}
                  </div>
                  <div className="flex text-amber-400 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5" />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
