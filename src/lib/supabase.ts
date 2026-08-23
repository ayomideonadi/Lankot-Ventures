import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isValidSupabaseUrl = Boolean(
  supabaseUrl &&
  /^https:\/\/[^\s/]+\.supabase\.co(?:\/.*)?$/.test(supabaseUrl)
);
const hasSupabaseCredentials = Boolean(
  isValidSupabaseUrl &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your_supabase_')
);

export const supabase = hasSupabaseCredentials
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
