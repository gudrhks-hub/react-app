import { useCalcStore } from '../stores/calcStore';
import { formatNumber } from '../utils/format';

function HistoryList() {
  const history = useCalcStore((s) => s.history);
  const recallHistory = useCalcStore((s) => s.recallHistory);
  const clearHistory = useCalcStore((s) => s.clearHistory);

  if (history.length === 0) {
    return <p className="py-10 text-center text-sm text-white/60">아직 기록이 없습니다</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {history.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => recallHistory(item.id)}
              className="w-full rounded-xl px-3 py-2 text-right transition hover:bg-white/15"
            >
              <p className="truncate text-xs text-white/60 tabular-nums">{item.expression}</p>
              <p className="truncate text-xl font-light text-white tabular-nums">{formatNumber(item.result)}</p>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={clearHistory}
        className="mt-3 self-end rounded-lg px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/15"
      >
        기록 전체 삭제
      </button>
    </div>
  );
}

export default HistoryList;
