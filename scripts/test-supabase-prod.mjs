const supabaseUrl = 'https://vwemuftnfslqejaahkvd.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZW11ZnRuZnNscWVqYWFoa3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MDg4NzYsImV4cCI6MjEwMjQ4NDg3Nn0.ro-uU8-WbZyoXpymhUPWyy8yMl7qefHMiCsPE-NXg2M';

async function testSupabaseProduction() {
  console.log('Testing Supabase stores & products queries...');
  try {
    const [storesRes, prodsRes, artisansRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/stores?select=*`, {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
      }),
      fetch(`${supabaseUrl}/rest/v1/products?select=*`, {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
      }),
      fetch(`${supabaseUrl}/rest/v1/artisans?select=*`, {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
      }),
    ]);

    const stores = await storesRes.json();
    const prods = await prodsRes.json();
    const artisans = await artisansRes.json();

    console.log(`✓ Fetched ${stores.length} stores from Supabase.`);
    console.log(`✓ Fetched ${prods.length} products from Supabase.`);
    console.log(`✓ Fetched ${artisans.length} artisans from Supabase.`);
  } catch (err) {
    console.error('Error querying Supabase:', err);
  }
}

testSupabaseProduction();
