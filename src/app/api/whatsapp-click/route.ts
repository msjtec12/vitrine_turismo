import { NextResponse } from 'next/server';
import { storeService } from '@/lib/data/store-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId, productId, cityId } = body;

    if (storeId) {
      await storeService.recordWhatsAppClick(storeId, productId, cityId);
    }

    return NextResponse.json({ success: true, recordedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
