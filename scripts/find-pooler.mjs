import pg from 'pg';
const { Client } = pg;

const password = 'sqdIrWgKVn21';
const projectRef = 'vwemuftnfslqejaahkvd';

const poolers = [
  'aws-0-sa-east-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-east-2.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
];

async function tryPooler(host) {
  const user = `postgres.${projectRef}`;
  const connectionString = `postgresql://${user}:${password}@${host}:5432/postgres`;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 4000,
  });

  try {
    await client.connect();
    console.log(` SUCCESS! Connected via pooler: ${host}`);
    const res = await client.query('SELECT current_database(), current_user;');
    console.log('Query result:', res.rows[0]);
    await client.end();
    return host;
  } catch (err) {
    console.log(`Failed on ${host}: ${err.message}`);
    return null;
  }
}

async function findWorkingPooler() {
  for (const host of poolers) {
    const ok = await tryPooler(host);
    if (ok) return ok;
  }
}

findWorkingPooler();
