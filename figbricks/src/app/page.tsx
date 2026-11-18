import React from 'react';
import HeroBanner from '@/components/HeroBanner';
import CategoriesList from '@/components/CategoriesList';
import ProductSection from '@/components/ProductSection';
import { prisma } from '@/lib/prisma';

// Clean minifigure svg placeholder for default display before admin uploads actual photos
const defaultMinifigSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 240' width='200' height='240'%3E%3Crect width='200' height='240' fill='%23ffffff'/%3E%3Cpath d='M80 30 h40 v15 h-40 z' fill='%23e2e8f0' stroke='%23cbd5e1' stroke-width='2'/%3E%3Crect x='72' y='45' width='56' height='48' rx='8' fill='%23fef08a' stroke='%23facc15' stroke-width='2'/%3E%3Ccircle cx='88' cy='65' r='3.5' fill='%231e293b'/%3E%3Ccircle cx='112' cy='65' r='3.5' fill='%231e293b'/%3E%3Cpath d='M92 78 Q100 85 108 78' stroke='%231e293b' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M60 98 L72 94 L128 94 L140 98 L135 155 L65 155 Z' fill='%23f1f5f9' stroke='%2394a3b8' stroke-width='2'/%3E%3Crect x='68' y='155' width='64' height='12' fill='%23334155'/%3E%3Crect x='68' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Crect x='102' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Cpath d='M68 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3Cpath d='M102 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3C/svg%3E";

const defaultCategorySvg = (label: string, bg: string = "#111827") =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 150' width='300' height='150'%3E%3Crect width='300' height='150' fill='${encodeURIComponent(bg)}'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-weight='900' font-size='20' fill='%23ffffff' letter-spacing='1'%3E${encodeURIComponent(label)}%3C/text%3E%3C/svg%3E`;

const fallbackCategories = [
  { id: 'c1', name: 'Attack on Titan', slug: 'attack-on-titan', image: defaultCategorySvg('ATTACK ON TITAN', '#0f172a') },
  { id: 'c2', name: 'Jujutsu Kaisen', slug: 'jujutsu-kaisen', image: defaultCategorySvg('JUJUTSU KAISEN', '#09090b') },
  { id: 'c3', name: 'Naruto', slug: 'naruto', image: defaultCategorySvg('NARUTO', '#18181b') },
  { id: 'c4', name: 'One Piece', slug: 'one-piece', image: defaultCategorySvg('ONE PIECE', '#020617') },
  { id: 'c5', name: 'DC', slug: 'dc', image: defaultCategorySvg('DC COMICS', '#002f6c') },
];

const fallbackProducts = [
  // Naruto Section
  {
    id: 'p1',
    name: 'Hinata',
    slug: 'hinata',
    price: 250,
    oldPrice: 300,
    stock: 15,
    images: [defaultMinifigSvg],
    categoryId: 'c3',
    category: { id: 'c3', name: 'Naruto', slug: 'naruto' }
  },
  {
    id: 'p2',
    name: 'Naruto Baryon Mode',
    slug: 'naruto-baryon-mode',
    price: 320,
    oldPrice: 400,
    stock: 10,
    images: [defaultMinifigSvg],
    categoryId: 'c3',
    category: { id: 'c3', name: 'Naruto', slug: 'naruto' }
  },
  {
    id: 'p3',
    name: 'Boruto',
    slug: 'boruto',
    price: 250,
    oldPrice: null,
    stock: 20,
    images: [defaultMinifigSvg],
    categoryId: 'c3',
    category: { id: 'c3', name: 'Naruto', slug: 'naruto' }
  },

  // Stranger Things Section
  {
    id: 'p4',
    name: 'Eleven',
    slug: 'eleven',
    price: 200,
    oldPrice: 300,
    stock: 25,
    images: [defaultMinifigSvg],
    categoryId: 'c-st',
    category: { id: 'c-st', name: 'Stranger Things', slug: 'stranger-things' }
  },

  // Jujutsu Kaisen Section
  {
    id: 'p5',
    name: 'Yuji Sukuna',
    slug: 'yuji-sukuna',
    price: 280,
    oldPrice: 350,
    stock: 8,
    images: [defaultMinifigSvg],
    categoryId: 'c2',
    category: { id: 'c2', name: 'Jujutsu Kaisen', slug: 'jujutsu-kaisen' }
  },
  {
    id: 'p6',
    name: 'Gojo Satoru',
    slug: 'gojo-satoru',
    price: 280,
    oldPrice: null,
    stock: 12,
    images: [defaultMinifigSvg],
    categoryId: 'c2',
    category: { id: 'c2', name: 'Jujutsu Kaisen', slug: 'jujutsu-kaisen' }
  },
  {
    id: 'p7',
    name: 'Geto Suguru',
    slug: 'geto-suguru',
    price: 260,
    oldPrice: 300,
    stock: 6,
    images: [defaultMinifigSvg],
    categoryId: 'c2',
    category: { id: 'c2', name: 'Jujutsu Kaisen', slug: 'jujutsu-kaisen' }
  },

  // Attack On Titan Section
  {
    id: 'p8',
    name: 'Eren Yeager',
    slug: 'eren-yeager',
    price: 250,
    oldPrice: 280,
    stock: 14,
    images: [defaultMinifigSvg],
    categoryId: 'c1',
    category: { id: 'c1', name: 'Attack On Titan', slug: 'attack-on-titan' }
  },
  {
    id: 'p9',
    name: 'Mikasa Ackerman',
    slug: 'mikasa-ackerman',
    price: 250,
    oldPrice: 270,
    stock: 11,
    images: [defaultMinifigSvg],
    categoryId: 'c1',
    category: { id: 'c1', name: 'Attack On Titan', slug: 'attack-on-titan' }
  },
  {
    id: 'p10',
    name: 'Levi Ackerman',
    slug: 'levi-ackerman',
    price: 250,
    oldPrice: 270,
    stock: 16,
    images: [defaultMinifigSvg],
    categoryId: 'c1',
    category: { id: 'c1', name: 'Attack On Titan', slug: 'attack-on-titan' }
  },
  {
    id: 'p11',
    name: 'Levi Final Season',
    slug: 'levi-final-season',
    price: 230,
    oldPrice: 250,
    stock: 7,
    images: [defaultMinifigSvg],
    categoryId: 'c1',
    category: { id: 'c1', name: 'Attack On Titan', slug: 'attack-on-titan' }
  }
];

export default async function HomePage() {
  let categories: any[] = [];
  let banners: any[] = [];
  let products: any[] = [];

  try {
    const [dbCategories, dbBanners, dbProducts] = await Promise.all([
      prisma.category.findMany({ include: { products: true } }),
      prisma.banner.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.product.findMany({ include: { category: true } })
    ]);

    categories = dbCategories.length > 0 ? dbCategories : fallbackCategories;
    banners = dbBanners;
    products = dbProducts.length > 0 ? dbProducts : fallbackProducts;
  } catch (error) {
    categories = fallbackCategories;
    products = fallbackProducts;
  }

  // Group products by category
  const categoriesWithProducts = categories.map((cat) => ({
    ...cat,
    products: products.filter((p) => p.categoryId === cat.id || p.category?.slug === cat.slug)
  })).filter((cat) => cat.products.length > 0);

  return (
    <div className="w-full bg-white pb-16">
      {/* 1. Hero Banner Slider */}
      <HeroBanner banners={banners} />

      {/* 2. Categories Row */}
      <CategoriesList categories={categories} />

      {/* 3. Product Sections per Category matching screenshots */}
      <div className="space-y-6">
        {categoriesWithProducts.map((section) => (
          <ProductSection
            key={section.id}
            title={section.name}
            categorySlug={section.slug}
            products={section.products}
          />
        ))}
      </div>
    </div>
  );
}
