const supabaseUrl = 'https://vwemuftnfslqejaahkvd.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZW11ZnRuZnNscWVqYWFoa3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MDg4NzYsImV4cCI6MjEwMjQ4NDg3Nn0.ro-uU8-WbZyoXpymhUPWyy8yMl7qefHMiCsPE-NXg2M';

async function testFetchCities() {
  console.log('Testing table query /rest/v1/cities...');
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/cities?select=*`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    console.log('Response status:', res.status, res.statusText);
    const data = await res.json();
    console.log('Result:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testFetchCities();
