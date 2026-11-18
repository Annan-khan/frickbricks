import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, imageUrl, linkUrl, isActive, order } = body;

    if (!imageUrl) {
      return NextResponse.json({ success: false, message: 'Image URL is required' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title: title || '',
        imageUrl,
        linkUrl: linkUrl || '',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        order: order ? parseInt(order) : 0
      }
    });

    return NextResponse.json({ success: true, data: banner });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    }

    await prisma.banner.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Banner deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
