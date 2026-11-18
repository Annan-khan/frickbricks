import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductSectionProps {
  title: string;
  categorySlug: string;
  products: Product[];
}

export default function ProductSection({ title, categorySlug, products }: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 bg-white border-b border-gray-100 last:border-none">
      <div className="flex items-center justify-between mb-6">
        <div className="w-16"></div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center flex-1">
          {title}
        </h2>
        <Link
          href={`/products?category=${categorySlug}`}
          className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#d91e18] flex items-center gap-0.5 transition"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 bg-white">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
