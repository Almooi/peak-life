require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Testing Supabase connection...');

  // Test: insert a row (will fail if table doesn't exist, proving we're connected)
  const { data, error } = await supabase
    .from('test_connection')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    console.log('Connected! Table does not exist yet — need to create it via SQL Editor.');
    console.log('\nRun this SQL in your Supabase Dashboard → SQL Editor:\n');
    console.log(`CREATE TABLE test_connection (
  id bigint generated always as identity primary key,
  message text,
  created_at timestamptz default now()
);
INSERT INTO test_connection (message) VALUES ('Claude Code connected successfully!');`);
  } else if (error) {
    console.error('Connection error:', error.message);
  } else {
    console.log('Connected! Table exists. Rows:', data);
  }
}

main();
