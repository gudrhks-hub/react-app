import { useCalcStore } from '../stores/calcStore';

function MemoryBar() {
  const hasMemory = useCalcStore((s) => s.memory.length > 0);
  const memoryClear = useCalcStore((s) => s.memoryClear);
  const memoryRecall = useCalcStore((s) => s.memoryRecall);
  const memoryAdd = useCalcStore((s) => s.memoryAdd);
  const memorySubtract = useCalcStore((s) => s.memorySubtract);
  const memoryStore = useCalcStore((s) => s.memoryStore);

  const buttons = [
    { label: 'MC', onClick: memoryClear, disabled: !hasMemory },
    { label: 'MR', onClick: () => memoryRecall(0), disabled: !hasMemory },
    { label: 'M+', onClick: memoryAdd },
    { label: 'M-', onClick: memorySubtract },
    { label: 'MS', onClick: memoryStore },
  ];

  return (
    <div className="mb-2 flex justify-between px-1">
      {buttons.map((b) => (
        <button
          key={b.label}
          type="button"
          onClick={b.onClick}
          disabled={b.disabled}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:text-white/30 disabled:hover:bg-transparent"
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

export default MemoryBar;
