import { Utensils, Compass, Coffee, Mountain, Wine, Sparkles, Luggage } from 'lucide-react';
import type { Theme } from '@/App';

const LIGHT_STYLES: Record<string, { bg: string; text: string; icon: typeof Coffee }> = {
  'Aesthetic Cafe': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-900', icon: Coffee },
  'Must-See': { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-900', icon: Compass },
  'Local Street Food': { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-900', icon: Utensils },
  'Nature & Adventure': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-900', icon: Mountain },
  'Rooftop Bar': { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-900', icon: Wine },
  'Hidden Gem': { bg: 'bg-violet-50 border-violet-200', text: 'text-violet-900', icon: Sparkles },
  Logistics: { bg: 'bg-stone-100 border-stone-200', text: 'text-stone-700', icon: Luggage },
};

const ICONS: Record<string, typeof Coffee> = {
  'Aesthetic Cafe': Coffee,
  'Must-See': Compass,
  'Local Street Food': Utensils,
  'Nature & Adventure': Mountain,
  'Rooftop Bar': Wine,
  'Hidden Gem': Sparkles,
  Logistics: Luggage,
};

export default function CategoryBadge({
  category,
  theme = 'light',
}: {
  category: string;
  theme?: Theme;
}) {
  if (theme === 'dark') {
    const Icon = ICONS[category] ?? Compass;
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#25254A] bg-[#050517] px-3 py-1 font-mono text-[11px] font-medium text-[#EFC88B]">
        <Icon size={12} className="text-[#CF5C36]" />
        {category}
      </span>
    );
  }

  const style = LIGHT_STYLES[category] ?? {
    bg: 'bg-[#F6F4EF] border-[#E3DDD2]',
    text: 'text-[#57534E]',
    icon: Compass,
  };
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-medium ${style.bg} ${style.text}`}
    >
      <Icon size={12} />
      {category}
    </span>
  );
}