import { useState } from 'react';
import HistoryList from './HistoryList';
import LedgerPanel from './LedgerPanel';
import MemoryList from './MemoryList';

const TABS = [
  { id: 'ledger', label: '가계부' },
  { id: 'history', label: '기록' },
  { id: 'memory', label: '메모리' },
];

function SidePanel() {
  const [tab, setTab] = useState('ledger');

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex gap-1 rounded-xl bg-white/10 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${
              tab === t.id ? 'bg-white/25 text-white shadow-sm' : 'text-white/70 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'ledger' && <LedgerPanel />}
      {tab === 'history' && <HistoryList />}
      {tab === 'memory' && <MemoryList />}
    </div>
  );
}

export default SidePanel;
