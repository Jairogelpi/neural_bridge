import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
