import { readFileSync } from 'fs';
import { resolve } from 'path';
import pg from 'pg';

const { Client } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.vwemuftnfslqejaahkvd:sqdIrWgKVn21@aws-0-sa-east-1.pooler.supabase.com:5432/postgres';

async function run() {
  console.log('Connecting to Supabase PostgreSQL (São Paulo Pooler)...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log(' Connected to Supabase DB successfully!');

    // 1. Run Migration 001
    const mig1Path = resolve('./supabase/migrations/001_initial_schema.sql');
    console.log(`\nExecuting Migration 001: ${mig1Path}...`);
    const sql1 = readFileSync(mig1Path, 'utf8');
    await client.query(sql1);
    console.log(' Migration 001 applied successfully!');

    // 2. Run Migration 002
    const mig2Path = resolve('./supabase/migrations/002_multi_account_artisans.sql');
    console.log(`\nExecuting Migration 002: ${mig2Path}...`);
    const sql2 = readFileSync(mig2Path, 'utf8');
    await client.query(sql2);
    console.log(' Migration 002 applied successfully!');

    // 3. Check created tables
    console.log('\nChecking created tables in public schema...');
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n Tables successfully created and indexed:');
    res.rows.forEach((r) => console.log(`   ✓ ${r.table_name}`));

    // 4. Seed initial Cities and Categories if empty
    const citiesCountRes = await client.query('SELECT count(*) FROM public.cities;');
    const citiesCount = parseInt(citiesCountRes.rows[0].count, 10);

    if (citiesCount === 0) {
      console.log('\n🌱 Seeding initial cities...');
      await client.query(`
        INSERT INTO public.cities (id, name, slug, state, uf, description, cover_image, banner_image, latitude, longitude, is_active)
        VALUES 
        ('11111111-1111-1111-1111-111111111111', 'São Roque', 'sao-roque', 'São Paulo', 'SP', 'A Terra do Vinho e da Gastronomia artesanal. Famosa pelo Roteiro do Vinho, ateliês cerâmicos, marcenaria rústica e doces típicos.', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85', -23.5325, -47.1353, true),
        ('22222222-2222-2222-2222-222222222222', 'Embu das Artes', 'embu-das-artes', 'São Paulo', 'SP', 'O maior polo artístico e de feiras artesanais da Grande São Paulo.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=2000&q=85', -23.6489, -46.8522, true),
        ('33333333-3333-3333-3333-333333333333', 'Campos do Jordão', 'campos-do-jordao', 'São Paulo', 'SP', 'A Suíça Brasileira, conhecida pelos chocolates artesanais e malharias.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85', -22.7394, -45.5913, true),
        ('44444444-4444-4444-4444-444444444444', 'Holambra', 'holambra', 'São Paulo', 'SP', 'A Cidade das Flores, tradição holandesa e cerâmica artística.', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2000&q=85', -22.6322, -47.0544, true)
        ON CONFLICT (slug) DO NOTHING;
      `);
      console.log(' Cities seeded!');
    }

    const categoriesCountRes = await client.query('SELECT count(*) FROM public.categories;');
    const categoriesCount = parseInt(categoriesCountRes.rows[0].count, 10);

    if (categoriesCount === 0) {
      console.log('\n🌱 Seeding initial categories...');
      await client.query(`
        INSERT INTO public.categories (id, name, slug, icon, image_url, description, sort_order, is_active)
        VALUES
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cerâmica & Barro', 'ceramica', 'Sparkles', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80', 'Vasos em torno, travessas em grés, azulejos e utilitários moldados à mão.', 1, true),
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Marcenaria & Madeira', 'madeira', 'Hammer', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', 'Tábuas de corte com madeiras nobres, esculturas rústicas e mobiliário autoral.', 2, true),
        ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bordados & Tecelagem', 'tecelagem', 'Scissors', 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80', 'Bordados à mão, caminhos de mesa, mantas de tear e rendas regionais.', 3, true),
        ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Doces, Queijos & Sabores', 'gastronomia', 'Utensils', 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80', 'Geleias artesanais, queijos maturados, licores e doces de tacho típicos de São Roque.', 4, true),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Vinhos & Licores Artesanais', 'vinhos', 'Wine', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80', 'Vinhos de colheita de inverno, frisantes e licores produzidos no Roteiro do Vinho.', 5, true),
        ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Velas & Aromas Botânicos', 'velas', 'Flame', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80', 'Velas de cera vegetal, essências de lavanda, difusores e saboaria natural.', 6, true)
        ON CONFLICT (slug) DO NOTHING;
      `);
      console.log(' Categories seeded!');
    }

    console.log('\n🎉 ALL MIGRATIONS AND SEEDING COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error executing database operations:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
