import { useState } from 'react';
import { Lock, Copy, Check, Clock, ArrowLeft, Link2 } from 'lucide-react';
import type { Theme } from '@/App';
import StopCard from '@/components/StopCard';
import BudgetSplitCard from '@/components/BudgetSplitCard';
import ProModal from '@/components/ProModal';
import {
  PRICING,
  buildWhatsAppSummary,
  encodeShareUrl,
  formatMoney,
  type Budget,
  type BuilderState,
  type DayPlan,
} from '@/lib/trip';

interface ItineraryViewProps {
  state: BuilderState;
  budget: Budget;
  itinerary: DayPlan[];
  onBuilderClick: () => void;
  onSwapStop: (dayIndex: number, stopIndex: number) => Promise<void>;
  theme: Theme;
}

const TABS = [
  { label: 'Classic Must-See', suffix: 'FREE', locked: false },
  { label: 'Hidden Gems & Chill', suffix: 'PRO', locked: true },
  { label: 'Party & Nightlife Heavy', suffix: 'PRO', locked: true },
];

export default function ItineraryView({
  state,
  budget,
  itinerary,
  onBuilderClick,
  onSwapStop,
  theme,
}: ItineraryViewProps) {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState(0);
  const [proModal, setProModal] = useState<number | null>(null);
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'link' | null>(null);
  const [swappingKey, setSwappingKey] = useState<string | null>(null);

  const handleTab = (index: number) => {
    if (TABS[index].locked) {
      setProModal(index);
    } else {
      setActiveTab(index);
    }
  };

  const handleCopyWhatsApp = async () => {
    try {
      const shareUrl = encodeShareUrl(state, itinerary);
      await navigator.clipboard.writeText(
        buildWhatsAppSummary(state, budget, state.currency, shareUrl)
      );
      setCopiedType('whatsapp');
      setTimeout(() => setCopiedType(null), 2200);
    } catch {
      setCopiedType(null);
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = encodeShareUrl(state, itinerary);
      window.history.replaceState(null, '', shareUrl);
      await navigator.clipboard.writeText(shareUrl);
      setCopiedType('link');
      setTimeout(() => setCopiedType(null), 2200);
    } catch {
      setCopiedType(null);
    }
  };

  const triggerSwap = async (dayIdx: number, stopIdx: number) => {
    const key = `${dayIdx}-${stopIdx}`;
    setSwappingKey(key);
    try {
      await onSwapStop(dayIdx, stopIdx);
    } finally {
      setSwappingKey(null);
    }
  };

  return (
    <section>
      <div
        className={`flex flex-wrap items-end justify-between gap-4 border-b pb-6 mb-7 ${
          isDark ? 'border-[#1C1C3A]' : 'border-[#E3DDD2]'
        }`}
      >
        <div>
          <span
            className={`inline-block font-mono text-[10px] uppercase tracking-[0.16em] font-semibold mb-1.5 ${
              isDark ? 'text-[#EFC88B]' : 'text-[#D94E28]'
            }`}
          >
            ITINERARY DOSSIER
          </span>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] ${
              isDark ? 'text-white' : 'text-[#141210]'
            }`}
          >
            {state.destination}
          </h2>
          <p
            className={`font-mono text-xs mt-1.5 ${
              isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
            }`}
          >
            {state.days} {state.days === 1 ? 'day' : 'days'} • {state.groupSize} friends •{' '}
            {state.budgetTier} • {formatMoney(budget.perPersonTotal, state.currency)}/person
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold border transition-all cursor-pointer ${
              copiedType === 'link'
                ? isDark
                  ? 'bg-[#CF5C36] border-[#CF5C36] text-[#050517]'
                  : 'bg-[#D94E28] border-[#D94E28] text-white'
                : isDark
                  ? 'bg-[#0B0B22] text-white border-[#25254A] hover:border-[#CF5C36]'
                  : 'bg-white text-[#141210] border-[#DCD6CA] hover:border-[#D94E28]'
            }`}
          >
            {copiedType === 'link' ? <Check size={14} /> : <Link2 size={14} />}
            {copiedType === 'link' ? 'Link Copied!' : 'Share Link'}
          </button>

          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold border transition-all cursor-pointer ${
              copiedType === 'whatsapp'
                ? isDark
                  ? 'bg-[#EFC88B] border-[#EFC88B] text-[#050517]'
                  : 'bg-[#141210] border-[#141210] text-white'
                : isDark
                  ? 'bg-[#0B0B22] text-[#EFC88B] border-[#25254A] hover:border-[#EFC88B]'
                  : 'bg-white text-[#141210] border-[#DCD6CA] hover:border-[#141210]'
            }`}
          >
            {copiedType === 'whatsapp' ? (
              <Check size={14} className={isDark ? 'text-[#050517]' : 'text-[#D94E28]'} />
            ) : (
              <Copy size={14} />
            )}
            {copiedType === 'whatsapp' ? 'Copied for WhatsApp' : 'Copy for WhatsApp'}
          </button>

          <button
            type="button"
            onClick={onBuilderClick}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold border transition-colors cursor-pointer ${
              isDark
                ? 'border-[#1C1C3A] bg-[#0B0B22] text-[#B5B0C7] hover:border-[#CF5C36] hover:text-white'
                : 'border-[#E3DDD2] bg-[#FAF9F6] text-[#57534E] hover:border-[#141210] hover:text-[#141210]'
            }`}
          >
            <ArrowLeft size={14} />
            Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab, i) => {
          const active = activeTab === i && !tab.locked;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => handleTab(i)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold border transition-all cursor-pointer ${
                active
                  ? isDark
                    ? 'bg-[#CF5C36] border-[#CF5C36] text-[#050517]'
                    : 'bg-[#141210] border-[#141210] text-white'
                  : tab.locked
                    ? isDark
                      ? 'border-[#1C1C3A] bg-[#0B0B22] text-[#B5B0C7] hover:border-[#EFC88B] hover:text-white'
                      : 'border-[#E3DDD2] bg-white text-[#57534E] hover:border-[#D94E28] hover:text-[#141210]'
                    : isDark
                      ? 'border-[#25254A] bg-[#0B0B22] text-white'
                      : 'border-[#DCD6CA] bg-white text-[#141210]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.locked ? (
                <span
                  className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full ${
                    isDark
                      ? 'bg-[#050517] text-[#EFC88B]'
                      : 'bg-[#F6F4EF] text-[#D94E28]'
                  }`}
                >
                  <Lock size={10} /> {tab.suffix}
                </span>
              ) : (
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-[#050517]/20' : 'bg-white/15'
                  }`}
                >
                  {tab.suffix}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === 0 && (
        <div>
          <BudgetSplitCard
            budget={budget}
            currency={state.currency}
            groupSize={state.groupSize}
            theme={theme}
          />

          <div className="relative">
            {itinerary.map((day, dayIdx) => (
              <div key={day.day} className="mb-12 last:mb-0">
                <div className="flex items-center gap-4 mb-6">
                  <span
                    className={`rounded-full font-mono text-xs font-bold px-4 py-1.5 uppercase tracking-wider ${
                      isDark
                        ? 'bg-[#EFC88B] text-[#050517]'
                        : 'bg-[#141210] text-white'
                    }`}
                  >
                    {day.title}
                  </span>
                  <span
                    className={`h-px flex-1 ${
                      isDark ? 'bg-[#1C1C3A]' : 'bg-[#E3DDD2]'
                    }`}
                  />
                </div>

                <div
                  className={`relative pl-5 sm:pl-7 border-l ml-3 space-y-5 ${
                    isDark ? 'border-[#25254A]' : 'border-[#D6CFC2]'
                  }`}
                >
                  {day.stops.map((stop, stopIdx) => (
                    <div key={`${dayIdx}-${stopIdx}-${stop.name}`} className="relative">
                      <span
                        className={`absolute -left-[25px] sm:-left-[33px] top-7 w-2.5 h-2.5 rounded-full ring-4 ${
                          isDark
                            ? 'bg-[#CF5C36] ring-[#050517]'
                            : 'bg-[#D94E28] ring-[#F6F4EF]'
                        }`}
                      />
                      <StopCard
                        stop={stop}
                        destination={state.destination}
                        currency={state.currency}
                        theme={theme}
                        swapping={swappingKey === `${dayIdx}-${stopIdx}`}
                        onSwap={() => triggerSwap(dayIdx, stopIdx)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`flex items-center justify-center gap-2 font-mono text-xs mt-12 ${
              isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'
            }`}
          >
            <Clock size={14} className={isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'} />
            <span>Mornings shift to 11:30 AM automatically when nightlife is selected.</span>
          </div>
        </div>
      )}

      <ProModal
        open={proModal !== null}
        onClose={() => setProModal(null)}
        title={proModal !== null ? TABS[proModal].label : ''}
        pricing={PRICING[state.currency]}
        theme={theme}
        onUnlock={() => {
          if (proModal !== null) {
            setActiveTab(0);
          }
          setProModal(null);
        }}
      />
    </section>
  );
}