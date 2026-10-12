import { expenseByCategory } from '../service/ledgerService';
import { formatWon } from '../utils/format';

function CategoryTotals({ entries }) {
  const totals = expenseByCategory(entries);
  if (totals.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-white/70">카테고리별 지출</p>
      <ul className="flex flex-col gap-2">
        {totals.map((c) => (
          <li key={c.key} className="flex items-center gap-3 text-xs">
            <span className="w-10 shrink-0 text-white/90">{c.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${c.color}`} style={{ width: `${Math.max(c.ratio * 100, 2)}%` }} />
            </div>
            <span className="w-24 shrink-0 text-right text-white tabular-nums">{formatWon(c.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryTotals;
