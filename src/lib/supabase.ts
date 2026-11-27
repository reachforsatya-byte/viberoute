import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const ALLOWED_CURRENCIES = new Set(['INR', 'USD', 'EUR', 'GBP']);
const ALLOWED_TIERS = new Set(['budget', 'balanced', 'luxury']);

interface SanitizedTrip {
  destination: string;
  days: number;
  group_size: number;
  currency: string;
  budget_tier: string;
  vibes: string[];
}

function sanitizeTripPayload(raw: Record<string, unknown>): SanitizedTrip | null {
  const destination =
    typeof raw.destination === 'string' ? raw.destination.trim().slice(0, 120) : '';
  if (!destination) return null;

  const daysNum = Number(raw.days);
  const groupNum = Number(raw.group_size);
  const days = Number.isFinite(daysNum) ? Math.max(1, Math.min(30, Math.round(daysNum))) : 1;
  const group_size = Number.isFinite(groupNum)
    ? Math.max(1, Math.min(50, Math.round(groupNum)))
    : 1;

  const rawCurrency = typeof raw.currency === 'string' ? raw.currency.toUpperCase() : 'INR';
  const currency = ALLOWED_CURRENCIES.has(rawCurrency) ? rawCurrency : 'INR';

  const rawTier = typeof raw.budget_tier === 'string' ? raw.budget_tier.toLowerCase() : 'balanced';
  const budget_tier = ALLOWED_TIERS.has(rawTier) ? rawTier : 'balanced';

  const vibes = Array.isArray(raw.vibes)
    ? raw.vibes
        .filter((v): v is string => typeof v === 'string')
        .map((v) => v.trim().slice(0, 50))
        .filter(Boolean)
        .slice(0, 10)
    : [];

  return {
    destination,
    days,
    group_size,
    currency,
    budget_tier,
    vibes,
  };
}

export async function saveTrip(trip: Record<string, unknown>) {
  if (!supabase) {
    return { ok: false, error: 'Offline mode' };
  }

  const cleanTrip = sanitizeTripPayload(trip);
  if (!cleanTrip) {
    return { ok: false, error: 'Invalid trip payload' };
  }

  const { error } = await supabase.from('trips').insert([cleanTrip]);
  return { ok: !error, error: error?.message };
}