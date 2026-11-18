import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoriesListProps {
  categories: Category[];
}

export default function CategoriesList({ categories }: CategoriesListProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="w-16"></div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center flex-1">
          Categories
        </h2>
        <Link
          href="/categories"
          className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#d91e18] flex items-center gap-0.5 transition"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden h-28 sm:h-32 border border-gray-900 shadow-sm hover:scale-[1.02] transition"
          >
            {cat.image && (
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition"
              />
            )}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-end p-2 transition">
              <span className="text-white text-xs font-semibold truncate w-full text-center">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
