const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials in .env file. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY');
}

// Create Supabase client with service key (for backend operations)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase; 