import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function saveTrip(trip: Record<string, unknown>) {
  if (!supabase) {
    return { ok: false, error: 'Offline mode' };
  }
  const { error } = await supabase.from('trips').insert([trip]);
  return { ok: !error, error: error?.message };
}