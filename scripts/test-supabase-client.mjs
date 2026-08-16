import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vwemuftnfslqejaahkvd.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZW11ZnRuZnNscWVqYWFoa3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MDg4NzYsImV4cCI6MjEwMjQ4NDg3Nn0.ro-uU8-WbZyoXpymhUPWyy8yMl7qefHMiCsPE-NXg2M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing Supabase REST Client connection...');
  try {
    const { data, error } = await supabase.from('cities').select('*');
    console.log('Cities query result:', { data, error });
  } catch (err) {
    console.error('REST test error:', err);
  }
}

test();
