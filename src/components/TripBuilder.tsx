import { ArrowRight, Calendar, Loader2, MapPin, Sparkles, Users } from 'lucide-react';
import type { Theme } from '../App';
import { deriveTierFromBudget, type BuilderState } from '../lib/trip';

interface TripBuilderProps {
  value: BuilderState;
  onChange: (next: BuilderState) => void;
  onGenerate: () => void;
  loading: boolean;
  error: string | null;
  theme: Theme;
}

const VIBE_OPTIONS = [
  'Aesthetic Cafes',
  'Local Street Food',
  'Bars & Nightlife',
  'Nature & Adventure',
  'Hidden Gems',
];

const TIER_LABELS: Record<string, string> = {
  budget: 'Backpacker / Shoestring',
  shoestring: 'Backpacker / Shoestring',
  chill: 'Chill & Local',
  balanced: 'Balanced Local',
  comfort: 'Boutique & Comfort',
  party: 'Nightlife & High-Energy',
  luxury: 'Luxe & Curated',
};
export default function TripBuilder({
  value,
  onChange,
  onGenerate,
  loading,
  error,
  theme,
}: TripBuilderProps) {
  const isDark = theme === 'dark';

  const toggleVibe = (vibe: string) => {
    const exists = value.vibes.includes(vibe);
    onChange({
      ...value,
      vibes: exists ? value.vibes.filter((v) => v !== vibe) : [...value.vibes, vibe],
    });
  };

  const activeDays = value.days > 0 ? value.days : 1;
  const derivedTier =
    value.budgetPerPerson > 0
      ? deriveTierFromBudget(value.budgetPerPerson, activeDays)
      : value.budgetTier;

  const totalGroupBudget =
    value.budgetPerPerson > 0 && value.groupSize > 0
      ? value.budgetPerPerson * value.groupSize
      : 0;

  const currencySymbol = value.currency === 'INR' ? '₹' : '$';

  const cardSurface = isDark
    ? 'bg-[#0B0B22] border-[#1C1C3A] shadow-[0_28px_60px_-20px_rgba(0,0,0,0.65)]'
    : 'bg-white border-[#E3DDD2] shadow-[0_28px_60px_-20px_rgba(20,18,16,0.08)]';

  const inputSurface = isDark
    ? 'bg-[#050517] border-[#25254A] text-white placeholder:text-[#686382] focus:border-[#CF5C36]'
    : 'bg-[#F6F4EF]/70 border-[#E3DDD2] text-[#141210] placeholder:text-[#A8A29E] focus:border-[#141210]';

  const labelClass = `flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] font-semibold mb-2.5 ${
    isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
  }`;

  return (
    <div className={`rounded-3xl border p-6 sm:p-9 transition-colors duration-300 ${cardSurface}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-6">
          <label htmlFor="destination" className={labelClass}>
            <MapPin size={13} className={isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'} />
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={value.destination}
            onChange={(e) => onChange({ ...value, destination: e.target.value })}
            placeholder="Coimbatore, North Goa, Fort Kochi, Ooty..."
            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-colors ${inputSurface}`}
          />
        </div>

        <div className="md:col-span-3">
          <label htmlFor="days" className={labelClass}>
            <Calendar size={13} className={isDark ? 'text-[#EFC88B]' : 'text-[#D94E28]'} />
            Duration (Days)
          </label>
          <div className="relative">
            <input
              id="days"
              type="number"
              inputMode="numeric"
              min={1}
              max={30}
              value={value.days || ''}
              placeholder="3"
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') {
                  onChange({ ...value, days: 0 });
                  return;
                }
                const parsed = parseInt(raw, 10);
                if (!Number.isNaN(parsed)) {
                  onChange({ ...value, days: Math.min(30, Math.max(0, parsed)) });
                }
              }}
              onBlur={() => {
                if (!value.days || value.days < 1) {
                  onChange({ ...value, days: 1 });
                }
              }}
              className={`w-full rounded-xl border px-4 py-3 pr-14 font-mono text-sm font-semibold outline-none transition-colors ${inputSurface}`}
            />
            <span
              className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase ${
                isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'
              }`}
            >
              {value.days === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>

        <div className="md:col-span-3">
          <label htmlFor="groupSize" className={labelClass}>
            <Users size={13} className={isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'} />
            Group Size
          </label>
          <div className="relative">
            <input
              id="groupSize"
              type="number"
              inputMode="numeric"
              min={1}
              max={50}
              value={value.groupSize || ''}
              placeholder="4"
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') {
                  onChange({ ...value, groupSize: 0 });
                  return;
                }
                const parsed = parseInt(raw, 10);
                if (!Number.isNaN(parsed)) {
                  onChange({ ...value, groupSize: Math.min(50, Math.max(0, parsed)) });
                }
              }}
              onBlur={() => {
                if (!value.groupSize || value.groupSize < 1) {
                  onChange({ ...value, groupSize: 1 });
                }
              }}
              className={`w-full rounded-xl border px-4 py-3 pr-14 font-mono text-sm font-semibold outline-none transition-colors ${inputSurface}`}
            />
            <span
              className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase ${
                isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'
              }`}
            >
              pax
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <label htmlFor="budgetPerPerson" className={`${labelClass} !mb-0`}>
            <span className={isDark ? 'text-[#EFC88B]' : 'text-[#D94E28]'}>{currencySymbol}</span>
            Budget Per Person
          </label>

          <div
            role="group"
            aria-label="Currency selector"
            className={`inline-flex items-center rounded-full p-0.5 border ${
              isDark ? 'bg-[#050517] border-[#25254A]' : 'bg-[#F6F4EF] border-[#E3DDD2]'
            }`}
          >
            {(['INR', 'USD'] as const).map((curr) => {
              const selected = value.currency === curr;
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => onChange({ ...value, currency: curr })}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                    selected
                      ? isDark
                        ? 'bg-[#CF5C36] text-[#050517]'
                        : 'bg-[#141210] text-[#F6F4EF]'
                      : isDark
                      ? 'text-[#8E89A6] hover:text-white'
                      : 'text-[#78716C] hover:text-[#141210]'
                  }`}
                >
                  {curr === 'INR' ? '₹ INR' : '$ USD'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <span
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-base font-bold ${
              isDark ? 'text-[#EFC88B]' : 'text-[#D94E28]'
            }`}
          >
            {currencySymbol}
          </span>
          <input
            id="budgetPerPerson"
            type="number"
            inputMode="numeric"
            min={0}
            value={value.budgetPerPerson || ''}
            placeholder={value.currency === 'INR' ? '5000' : '250'}
            onChange={(e) => {
              const raw = e.target.value;
              const parsed = raw === '' ? 0 : Math.max(0, parseInt(raw, 10) || 0);
              onChange({
                ...value,
                budgetPerPerson: parsed,
                budgetTier:
                  parsed > 0 ? deriveTierFromBudget(parsed, activeDays) : value.budgetTier,
              });
            }}
            className={`w-full rounded-xl border pl-10 pr-4 py-3.5 font-mono text-base font-bold outline-none transition-colors ${inputSurface}`}
          />
        </div>

        {value.budgetPerPerson > 0 && (
          <div
            className={`mt-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-xs ${
              isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
            }`}
          >
            <span>
              Style:{' '}
              <strong className={isDark ? 'text-[#EFC88B]' : 'text-[#141210]'}>
                {TIER_LABELS[derivedTier]}
              </strong>
            </span>
            {totalGroupBudget > 0 && (
              <span>
                Total Group Pool:{' '}
                <strong className={isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'}>
                  {currencySymbol}
                  {totalGroupBudget.toLocaleString()}
                </strong>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <span className={labelClass}>
          <Sparkles size={13} className={isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'} />
          Trip Vibes (Optional)
        </span>
        <div className="flex flex-wrap gap-2">
          {VIBE_OPTIONS.map((vibe) => {
            const active = value.vibes.includes(vibe);
            return (
              <button
                key={vibe}
                type="button"
                onClick={() => toggleVibe(vibe)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer border ${
                  active
                    ? isDark
                      ? 'bg-[#CF5C36] border-[#CF5C36] text-[#050517]'
                      : 'bg-[#141210] border-[#141210] text-[#F6F4EF]'
                    : isDark
                    ? 'bg-[#050517] border-[#25254A] text-[#B5B0C7] hover:border-[#EFC88B]'
                    : 'bg-[#F6F4EF] border-[#E3DDD2] text-[#57534E] hover:border-[#141210] hover:text-[#141210]'
                }`}
              >
                {vibe}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className={`mt-5 rounded-xl border px-4 py-3 font-mono text-xs ${
            isDark
              ? 'bg-[#CF5C36]/15 border-[#CF5C36]/40 text-[#F7EFE2]'
              : 'bg-[#D94E28]/10 border-[#D94E28]/30 text-[#141210]'
          }`}
        >
          {error}
        </div>
      )}

      <div className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className={`font-mono text-[11px] ${isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'}`}>
          Up to 30 days • Instant budget split &amp; shareable URL
        </p>
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold tracking-tight transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
            isDark
              ? 'bg-[#CF5C36] text-[#050517] hover:bg-[#EFC88B]'
              : 'bg-[#141210] text-[#F6F4EF] hover:bg-[#D94E28] hover:text-white'
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Building Route...
            </>
          ) : (
            <>
              Generate Itinerary
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}