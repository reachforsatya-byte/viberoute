import { X, Gem, ArrowRight } from 'lucide-react';
import type { Theme } from '@/App';

interface ProModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  pricing: { tripPass: string; seasonPass: string };
  onUnlock: () => void;
  theme: Theme;
}

export default function ProModal({
  open,
  onClose,
  title,
  pricing,
  onUnlock,
  theme,
}: ProModalProps) {
  if (!open) return null;
  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4 ${
        isDark ? 'bg-[#050517]/80' : 'bg-[#141210]/45'
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-3xl border p-7 sm:p-9 relative animate-tubik-in ${
          isDark
            ? 'border-[#25254A] bg-[#0B0B22] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)]'
            : 'border-[#E3DDD2] bg-white shadow-[0_30px_70px_-15px_rgba(20,18,16,0.22)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-5 right-5 p-2 rounded-full transition-colors cursor-pointer ${
            isDark
              ? 'text-[#B5B0C7] hover:text-white hover:bg-[#141432]'
              : 'text-[#78716C] hover:text-[#141210] hover:bg-[#F6F4EF]'
          }`}
        >
          <X size={18} />
        </button>

        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center mb-5 ${
            isDark ? 'bg-[#CF5C36] text-[#050517]' : 'bg-[#D94E28] text-white'
          }`}
        >
          <Gem size={19} />
        </div>

        <h3
          className={`text-2xl font-extrabold tracking-[-0.03em] mb-2 ${
            isDark ? 'text-white' : 'text-[#141210]'
          }`}
        >
          Unlock {title}
        </h3>
        <p
          className={`text-sm leading-relaxed mb-6 ${
            isDark ? 'text-[#B5B0C7]' : 'text-[#57534E]'
          }`}
        >
          Pay once, split it across the group, and unlock the curated route — zero subscriptions.
        </p>

        <button
          type="button"
          onClick={onUnlock}
          className={`w-full text-left rounded-2xl border p-4 mb-3 transition-colors group cursor-pointer ${
            isDark
              ? 'border-[#CF5C36] bg-[#CF5C36] hover:bg-[#EFC88B] hover:border-[#EFC88B] text-[#050517]'
              : 'border-[#141210] bg-[#141210] hover:bg-[#D94E28] hover:border-[#D94E28] text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="font-bold">{pricing.tripPass}</p>
            <ArrowRight size={16} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="font-mono opacity-80 text-xs mt-1">One-time payment • forever access</p>
        </button>

        <button
          type="button"
          onClick={onUnlock}
          className={`w-full text-left rounded-2xl border p-4 transition-colors group cursor-pointer ${
            isDark
              ? 'border-[#25254A] bg-[#050517] hover:border-[#EFC88B]'
              : 'border-[#E3DDD2] bg-[#FAF9F6] hover:border-[#141210]'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className={`font-bold ${isDark ? 'text-white' : 'text-[#141210]'}`}>
              {pricing.seasonPass}
            </p>
            <ArrowRight
              size={16}
              className={
                isDark
                  ? 'text-[#B5B0C7] group-hover:text-[#EFC88B] shrink-0'
                  : 'text-[#57534E] group-hover:text-[#141210] shrink-0'
              }
            />
          </div>
          <p
            className={`font-mono text-xs mt-1 ${
              isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'
            }`}
          >
            Unlimited trips for 90 days
          </p>
        </button>

        <p
          className={`text-center font-mono text-[11px] mt-5 ${
            isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'
          }`}
        >
          Preview mode — click any pass above to test unlock.
        </p>
      </div>
    </div>
  );
}