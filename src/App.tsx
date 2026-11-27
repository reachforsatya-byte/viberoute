import { useEffect, useState } from 'react';
import { ArrowUpRight, Compass, Sun, Moon } from 'lucide-react';
import TripBuilder from '@/components/TripBuilder';
import ItineraryView from '@/components/ItineraryView';
import { saveTrip } from '@/lib/supabase';
import {
  computeBudget,
  decodeShareUrl,
  deriveTierFromBudget,
  encodeShareUrl,
  generateItinerary,
  swapSingleStop,
  type BuilderState,
  type DayPlan,
} from '@/lib/trip';

export type Theme = 'light' | 'dark';

const PORTFOLIO_URL = 'https://satyendra-portfolio-gmg7.vercel.app';

const INITIAL_STATE: BuilderState = {
  destination: '',
  days: 3,
  groupSize: 4,
  currency: 'INR',
  budgetPerPerson: 0,
  budgetTier: 'balanced',
  vibes: [],
};

const PRESETS = [
  {
    index: '01',
    city: 'North Goa',
    tag: '3D • 4 PAX • COASTAL',
    days: 3,
    groupSize: 4,
    vibes: ['Bars & Nightlife', 'Local Street Food'],
    note: 'Late mornings, heritage Latin quarters & sunset shacks',
  },
  {
    index: '02',
    city: 'Fort Kochi',
    tag: '2D • 3 PAX • HERITAGE',
    days: 2,
    groupSize: 3,
    vibes: ['Aesthetic Cafes', 'Hidden Gems'],
    note: 'Courtyard galleries, ferry hops & Arabian Sea promenades',
  },
  {
    index: '03',
    city: 'Coimbatore',
    tag: '2D • 4 PAX • FOOTHILLS',
    days: 2,
    groupSize: 4,
    vibes: ['Local Street Food', 'Nature & Adventure'],
    note: 'RS Puram tiffin, Marudhamalai & Siruvani forest drives',
  },
];

export default function App() {
  const shared = decodeShareUrl();

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('viberoute-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const [builder, setBuilder] = useState<BuilderState>(shared?.s ?? INITIAL_STATE);
  const [active, setActive] = useState<BuilderState | null>(shared?.s ?? null);
  const [itinerary, setItinerary] = useState<DayPlan[]>(shared?.p ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    localStorage.setItem('viberoute-theme', theme);
    document.body.style.backgroundColor = isDark ? '#050517' : '#F6F4EF';
    document.body.style.color = isDark ? '#F7EFE2' : '#141210';
  }, [theme, isDark]);

  const clearUrlTrip = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('trip');
    window.history.replaceState(null, '', url.toString());
  };

  const handleGenerate = async () => {
    if (!builder.destination.trim()) {
      setError('Enter a destination first — Coimbatore, Goa, Kochi, anywhere.');
      return;
    }
    if (!builder.days || builder.days < 1) {
      setError('Enter at least 1 day for your trip.');
      return;
    }
    if (!builder.budgetPerPerson || builder.budgetPerPerson <= 0) {
      setError('Enter your budget per person so every stop scales to fit.');
      return;
    }

    setError(null);
    setSaveFailed(false);
    setLoading(true);

    const snapshot: BuilderState = {
      ...builder,
      destination: builder.destination.trim(),
      days: Math.max(1, Math.min(30, Math.round(builder.days))),
      budgetTier: deriveTierFromBudget(builder.budgetPerPerson, builder.days),
    };

    try {
      const plan = await generateItinerary(snapshot);
      setActive(snapshot);
      setItinerary(plan);

      const shareUrl = encodeShareUrl(snapshot, plan);
      window.history.replaceState(null, '', shareUrl);

      saveTrip({
        destination: snapshot.destination,
        days: snapshot.days,
        group_size: snapshot.groupSize,
        currency: snapshot.currency,
        budget_tier: snapshot.budgetTier,
        vibes: snapshot.vibes,
      }).then((res) => {
        if (!res.ok) setSaveFailed(true);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate trip. Check your API configuration.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSwapStop = async (dayIdx: number, stopIdx: number) => {
    if (!active) return;
    const targetStop = itinerary[dayIdx]?.stops[stopIdx];
    if (!targetStop) return;

    const existingNames = itinerary.flatMap((d) => d.stops.map((s) => s.name));
    const replacement = await swapSingleStop(active, targetStop, existingNames);

    const updated = itinerary.map((day, dIdx) =>
      dIdx !== dayIdx
        ? day
        : {
            ...day,
            stops: day.stops.map((s, sIdx) => (sIdx === stopIdx ? replacement : s)),
          }
    );

    setItinerary(updated);
    const shareUrl = encodeShareUrl(active, updated);
    window.history.replaceState(null, '', shareUrl);
  };

  const budget = active ? computeBudget(active) : null;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-[#050517] text-[#F7EFE2] selection:bg-[#CF5C36] selection:text-[#050517]'
          : 'bg-[#F6F4EF] text-[#141210] selection:bg-[#D94E28] selection:text-white'
      }`}
    >
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[460px] opacity-70"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle at 50% 0%, rgba(207, 92, 54, 0.14), transparent 65%)'
            : 'radial-gradient(circle at 50% 0%, rgba(217, 78, 40, 0.08), transparent 65%)',
        }}
      />

      <header
        className={`relative border-b backdrop-blur-md sticky top-0 z-30 transition-colors duration-300 ${
          isDark
            ? 'border-[#1C1C3A] bg-[#050517]/85'
            : 'border-[#E3DDD2] bg-[#F6F4EF]/85'
        }`}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setActive(null);
              clearUrlTrip();
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDark
                  ? 'bg-[#CF5C36] text-[#050517] group-hover:bg-[#EFC88B]'
                  : 'bg-[#141210] text-[#F6F4EF] group-hover:bg-[#D94E28]'
              }`}
            >
              <Compass size={18} className="stroke-[2]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-lg font-extrabold tracking-[-0.03em] ${
                  isDark ? 'text-white' : 'text-[#141210]'
                }`}
              >
                VibeRoute
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-widest ${
                  isDark ? 'text-[#EFC88B]/80' : 'text-[#78716C]'
                }`}
              >
                EDITION 01
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <span
              className={`hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider ${
                isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-[#CF5C36]' : 'bg-[#D94E28]'
                }`}
              />
              Budget-Calibrated Routes
            </span>

            <div
              role="group"
              aria-label="Theme switcher"
              className={`inline-flex items-center rounded-full p-1 border transition-colors ${
                isDark
                  ? 'bg-[#0B0B22] border-[#25254A]'
                  : 'bg-white border-[#E3DDD2] shadow-2xs'
              }`}
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                aria-label="Light mode"
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                  !isDark
                    ? 'bg-[#141210] text-[#F6F4EF]'
                    : 'text-[#8E89A6] hover:text-white'
                }`}
              >
                <Sun size={12} />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                aria-label="Dark mode"
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#CF5C36] text-[#050517]'
                    : 'text-[#78716C] hover:text-[#141210]'
                }`}
              >
                <Moon size={12} />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-28">
        <section className="pt-14 pb-12 sm:pt-20 sm:pb-14 animate-tubik-in">
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`font-mono text-[11px] uppercase tracking-[0.18em] font-semibold ${
                isDark ? 'text-[#EFC88B]' : 'text-[#D94E28]'
              }`}
            >
              CURATED GROUP ITINERARIES
            </span>
            <span
              className={`h-px w-12 ${isDark ? 'bg-[#25254A]' : 'bg-[#D6CFC2]'}`}
            />
          </div>

          <h1
            className={`text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-[-0.04em] leading-[1.02] max-w-4xl ${
              isDark ? 'text-white' : 'text-[#141210]'
            }`}
          >
            Stop arguing in the group chat. Plan your trip in{' '}
            <span
              className={`font-editorial italic font-normal text-[1.12em] tracking-normal ${
                isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'
              }`}
            >
              ten seconds.
            </span>
          </h1>

          <p
            className={`mt-6 text-base sm:text-lg max-w-2xl leading-relaxed font-normal ${
              isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
            }`}
          >
            Define your exact per-person budget, destination, and late-night pace. Every stay split, neighborhood walk, and local table calibrates automatically.
          </p>
        </section>

        {active && budget ? (
          <div className="space-y-6 animate-tubik-in">
            <ItineraryView
              state={active}
              budget={budget}
              itinerary={itinerary}
              onBuilderClick={() => {
                setActive(null);
                clearUrlTrip();
              }}
              onSwapStop={handleSwapStop}
              theme={theme}
            />
            {saveFailed && (
              <p
                className={`text-center font-mono text-xs ${
                  isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'
                }`}
              >
                Local session mode — your itinerary is ready above.
              </p>
            )}
          </div>
        ) : (
          <div className="animate-tubik-in" style={{ animationDelay: '80ms' }}>
            <TripBuilder
              value={builder}
              onChange={setBuilder}
              onGenerate={handleGenerate}
              loading={loading}
              error={error}
              theme={theme}
            />
          </div>
        )}

        {!active && (
          <section
            className="mt-20 space-y-16 animate-tubik-in"
            style={{ animationDelay: '160ms' }}
          >
            <div>
              <div
                className={`flex items-center justify-between border-b pb-3 mb-6 ${
                  isDark ? 'border-[#1C1C3A]' : 'border-[#E3DDD2]'
                }`}
              >
                <span
                  className={`font-mono text-xs uppercase tracking-[0.14em] ${
                    isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
                  }`}
                >
                  Quick-Fill Destinations (Enter Budget Above)
                </span>
                <span
                  className={`font-mono text-[11px] ${
                    isDark ? 'text-[#EFC88B]/70' : 'text-[#78716C]'
                  }`}
                >
                  03 CURATED ROUTES
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.city}
                    type="button"
                    onClick={() => {
                      setBuilder({
                        ...builder,
                        destination: preset.city,
                        days: preset.days,
                        groupSize: preset.groupSize,
                        vibes: preset.vibes,
                      });
                      window.scrollTo({ top: 220, behavior: 'smooth' });
                    }}
                    className={`tubik-card group text-left rounded-2xl border p-6 cursor-pointer ${
                      isDark
                        ? 'border-[#1C1C3A] hover:border-[#CF5C36] bg-[#0B0B22] hover:shadow-[0_22px_44px_-16px_rgba(207,92,54,0.2)]'
                        : 'border-[#E3DDD2] hover:border-[#141210] bg-white hover:shadow-[0_22px_44px_-16px_rgba(20,18,16,0.1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`font-mono text-xs font-semibold ${
                          isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'
                        }`}
                      >
                        {preset.index}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full ${
                          isDark
                            ? 'text-[#EFC88B] bg-[#050517] border border-[#25254A]'
                            : 'text-[#57534E] bg-[#F6F4EF]'
                        }`}
                      >
                        {preset.tag}
                        <ArrowUpRight
                          size={12}
                          className={`group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${
                            isDark ? 'text-[#EFC88B]' : 'text-[#141210]'
                          }`}
                        />
                      </span>
                    </div>

                    <h3
                      className={`text-xl font-bold tracking-[-0.02em] transition-colors ${
                        isDark
                          ? 'text-white group-hover:text-[#EFC88B]'
                          : 'text-[#141210] group-hover:text-[#D94E28]'
                      }`}
                    >
                      {preset.city}
                    </h3>
                    <p
                      className={`text-sm mt-2 leading-relaxed ${
                        isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
                      }`}
                    >
                      {preset.note}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`border-t pt-10 grid grid-cols-1 md:grid-cols-3 gap-8 ${
                isDark ? 'border-[#1C1C3A]' : 'border-[#E3DDD2]'
              }`}
            >
              <div>
                <span
                  className={`font-mono text-xs font-semibold tracking-wider ${
                    isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'
                  }`}
                >
                  01 / BUDGET CALIBRATION
                </span>
                <h4
                  className={`text-base font-bold mt-2 ${
                    isDark ? 'text-white' : 'text-[#141210]'
                  }`}
                >
                  Scales to your exact ₹/$ cap
                </h4>
                <p
                  className={`text-sm mt-1.5 leading-relaxed ${
                    isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
                  }`}
                >
                  Type your real per-head limit — accommodation, dining, cabs, and stops rebalance automatically.
                </p>
              </div>
              <div>
                <span
                  className={`font-mono text-xs font-semibold tracking-wider ${
                    isDark ? 'text-[#EFC88B]' : 'text-[#D94E28]'
                  }`}
                >
                  02 / HUMAN PACING
                </span>
                <h4
                  className={`text-base font-bold mt-2 ${
                    isDark ? 'text-white' : 'text-[#141210]'
                  }`}
                >
                  Nightlife-aware morning starts
                </h4>
                <p
                  className={`text-sm mt-1.5 leading-relaxed ${
                    isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
                  }`}
                >
                  Enable Bars & Nightlife and Day 2+ shifts to 11:30 AM instead of unrealistic 9:00 AM alarms.
                </p>
              </div>
              <div>
                <span
                  className={`font-mono text-xs font-semibold tracking-wider ${
                    isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'
                  }`}
                >
                  03 / INSTANT HANDOFF
                </span>
                <h4
                  className={`text-base font-bold mt-2 ${
                    isDark ? 'text-white' : 'text-[#141210]'
                  }`}
                >
                  One-tap group chat summary
                </h4>
                <p
                  className={`text-sm mt-1.5 leading-relaxed ${
                    isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
                  }`}
                >
                  Copy a clean split breakdown paired with a shareable link, Maps, Shorts, and Reels previews.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer
        className={`border-t py-8 transition-colors duration-300 ${
          isDark
            ? 'border-[#1C1C3A] bg-[#050517]'
            : 'border-[#E3DDD2] bg-[#F6F4EF]'
        }`}
      >
        <div
          className={`max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
            isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'
          }`}
        >
          <span>VIBEROUTE — LESS CHAT • MORE TRAVEL</span>
          <span className={isDark ? 'text-[#EFC88B]' : 'text-[#141210]'}>
            DESIGNED &amp; BUILT BY{' '}
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-bold underline underline-offset-4 transition-colors ${
                isDark
                  ? 'text-[#CF5C36] hover:text-[#EFC88B]'
                  : 'text-[#D94E28] hover:text-[#141210]'
              }`}
            >
              SATYA
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}