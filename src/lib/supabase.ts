import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)?.trim();
const isValidSupabaseUrl = (() => {
  if (!supabaseUrl) return false;
  try {
    const url = new URL(supabaseUrl);
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
})();
const hasSupabaseCredentials = Boolean(
  isValidSupabaseUrl &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your_supabase_') &&
  !supabaseAnonKey.includes('your-anon-key') &&
  !supabaseAnonKey.includes('your-publishable-key')
);

export const supabase = hasSupabaseCredentials
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
