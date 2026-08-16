const supabaseUrl = 'https://vwemuftnfslqejaahkvd.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZW11ZnRuZnNscWVqYWFoa3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MDg4NzYsImV4cCI6MjEwMjQ4NDg3Nn0.ro-uU8-WbZyoXpymhUPWyy8yMl7qefHMiCsPE-NXg2M';

async function testFetch() {
  console.log('Testing direct REST fetch to Supabase...');
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    console.log('Response status:', res.status, res.statusText);
    const data = await res.json();
    console.log('Supabase API root response:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testFetch();
