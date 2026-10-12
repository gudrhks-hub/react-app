import { summarize } from '../service/ledgerService';
import { formatWon } from '../utils/format';

// 수입 / 지출 / 잔액 한 줄
function LedgerSummary({ title, entries, emphasis = false }) {
  const { income, expense, balance } = summarize(entries);

  return (
    <div className={`rounded-2xl px-4 py-3 ${emphasis ? 'bg-white/20' : 'bg-white/10'}`}>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium text-white/70">{title}</p>
        <p className={`font-semibold text-white tabular-nums ${emphasis ? 'text-xl' : 'text-base'}`}>
          {formatWon(balance)}
        </p>
      </div>
      <div className="mt-1 flex justify-end gap-3 text-xs tabular-nums">
        <span className="text-emerald-200">수입 {formatWon(income, 'income')}</span>
        <span className="text-pink-100">지출 {formatWon(expense, 'expense')}</span>
      </div>
    </div>
  );
}

export default LedgerSummary;
