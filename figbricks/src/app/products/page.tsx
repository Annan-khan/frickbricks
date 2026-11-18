'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';

const defaultMinifigSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 240' width='200' height='240'%3E%3Crect width='200' height='240' fill='%23ffffff'/%3E%3Cpath d='M80 30 h40 v15 h-40 z' fill='%23e2e8f0' stroke='%23cbd5e1' stroke-width='2'/%3E%3Crect x='72' y='45' width='56' height='48' rx='8' fill='%23fef08a' stroke='%23facc15' stroke-width='2'/%3E%3Ccircle cx='88' cy='65' r='3.5' fill='%231e293b'/%3E%3Ccircle cx='112' cy='65' r='3.5' fill='%231e293b'/%3E%3Cpath d='M92 78 Q100 85 108 78' stroke='%231e293b' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M60 98 L72 94 L128 94 L140 98 L135 155 L65 155 Z' fill='%23f1f5f9' stroke='%2394a3b8' stroke-width='2'/%3E%3Crect x='68' y='155' width='64' height='12' fill='%23334155'/%3E%3Crect x='68' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Crect x='102' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Cpath d='M68 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3Cpath d='M102 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3C/svg%3E";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchFilter = searchParams.get('search');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (categoryFilter) query.set('category', categoryFilter);
    if (searchFilter) query.set('search', searchFilter);

    fetch(`/api/products?${query.toString()}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.length > 0) {
          setProducts(res.data);
        } else {
          setProducts([
            { id: '1', name: 'Hinata', slug: 'hinata', price: 250, oldPrice: 300, stock: 15, images: [defaultMinifigSvg], categoryId: 'c1' },
            { id: '2', name: 'Naruto Baryon Mode', slug: 'naruto-baryon-mode', price: 320, oldPrice: 400, stock: 10, images: [defaultMinifigSvg], categoryId: 'c1' },
            { id: '3', name: 'Boruto', slug: 'boruto', price: 250, oldPrice: null, stock: 20, images: [defaultMinifigSvg], categoryId: 'c1' },
            { id: '4', name: 'Eleven', slug: 'eleven', price: 200, oldPrice: 300, stock: 25, images: [defaultMinifigSvg], categoryId: 'c2' },
            { id: '5', name: 'Yuji Sukuna', slug: 'yuji-sukuna', price: 280, oldPrice: 350, stock: 8, images: [defaultMinifigSvg], categoryId: 'c3' },
            { id: '6', name: 'Gojo Satoru', slug: 'gojo-satoru', price: 280, oldPrice: null, stock: 12, images: [defaultMinifigSvg], categoryId: 'c3' },
            { id: '7', name: 'Eren Yeager', slug: 'eren-yeager', price: 250, oldPrice: 280, stock: 14, images: [defaultMinifigSvg], categoryId: 'c4' },
            { id: '8', name: 'Mikasa Ackerman', slug: 'mikasa-ackerman', price: 250, oldPrice: 270, stock: 11, images: [defaultMinifigSvg], categoryId: 'c4' },
            { id: '9', name: 'Levi Ackerman', slug: 'levi-ackerman', price: 250, oldPrice: 270, stock: 16, images: [defaultMinifigSvg], categoryId: 'c4' },
            { id: '10', name: 'Levi Final Season', slug: 'levi-final-season', price: 230, oldPrice: 250, stock: 7, images: [defaultMinifigSvg], categoryId: 'c4' },
          ]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryFilter, searchFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {searchFilter
            ? `Search Results for "${searchFilter}"`
            : categoryFilter
            ? `Category: ${categoryFilter}`
            : 'All Collectible Minifigures'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Showing {products.length} products
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d91e18]"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 bg-white">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm bg-white">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
