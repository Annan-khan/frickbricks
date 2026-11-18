import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultMinifigSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 240' width='200' height='240'%3E%3Crect width='200' height='240' fill='%23ffffff'/%3E%3Cpath d='M80 30 h40 v15 h-40 z' fill='%23e2e8f0' stroke='%23cbd5e1' stroke-width='2'/%3E%3Crect x='72' y='45' width='56' height='48' rx='8' fill='%23fef08a' stroke='%23facc15' stroke-width='2'/%3E%3Ccircle cx='88' cy='65' r='3.5' fill='%231e293b'/%3E%3Ccircle cx='112' cy='65' r='3.5' fill='%231e293b'/%3E%3Cpath d='M92 78 Q100 85 108 78' stroke='%231e293b' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M60 98 L72 94 L128 94 L140 98 L135 155 L65 155 Z' fill='%23f1f5f9' stroke='%2394a3b8' stroke-width='2'/%3E%3Crect x='68' y='155' width='64' height='12' fill='%23334155'/%3E%3Crect x='68' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Crect x='102' y='167' width='30' height='45' fill='%23475569' rx='2'/%3E%3Cpath d='M68 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3Cpath d='M102 212 h30 v10 h-30 z' fill='%231e293b'/%3E%3C/svg%3E";

const defaultCategorySvg = (label, bg = "#111827") =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 150' width='300' height='150'%3E%3Crect width='300' height='150' fill='${encodeURIComponent(bg)}'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-weight='900' font-size='20' fill='%23ffffff' letter-spacing='1'%3E${encodeURIComponent(label)}%3C/text%3E%3C/svg%3E`;

async function main() {
  console.log('🌱 Starting FigBricks database seed...');

  // 1. Categories
  const categoriesData = [
    { name: 'Naruto', slug: 'naruto', image: defaultCategorySvg('NARUTO', '#18181b'), description: 'Naruto Shippuden collectible minifigures' },
    { name: 'Stranger Things', slug: 'stranger-things', image: defaultCategorySvg('STRANGER THINGS', '#0a0a0a'), description: 'Hawkins crew and creatures' },
    { name: 'Jujutsu Kaisen', slug: 'jujutsu-kaisen', image: defaultCategorySvg('JUJUTSU KAISEN', '#09090b'), description: 'Sorcerers and cursed spirits' },
    { name: 'Attack on Titan', slug: 'attack-on-titan', image: defaultCategorySvg('ATTACK ON TITAN', '#0f172a'), description: 'Scout Regiment and Titan figures' },
    { name: 'One Piece', slug: 'one-piece', image: defaultCategorySvg('ONE PIECE', '#020617'), description: 'Straw Hat Pirates and Grand Line crew' },
    { name: 'DC', slug: 'dc', image: defaultCategorySvg('DC COMICS', '#002f6c'), description: 'Batman, Superman, Justice League minifigures' },
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = record.id;
    console.log(`✓ Category: ${record.name}`);
  }

  // 2. Products
  const productsData = [
    // Naruto
    {
      name: 'Hinata',
      slug: 'hinata',
      price: 250,
      oldPrice: 300,
      stock: 15,
      description: 'Byakugan Princess Hinata Hyuga custom minifigure with chakra accessories.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['naruto'],
      isFeatured: true,
    },
    {
      name: 'Naruto Baryon Mode',
      slug: 'naruto-baryon-mode',
      price: 320,
      oldPrice: 400,
      stock: 10,
      description: 'Ultimate Baryon Mode Naruto with glowing chakra effect and fiery tails.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['naruto'],
      isFeatured: true,
    },
    {
      name: 'Boruto',
      slug: 'boruto',
      price: 250,
      oldPrice: null,
      stock: 20,
      description: 'Karma activated Boruto Uzumaki with Rasengan projectile.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['naruto'],
      isFeatured: false,
    },

    // Stranger Things
    {
      name: 'Eleven',
      slug: 'eleven',
      price: 200,
      oldPrice: 300,
      stock: 25,
      description: 'Eleven in her iconic season 1 pink dress with Eggo waffle and nosebleed print.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['stranger-things'],
      isFeatured: true,
    },
    {
      name: 'Demogorgon',
      slug: 'demogorgon',
      price: 250,
      oldPrice: 280,
      stock: 12,
      description: 'Upside Down Demogorgon with open petal mouth and elongated claws.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['stranger-things'],
      isFeatured: true,
    },
    {
      name: 'Dustin',
      slug: 'dustin',
      price: 220,
      oldPrice: 260,
      stock: 18,
      description: 'Dustin Henderson with retro thinking cap, walkie-talkie, and backpack.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['stranger-things'],
      isFeatured: false,
    },

    // Jujutsu Kaisen
    {
      name: 'Yuji Sukuna',
      slug: 'yuji-sukuna',
      price: 280,
      oldPrice: 350,
      stock: 8,
      description: 'King of Curses Sukuna possessing Yuji Itadori with cursed marks and dual expressions.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['jujutsu-kaisen'],
      isFeatured: true,
    },
    {
      name: 'Gojo Satoru',
      slug: 'gojo-satoru',
      price: 280,
      oldPrice: null,
      stock: 12,
      description: 'Special Grade Sorcerer Gojo Satoru with removable blindfold and Six Eyes face.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['jujutsu-kaisen'],
      isFeatured: true,
    },

    // Attack on Titan
    {
      name: 'Eren Yeager',
      slug: 'eren-yeager',
      price: 250,
      oldPrice: 280,
      stock: 14,
      description: 'Scout Regiment Eren Yeager with ODM Gear and dual ultra-hard steel blades.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['attack-on-titan'],
      isFeatured: true,
    },
    {
      name: 'Mikasa Ackerman',
      slug: 'mikasa-ackerman',
      price: 250,
      oldPrice: 270,
      stock: 11,
      description: 'Mikasa Ackerman with signature red scarf and precision ODM blades.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['attack-on-titan'],
      isFeatured: false,
    },
    {
      name: 'Levi Ackerman',
      slug: 'levi-ackerman',
      price: 250,
      oldPrice: 270,
      stock: 16,
      description: "Humanity's Strongest Soldier Captain Levi Ackerman with Scout green cloak.",
      images: [defaultMinifigSvg],
      categoryId: createdCategories['attack-on-titan'],
      isFeatured: true,
    },
    {
      name: 'Levi Final Season',
      slug: 'levi-final-season',
      price: 230,
      oldPrice: 250,
      stock: 7,
      description: 'Battle-hardened Levi in black anti-personnel uniform with thunder spears.',
      images: [defaultMinifigSvg],
      categoryId: createdCategories['attack-on-titan'],
      isFeatured: false,
    },
  ];

  for (const prod of productsData) {
    const record = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
    console.log(`✓ Product: ${record.name} (৳${record.price})`);
  }

  // 3. Banner
  const bannersCount = await prisma.banner.count();
  if (bannersCount === 0) {
    await prisma.banner.create({
      data: {
        title: 'Welcome to FigBricks — Premium Anime & Pop-Culture Minifigures',
        imageUrl: defaultCategorySvg('FIGBRICKS • PREMIUM MINIFIGURES', '#000000'),
        linkUrl: '/products',
        isActive: true,
        order: 1,
      },
    });
    console.log('✓ Banner created');
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
