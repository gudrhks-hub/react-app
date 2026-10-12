import { useState } from 'react';
import { useLedgerStore } from '../stores/ledgerStore';
import { getCategory } from '../utils/category';
import { formatWon } from '../utils/format';
import LedgerForm from './LedgerForm';

const btn = 'rounded-md px-2 py-1 text-xs font-medium transition';

function LedgerItem({ entry }) {
  const updateEntry = useLedgerStore((s) => s.updateEntry);
  const deleteEntry = useLedgerStore((s) => s.deleteEntry);
  const [editing, setEditing] = useState(false);
  const category = getCategory(entry.category);

  const save = (data) => {
    updateEntry(entry.id, data);
    setEditing(false);
  };

  const remove = () => {
    if (window.confirm('삭제하시겠습니까?')) deleteEntry(entry.id);
  };

  if (editing) {
    return (
      <li className="rounded-xl bg-white/15 p-3">
        <LedgerForm initial={entry} submitLabel="저장" onSubmit={save} onCancel={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/10">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${category.color}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="tabular-nums">{entry.date.slice(5)}</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-white/90">{category.label}</span>
        </div>
        {entry.memo && <p className="mt-0.5 truncate text-sm text-white">{entry.memo}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <p
          className={`text-sm font-semibold tabular-nums ${
            entry.type === 'income' ? 'text-emerald-200' : 'text-pink-100'
          }`}
        >
          {formatWon(entry.amount, entry.type)}
        </p>
        <div className="flex gap-0.5">
          <button type="button" onClick={() => setEditing(true)} className={`${btn} text-white/70 hover:bg-white/15`}>
            수정
          </button>
          <button type="button" onClick={remove} className={`${btn} text-pink-100 hover:bg-white/15`}>
            삭제
          </button>
        </div>
      </div>
    </li>
  );
}

export default LedgerItem;
