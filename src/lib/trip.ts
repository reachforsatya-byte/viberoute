export type Currency = 'INR' | 'USD';
export type BudgetTier = 'backpacker' | 'balanced' | 'boujee';

export interface BuilderState {
  destination: string;
  days: number;
  groupSize: number;
  currency: Currency;
  budgetPerPerson: number;
  budgetTier: BudgetTier;
  vibes: string[];
}

export interface BudgetBreakdown {
  stay: number;
  food: number;
  transport: number;
  activities: number;
}

export interface Budget {
  perPerson: BudgetBreakdown;
  perPersonTotal: number;
  groupTotal: number;
}

export interface Stop {
  time: string;
  endTime?: string;
  name: string;
  category: string;
  rating: number;
  costPerPerson: number;
  pros: string;
  cons: string;
}

export interface DayPlan {
  day: number;
  title: string;
  stops: Stop[];
}

export const VIBE_OPTIONS = [
  'Bars & Nightlife',
  'Aesthetic Cafes',
  'Nature & Adventure',
  'Local Street Food',
  'Hidden Gems',
] as const;

export const USD_PER_INR = 83;

export function formatMoney(amountInr: number, currency: Currency): string {
  if (currency === 'USD') {
    return `$${(amountInr / USD_PER_INR).toFixed(2)}`;
  }
  return `₹${Math.round(amountInr).toLocaleString('en-IN')}`;
}

export function deriveTierFromBudget(budgetInr: number, days: number): BudgetTier {
  const perDay = budgetInr / Math.max(1, days);
  if (perDay <= 1800) return 'backpacker';
  if (perDay <= 5000) return 'balanced';
  return 'boujee';
}

export function computeBudget(state: BuilderState): Budget {
  const total = Math.max(500, Math.round(state.budgetPerPerson));
  const hasNightlife = state.vibes.includes('Bars & Nightlife');

  const stayRatio = total / state.days > 5000 ? 0.44 : 0.38;
  const activitiesRatio = hasNightlife ? 0.24 : 0.18;
  const transportRatio = 0.14;
  const foodRatio = 1 - stayRatio - activitiesRatio - transportRatio;

  const stay = Math.round(total * stayRatio);
  const food = Math.round(total * foodRatio);
  const transport = Math.round(total * transportRatio);
  const activities = Math.max(0, total - stay - food - transport);

  return {
    perPerson: { stay, food, transport, activities },
    perPersonTotal: total,
    groupTotal: total * state.groupSize,
  };
}

export const PRICING: Record<Currency, { tripPass: string; seasonPass: string }> = {
  INR: {
    tripPass: '₹99 One-Time Trip Pass (Just ₹25/friend when split!)',
    seasonPass: '₹249 Season Pass (3 Months Unlimited)',
  },
  USD: {
    tripPass: '$4.99 One-Time Trip Pass',
    seasonPass: '$12.99 Season Pass (3 Months Unlimited)',
  },
};

const CURATED_CITY_STOPS: Record<string, Omit<Stop, 'time'>[]> = {
  coimbatore: [
    { name: 'Annapoorna Gowrishankar (RS Puram)', category: 'Local Street Food', rating: 4.8, costPerPerson: 160, pros: 'Legendary ghee roast & filter coffee', cons: 'Packed morning breakfast queue' },
    { name: 'Gass Forest Museum', category: 'Must-See', rating: 4.5, costPerPerson: 50, pros: 'Rare colonial-era forestry exhibits', cons: 'Closes at 5:00 PM sharp' },
    { name: 'The French Door Cafe & Restaurant', category: 'Aesthetic Cafe', rating: 4.6, costPerPerson: 550, pros: 'Heritage bungalow courtyard & pasta', cons: 'Pricier than local spots' },
    { name: 'Marudhamalai Hill Temple', category: 'Must-See', rating: 4.8, costPerPerson: 30, pros: 'Panoramic Western Ghats views', cons: 'Climb or take temple bus early' },
    { name: 'Siruvani Foothills & Kovai Kutralam', category: 'Nature & Adventure', rating: 4.6, costPerPerson: 150, pros: 'Lush forest drive and waterfalls', cons: 'Check forest entry timings' },
    { name: 'Race Course Evening Walk & Street Snacks', category: 'Hidden Gem', rating: 4.5, costPerPerson: 120, pros: 'Tree-lined 3km hangout loop & snacks', cons: 'Busy parking on weekends' },
    { name: 'Bike & Barrel (Residency Towers)', category: 'Rooftop Bar', rating: 4.5, costPerPerson: 950, pros: 'Classic English pub vibe & music', cons: 'Stag entry rules on Saturdays' },
    { name: 'Haribhavanam (Peelamedu)', category: 'Local Street Food', rating: 4.7, costPerPerson: 320, pros: 'Authentic Kongunadu pallipalayam chicken', cons: 'Spicy — order curd alongside' },
    { name: 'Isha Yoga Center & Adiyogi', category: 'Must-See', rating: 4.8, costPerPerson: 0, pros: 'Massive 112-ft bust & evening light show', cons: '30 km outside city center' },
    { name: 'Valankulam Lake Boardwalk', category: 'Hidden Gem', rating: 4.4, costPerPerson: 0, pros: 'Chill sunset reflections over the water', cons: 'Best after 5:30 PM' },
    { name: 'Cafe Totaram (Race Course)', category: 'Aesthetic Cafe', rating: 4.5, costPerPerson: 380, pros: 'Cozy garden seating & cold brews', cons: 'Limited indoor AC tables' },
    { name: 'Cavern Lounge & Kitchen', category: 'Rooftop Bar', rating: 4.4, costPerPerson: 900, pros: 'Late-night DJ sets and cocktails', cons: 'Cover charge after 9:30 PM' },
  ],
  goa: [
    { name: 'Artjuna Garden Cafe (Anjuna)', category: 'Aesthetic Cafe', rating: 4.7, costPerPerson: 450, pros: 'Shakshuka, smoothie bowls & courtyard', cons: 'Waiting list after 10:30 AM' },
    { name: 'Chapora Fort & Vagator Cliff', category: 'Must-See', rating: 4.6, costPerPerson: 0, pros: 'Classic Dil Chahta Hai sunset view', cons: 'Steep 10-min rocky climb' },
    { name: 'Shiva Valley (Anjuna Beach)', category: 'Rooftop Bar', rating: 4.5, costPerPerson: 900, pros: 'Iconic beach shack music & drinks', cons: 'Loud — not for quiet dinners' },
    { name: 'Fontainhas Latin Quarter Walk (Panjim)', category: 'Hidden Gem', rating: 4.7, costPerPerson: 0, pros: 'Portuguese pastel lanes & photo spots', cons: 'Respect residents — keep noise low' },
    { name: 'Ritz Classic (Panjim)', category: 'Local Street Food', rating: 4.7, costPerPerson: 380, pros: 'Best Goan fish thali in town', cons: 'Expect a 20-min lunch wait' },
    { name: 'Thalassa (Siolim)', category: 'Rooftop Bar', rating: 4.6, costPerPerson: 1400, pros: 'Backwater sunset, Greek plates & fire show', cons: 'Book table 2 days ahead' },
    { name: 'Parra Coconut Tree Road', category: 'Hidden Gem', rating: 4.4, costPerPerson: 0, pros: 'Symmetrical palm avenue at sunrise', cons: 'Crowded with reels creators by 9 AM' },
    { name: 'Baba Au Rhum (Anjuna)', category: 'Aesthetic Cafe', rating: 4.7, costPerPerson: 500, pros: 'Wood-fired sourdough & jungle patio', cons: 'Cash/UPI preferred when network drops' },
    { name: 'Kakolem (Tiger) Beach', category: 'Nature & Adventure', rating: 4.7, costPerPerson: 100, pros: 'Secluded cove with zero shacks', cons: 'Steep steps down — carry water' },
    { name: 'Joseph Bar (Fontainhas)', category: 'Rooftop Bar', rating: 4.7, costPerPerson: 450, pros: 'Tiny heritage feni & craft beer tavern', cons: 'Spills onto street — arrive by 7 PM' },
  ],
  kochi: [
    { name: 'Kashi Art Cafe (Fort Kochi)', category: 'Aesthetic Cafe', rating: 4.7, costPerPerson: 420, pros: 'Iconic courtyard gallery & chocolate cake', cons: 'No reservations — walk-in only' },
    { name: 'Chinese Fishing Nets & Fort Kochi Beach', category: 'Must-See', rating: 4.5, costPerPerson: 0, pros: 'Golden-hour silhouettes by the Arabian Sea', cons: 'Skip overpriced beachfront fish stalls' },
    { name: 'Jew Town & Mattancherry Spice Market', category: 'Hidden Gem', rating: 4.6, costPerPerson: 100, pros: 'Antique warehouses & cardamom-scented alleys', cons: 'Closed on Fridays/Saturdays' },
    { name: 'Kayees Rahmathulla Cafe (Mattancherry)', category: 'Local Street Food', rating: 4.6, costPerPerson: 260, pros: 'Legendary Malabar mutton biryani', cons: 'Sells out by 2:30 PM' },
    { name: 'Loafer’s Corner Cafe (Princess Street)', category: 'Aesthetic Cafe', rating: 4.6, costPerPerson: 350, pros: 'Balcony overlooking colonial Princess St', cons: 'Small seating area' },
    { name: 'Vypeen Island Ro-Ro Ferry & Cherai Beach', category: 'Nature & Adventure', rating: 4.6, costPerPerson: 80, pros: '₹10 ferry ride + clean quiet shoreline', cons: 'Last return ferry runs around 9 PM' },
    { name: 'Seagull Lounge (Calvathy Road)', category: 'Rooftop Bar', rating: 4.5, costPerPerson: 750, pros: 'Waterfront beers watching ships pass', cons: 'Basic food — go for drinks & sunset' },
    { name: 'David Hall Art Gallery & Cafe', category: 'Hidden Gem', rating: 4.5, costPerPerson: 380, pros: 'Dutch bungalow wood-fired pizzas', cons: 'Quiet vibe — closes by 10 PM' },
  ],
};

function getCityPool(state: BuilderState): Omit<Stop, 'time'>[] {
  const city = state.destination;
  const key = city.toLowerCase().trim();
  const dailyBudget = state.budgetPerPerson / Math.max(1, state.days);
  const priceScale = dailyBudget <= 1800 ? 0.65 : dailyBudget <= 5000 ? 1 : 1.6;

  const matchedKey = Object.keys(CURATED_CITY_STOPS).find((k) => key.includes(k));
  const rawPool: Omit<Stop, 'time'>[] = matchedKey
    ? [...CURATED_CITY_STOPS[matchedKey]]
    : [
        { name: `${city} Heritage Old Town & Clocktower`, category: 'Must-See', rating: 4.6, costPerPerson: 50, pros: 'Best morning architecture & street life', cons: 'Go before 11 AM to beat heat' },
        { name: `${city} Famous Morning Tiffin & Filter Coffee House`, category: 'Local Street Food', rating: 4.8, costPerPerson: 160, pros: 'Iconic local breakfast packed with regulars', cons: '15-min wait on weekends' },
        { name: `${city} Botanical Garden & Lake Trail`, category: 'Nature & Adventure', rating: 4.5, costPerPerson: 80, pros: 'Shaded lakeside walk & paddle boats', cons: 'Closed on Mondays' },
        { name: `${city} Courtyard Roastery & Art Cafe`, category: 'Aesthetic Cafe', rating: 4.7, costPerPerson: 420, pros: 'Specialty pour-overs & indie decor', cons: 'Limited plug points' },
        { name: `${city} Sunset Hilltop Viewpoint`, category: 'Nature & Adventure', rating: 4.7, costPerPerson: 0, pros: '360-degree golden-hour skyline panorama', cons: 'Windy after dusk — carry a layer' },
        { name: `${city} Central Spice & Handicraft Bazaar`, category: 'Hidden Gem', rating: 4.5, costPerPerson: 200, pros: 'Wholesale local snacks & souvenirs', cons: 'Bargain politely — cash/UPI best' },
        { name: `${city} Skydeck Taproom & Craft Kitchen`, category: 'Rooftop Bar', rating: 4.6, costPerPerson: 950, pros: 'Rooftop breeze, craft brews & live acoustic', cons: 'Reserve table before 8 PM' },
        { name: `${city} Riverside Promenade & Boat Jetty`, category: 'Must-See', rating: 4.6, costPerPerson: 150, pros: 'Scenic ferry hop and waterfront breeze', cons: 'Check last boat schedule' },
        { name: `${city} Regional Thali & Claypot Kitchen`, category: 'Local Street Food', rating: 4.7, costPerPerson: 300, pros: 'Unlimited authentic home-style meal', cons: 'Heavy meal — plan a chill afternoon' },
        { name: `${city} Contemporary Art Gallery & Bookshop`, category: 'Hidden Gem', rating: 4.5, costPerPerson: 100, pros: 'Quiet AC escape with local exhibitions', cons: 'No flash photography allowed' },
        { name: `${city} Botanical Greenhouse & Bakery`, category: 'Aesthetic Cafe', rating: 4.6, costPerPerson: 390, pros: 'Fresh croissants & plant-filled patio', cons: 'Pastries sell out by 5 PM' },
        { name: `${city} Night Food Street & Chaat Corner`, category: 'Local Street Food', rating: 4.7, costPerPerson: 220, pros: '20+ sizzling street stalls in one lane', cons: 'Crowded between 8 PM and 10 PM' },
        { name: `${city} Secret Waterfall / Forest Reservoir`, category: 'Nature & Adventure', rating: 4.7, costPerPerson: 120, pros: 'Zero tourist crowds & crystal pools', cons: '20 km drive — book round-trip cab' },
        { name: `${city} Vinyl Listening Bar & Cocktail Lounge`, category: 'Rooftop Bar', rating: 4.6, costPerPerson: 1050, pros: 'Curated playlists and signature drinks', cons: 'Smart casual dress code' },
        { name: `${city} Colonial Museum & Royal Palace Grounds`, category: 'Must-See', rating: 4.5, costPerPerson: 150, pros: 'Rich local history and manicured lawns', cons: 'Audio guide worth the extra ₹50' },
        { name: `${city} Artisan Gelato & Cold Brew Bar`, category: 'Aesthetic Cafe', rating: 4.6, costPerPerson: 280, pros: 'Small-batch seasonal fruit flavors', cons: 'Standing tables only' },
      ];

  return rawPool.map((item) => ({
    ...item,
    costPerPerson:
      item.costPerPerson === 0 ? 0 : Math.round((item.costPerPerson * priceScale) / 10) * 10,
  }));
}

function buildUniqueFallback(state: BuilderState): DayPlan[] {
  const city = state.destination;
  const hasNightlife = state.vibes.includes('Bars & Nightlife');
  const pool = getCityPool(state);

  let cursor = 0;
  const nextStop = (): Omit<Stop, 'time'> => {
    const item = pool[cursor % pool.length];
    cursor++;
    return item;
  };

  const plans: DayPlan[] = [];
  for (let day = 1; day <= state.days; day++) {
    const morningStart = hasNightlife && day > 1 ? '11:30 AM' : '9:00 AM';
    const stops: Stop[] = [];

    if (day === 1) {
      stops.push({
        time: 'Arrival',
        name: `Arrive & Check-in in ${city}`,
        category: 'Logistics',
        rating: 4.5,
        costPerPerson: 0,
        pros: 'Drop bags, freshen up, rent scooters/cabs',
        cons: 'Confirm early check-in ahead of time',
      });
    }

    stops.push(
      { time: `${morningStart} – 1:00 PM`, ...nextStop() },
      { time: '1:15 PM – 2:45 PM', ...nextStop() },
      { time: '4:30 PM – 6:30 PM', ...nextStop() }
    );

    if (day === state.days) {
      stops.push({
        time: 'Departure',
        name: 'Checkout & Departure',
        category: 'Logistics',
        rating: 4.4,
        costPerPerson: 0,
        pros: 'Pick up local snacks for the ride home',
        cons: 'Keep 45 mins buffer for traffic',
      });
    } else {
      stops.push({ time: '8:30 PM – 11:30 PM', ...nextStop() });
    }

    plans.push({ day, title: `Day ${day}`, stops });
  }

  return plans;
}

async function callGeminiBackend(prompt: string, temperature = 0.7): Promise<string | null> {
  // 1. Try secure backend proxy first (/api/generate on Vercel)
  try {
    const proxyRes = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, temperature }),
    });
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    }
  } catch {
    // Fall through to local key during pure Vite dev
  }

  // 2. Local dev fallback if VITE_GEMINI_API_KEY is present
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 16000);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature },
        }),
      }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function generateItinerary(state: BuilderState): Promise<DayPlan[]> {
  const hasNightlife = state.vibes.includes('Bars & Nightlife');
  const budget = computeBudget(state);
  const prompt = `Plan a ${state.days}-day group trip to "${state.destination}" for ${state.groupSize} friends.
Total budget per person: ₹${state.budgetPerPerson} INR (Stay ₹${budget.perPerson.stay}, Food ₹${budget.perPerson.food}, Transport ₹${budget.perPerson.transport}, Activities ₹${budget.perPerson.activities}).
Vibes: ${state.vibes.length > 0 ? state.vibes.join(', ') : 'Must-sees, local food, chill spots'}.

Strict Rules:
- Use REAL, SPECIFIC places in ${state.destination}. NEVER invent generic names.
- NEVER repeat any place across any day — every single stop must be 100% unique.
- Ensure total activity + food costs across all days stay realistic for the ₹${state.budgetPerPerson} per-person budget.
- ${hasNightlife ? 'Start Day 2+ mornings at 11:30 AM.' : 'Start mornings around 9:00 AM.'}
- Day 1 starts with "Arrive & Check-in in ${state.destination}" (Logistics). Day ${state.days} ends with "Checkout & Departure" (Logistics).
- 4 to 5 stops per day. Costs in INR (integer, 0 if free). Pros and cons under 8 words each.

Return ONLY a JSON array:
[{"day":1,"title":"Day 1","stops":[{"time":"9:00 AM – 10:30 AM","name":"Real Place","category":"Aesthetic Cafe | Must-See | Local Street Food | Nature & Adventure | Rooftop Bar | Hidden Gem | Logistics","rating":4.6,"costPerPerson":350,"pros":"Short pro","cons":"Short con"}]}]`;

  const rawText = await callGeminiBackend(prompt, 0.7);
  if (rawText) {
    try {
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed: DayPlan[] = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fall through to unique curated fallback
    }
  }

  return buildUniqueFallback(state);
}

export async function swapSingleStop(
  state: BuilderState,
  currentStop: Stop,
  existingStopNames: string[]
): Promise<Stop> {
  const prompt = `Suggest ONE real alternative place in "${state.destination}" to replace "${currentStop.name}".
Category: ${currentStop.category}
Target cost per person: around ₹${currentStop.costPerPerson} INR (budget tier: ${state.budgetTier}).
DO NOT suggest any of these already-used places: ${existingStopNames.join(', ')}.

Return ONLY a valid JSON object:
{"name":"Real Alternative Place","category":"${currentStop.category}","rating":4.6,"costPerPerson":${currentStop.costPerPerson},"pros":"Short honest pro under 8 words","cons":"Short honest con under 8 words"}`;

  const rawText = await callGeminiBackend(prompt, 0.85);
  if (rawText) {
    try {
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed.name === 'string' && parsed.name.trim()) {
        return {
          time: currentStop.time,
          name: parsed.name.trim(),
          category: parsed.category || currentStop.category,
          rating: typeof parsed.rating === 'number' ? parsed.rating : 4.6,
          costPerPerson:
            typeof parsed.costPerPerson === 'number'
              ? Math.max(0, Math.round(parsed.costPerPerson))
              : currentStop.costPerPerson,
          pros: parsed.pros || 'Great local alternative spot',
          cons: parsed.cons || 'Check peak timings before heading out',
        };
      }
    } catch {
      // Fall through to local pool swap
    }
  }

  const pool = getCityPool(state);
  const used = new Set(existingStopNames.map((n) => n.toLowerCase()));
  const sameCat = pool.find(
    (s) => s.category === currentStop.category && !used.has(s.name.toLowerCase())
  );
  const anyUnused = pool.find((s) => !used.has(s.name.toLowerCase()));
  const pick = sameCat ?? anyUnused ?? pool[0];

  return {
    ...pick,
    time: currentStop.time,
  };
}

// URL Share Encoding / Decoding (UTF-8 safe base64)
export interface SharedTripPayload {
  s: BuilderState;
  p: DayPlan[];
}

export function encodeShareUrl(state: BuilderState, itinerary: DayPlan[]): string {
  try {
    const payload: SharedTripPayload = { s: state, p: itinerary };
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    const encoded = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const url = new URL(window.location.href);
    url.searchParams.set('trip', encoded);
    return url.toString();
  } catch {
    return window.location.href;
  }
}

export function decodeShareUrl(): SharedTripPayload | null {
  try {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get('trip');
    if (!encoded) return null;
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as SharedTripPayload;
    if (parsed?.s?.destination && Array.isArray(parsed?.p)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function buildWhatsAppSummary(
  state: BuilderState,
  budget: Budget,
  currency: Currency,
  shareUrl?: string
): string {
  const lines: string[] = [];
  lines.push(`*VibeRoute — ${state.destination}*`);
  lines.push(
    `${state.days} days • ${state.groupSize} friends • Budget: ${formatMoney(budget.perPersonTotal, currency)}/person`
  );
  if (state.vibes.length > 0) {
    lines.push(`Vibes: ${state.vibes.join(', ')}`);
  }
  lines.push('');
  lines.push('*Budget breakdown per person:*');
  lines.push(`- Stay: ${formatMoney(budget.perPerson.stay, currency)}`);
  lines.push(`- Food: ${formatMoney(budget.perPerson.food, currency)}`);
  lines.push(`- Transport: ${formatMoney(budget.perPerson.transport, currency)}`);
  lines.push(`- Activities: ${formatMoney(budget.perPerson.activities, currency)}`);
  lines.push('');
  lines.push(`*Group total:* ${formatMoney(budget.groupTotal, currency)}`);
  if (shareUrl) {
    lines.push('');
    lines.push(`View & customize the full route: ${shareUrl}`);
  }
  return lines.join('\n');
}