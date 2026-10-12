import { monthLabel, shiftMonth } from '../service/ledgerService';

const arrow = 'rounded-lg px-3 py-1 text-sm text-white/80 transition hover:bg-white/15';

function MonthSelector({ month, onChange }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button type="button" onClick={() => onChange(shiftMonth(month, -1))} className={arrow} aria-label="이전 달">
        ◀
      </button>
      <p className="min-w-28 text-center text-sm font-semibold text-white">{monthLabel(month)}</p>
      <button type="button" onClick={() => onChange(shiftMonth(month, 1))} className={arrow} aria-label="다음 달">
        ▶
      </button>
    </div>
  );
}

export default MonthSelector;
