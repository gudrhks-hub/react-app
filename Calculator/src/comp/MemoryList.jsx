import { useCalcStore } from '../stores/calcStore';
import { toDisplayString } from '../service/calculator';
import { formatNumber } from '../utils/format';

function MemoryList() {
  const memory = useCalcStore((s) => s.memory);
  const memoryRecall = useCalcStore((s) => s.memoryRecall);
  const memoryClear = useCalcStore((s) => s.memoryClear);

  if (memory.length === 0) {
    return <p className="py-10 text-center text-sm text-white/60">메모리에 저장된 값이 없습니다</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {memory.map((value, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => memoryRecall(index)}
              className="w-full truncate rounded-xl px-3 py-2 text-right text-xl font-light text-white tabular-nums transition hover:bg-white/15"
            >
              {formatNumber(toDisplayString(value))}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={memoryClear}
        className="mt-3 self-end rounded-lg px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/15"
      >
        메모리 전체 삭제
      </button>
    </div>
  );
}

export default MemoryList;
