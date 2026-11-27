import {
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Play,
  Film,
  RefreshCw,
} from 'lucide-react';
import type { Theme } from '@/App';
import CategoryBadge from '@/components/CategoryBadge';
import { formatMoney, type Currency, type Stop } from '@/lib/trip';

interface StopCardProps {
  stop: Stop;
  destination: string;
  currency: Currency;
  theme: Theme;
  swapping?: boolean;
  onSwap?: () => void;
}

export default function StopCard({
  stop,
  destination,
  currency,
  theme,
  swapping,
  onSwap,
}: StopCardProps) {
  const isDark = theme === 'dark';
  const query = encodeURIComponent(`${stop.name} ${destination}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const shortsUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${stop.name} ${destination} shorts`)}`;
  const reelsUrl = `https://www.google.com/search?q=${encodeURIComponent(`site:instagram.com/reel ${stop.name} ${destination}`)}`;
  const isLogistics = stop.category === 'Logistics';

  return (
    <div
      className={`tubik-card rounded-2xl border p-5 sm:p-6 ${
        isDark
          ? 'border-[#1C1C3A] hover:border-[#CF5C36] bg-[#0B0B22] hover:shadow-[0_22px_44px_-16px_rgba(207,92,54,0.2)]'
          : 'border-[#E3DDD2] hover:border-[#141210] bg-white hover:shadow-[0_22px_44px_-16px_rgba(20,18,16,0.1)]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span
          className={`font-mono text-xs font-semibold border rounded-full px-3 py-1 ${
            isDark
              ? 'text-[#EFC88B] bg-[#050517] border-[#25254A]'
              : 'text-[#141210] bg-[#F6F4EF] border-[#E3DDD2]'
          }`}
        >
          {stop.time}
        </span>
        <CategoryBadge category={stop.category} theme={theme} />
      </div>

      <h3
        className={`text-lg sm:text-xl font-extrabold tracking-[-0.02em] ${
          isDark ? 'text-white' : 'text-[#141210]'
        }`}
      >
        {stop.name}
      </h3>

      <div
        className={`flex items-center gap-3 font-mono text-xs mt-1.5 ${
          isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
        }`}
      >
        <span
          className={`inline-flex items-center gap-1 font-bold ${
            isDark ? 'text-[#EFC88B]' : 'text-[#141210]'
          }`}
        >
          <Star
            size={13}
            className={
              isDark ? 'fill-[#EFC88B] text-[#EFC88B]' : 'fill-[#D94E28] text-[#D94E28]'
            }
          />
          {stop.rating.toFixed(1)}
        </span>
        <span>•</span>
        <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#141210]'}`}>
          {stop.costPerPerson === 0 ? 'FREE' : `${formatMoney(stop.costPerPerson, currency)} / person`}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div
          className={`flex items-start gap-2.5 ${
            isDark ? 'text-[#F7EFE2]' : 'text-[#141210]'
          }`}
        >
          <ThumbsUp
            size={14}
            className={`mt-1 shrink-0 ${isDark ? 'text-[#EFC88B]' : 'text-[#15803D]'}`}
          />
          <span>{stop.pros}</span>
        </div>
        <div
          className={`flex items-start gap-2.5 ${
            isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
          }`}
        >
          <ThumbsDown
            size={14}
            className={`mt-1 shrink-0 ${isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'}`}
          />
          <span>{stop.cons}</span>
        </div>
      </div>

      <div
        className={`flex flex-wrap items-center justify-between gap-2 mt-5 pt-4 border-t ${
          isDark ? 'border-[#1C1C3A]' : 'border-[#EFECE6]'
        }`}
      >
        <div className="flex flex-wrap gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-full border text-xs font-mono px-3.5 py-1.5 transition-colors ${
              isDark
                ? 'border-[#25254A] bg-[#050517] hover:bg-[#CF5C36] hover:border-[#CF5C36] text-[#D2CDE0] hover:text-[#050517]'
                : 'border-[#E3DDD2] bg-[#FAF9F6] hover:bg-[#141210] hover:border-[#141210] text-[#141210] hover:text-white'
            }`}
          >
            <ExternalLink size={12} /> Maps
          </a>
          <a
            href={shortsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-full border text-xs font-mono px-3.5 py-1.5 transition-colors ${
              isDark
                ? 'border-[#25254A] bg-[#050517] hover:bg-[#CF5C36] hover:border-[#CF5C36] text-[#D2CDE0] hover:text-[#050517]'
                : 'border-[#E3DDD2] bg-[#FAF9F6] hover:bg-[#141210] hover:border-[#141210] text-[#141210] hover:text-white'
            }`}
          >
            <Play size={12} /> Shorts
          </a>
          <a
            href={reelsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-full border text-xs font-mono px-3.5 py-1.5 transition-colors ${
              isDark
                ? 'border-[#25254A] bg-[#050517] hover:bg-[#CF5C36] hover:border-[#CF5C36] text-[#D2CDE0] hover:text-[#050517]'
                : 'border-[#E3DDD2] bg-[#FAF9F6] hover:bg-[#141210] hover:border-[#141210] text-[#141210] hover:text-white'
            }`}
          >
            <Film size={12} /> Reels
          </a>
        </div>

        {!isLogistics && onSwap && (
          <button
            type="button"
            onClick={onSwap}
            disabled={swapping}
            title="Swap this spot for a different recommendation"
            className={`inline-flex items-center gap-1.5 rounded-full border text-xs font-mono font-semibold px-3.5 py-1.5 transition-all cursor-pointer disabled:opacity-50 ${
              isDark
                ? 'border-[#25254A] bg-[#050517] hover:border-[#EFC88B] text-[#EFC88B]'
                : 'border-[#E3DDD2] bg-[#FAF9F6] hover:border-[#D94E28] text-[#D94E28]'
            }`}
          >
            <RefreshCw size={12} className={swapping ? 'animate-spin' : ''} />
            {swapping ? 'Swapping...' : 'Swap'}
          </button>
        )}
      </div>
    </div>
  );
}