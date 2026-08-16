export async function logWhatsAppClick(storeId: string, productId?: string, cityId?: string, productName?: string) {
  try {
    // Send to backend API
    await fetch('/api/whatsapp-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId,
        productId,
        cityId,
        productName,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Silently fail if offline
  }
}

export async function logView(type: 'store' | 'product' | 'city', id: string) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        id,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {}
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  // Strip non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}
