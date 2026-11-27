import type { Theme } from '@/App';
import { formatMoney, type Budget, type Currency } from '@/lib/trip';

interface BudgetSplitCardProps {
  budget: Budget;
  currency: Currency;
  groupSize: number;
  theme: Theme;
}

export default function BudgetSplitCard({
  budget,
  currency,
  groupSize,
  theme,
}: BudgetSplitCardProps) {
  const isDark = theme === 'dark';
  const items = [
    { label: 'Stay', amount: budget.perPerson.stay },
    { label: 'Food', amount: budget.perPerson.food },
    { label: 'Transport', amount: budget.perPerson.transport },
    { label: 'Activities', amount: budget.perPerson.activities },
  ];

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 mb-10 transition-colors duration-300 ${
        isDark
          ? 'border-[#25254A] bg-[#0B0B22] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)]'
          : 'border-[#E3DDD2] bg-white shadow-[0_20px_50px_-20px_rgba(20,18,16,0.07)]'
      }`}
    >
      <div
        className={`flex flex-wrap items-baseline justify-between gap-3 pb-5 mb-5 border-b ${
          isDark ? 'border-[#1C1C3A]' : 'border-[#EFECE6]'
        }`}
      >
        <div>
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
              isDark ? 'text-[#B5B0C7]' : 'text-[#78716C]'
            }`}
          >
            Calibrated Budget / Person
          </span>
          <div
            className={`text-3xl sm:text-5xl font-extrabold font-mono tracking-tight mt-1 ${
              isDark ? 'text-[#EFC88B]' : 'text-[#141210]'
            }`}
          >
            {formatMoney(budget.perPersonTotal, currency)}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span
            className={`font-mono text-xs ${
              isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'
            }`}
          >
            Squad Total ({groupSize} {groupSize === 1 ? 'person' : 'friends'})
          </span>
          <div
            className={`text-xl font-bold font-mono ${
              isDark ? 'text-[#CF5C36]' : 'text-[#D94E28]'
            }`}
          >
            {formatMoney(budget.groupTotal, currency)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border p-3.5 ${
              isDark
                ? 'bg-[#050517] border-[#1C1C3A]'
                : 'bg-[#FAF9F6] border-[#EBE6DC]'
            }`}
          >
            <div
              className={`font-mono text-[10px] uppercase tracking-wider ${
                isDark ? 'text-[#8E89A6]' : 'text-[#78716C]'
              }`}
            >
              {item.label}
            </div>
            <div
              className={`font-mono text-base font-bold mt-1 ${
                isDark ? 'text-[#F7EFE2]' : 'text-[#141210]'
              }`}
            >
              {formatMoney(item.amount, currency)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}