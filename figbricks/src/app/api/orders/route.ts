import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, address, city, notes, items, totalAmount } = body;

    if (!customerName || !customerPhone || !address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Missing required order details' }, { status: 400 });
    }

    // Verify all products exist in the database
    const productIds = items.map((item: any) => item.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, stock: true }
    });

    const existingIds = new Set(existingProducts.map((p) => p.id));
    const missingItems = items.filter((item: any) => !existingIds.has(item.productId));
    if (missingItems.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Some cart items are demo/fallback items not in the database. Please seed the database (npm run seed) or add products from the Admin dashboard (/admin).'
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail: customerEmail || 'guest@figbricks.com',
        customerPhone,
        address,
        city: city || 'Dhaka',
        notes: notes || '',
        totalAmount: parseFloat(totalAmount),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(item.price)
          }))
        }
      },
      include: { items: true }
    });

    // Optionally decrease stock for each product
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      }).catch((e: any) => console.log('Stock decrement err:', e));
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'ID and status required' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
