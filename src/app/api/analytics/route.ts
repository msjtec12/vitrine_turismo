import { NextResponse } from 'next/server';
import { storeService } from '@/lib/data/store-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, id } = body;

    if (type === 'store' && id) {
      await storeService.recordStoreView(id);
    } else if (type === 'product' && id) {
      await storeService.recordProductView(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
