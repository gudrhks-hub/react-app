import { useState } from 'react';
import { useLedgerStore } from '../stores/ledgerStore';
import { currentMonth, filterByMonth } from '../service/ledgerService';
import CategoryTotals from './CategoryTotals';
import LedgerForm from './LedgerForm';
import LedgerList from './LedgerList';
import LedgerSummary from './LedgerSummary';
import MonthSelector from './MonthSelector';

function LedgerPanel() {
  const entries = useLedgerStore((s) => s.entries);
  const addEntry = useLedgerStore((s) => s.addEntry);
  const [month, setMonth] = useState(currentMonth);

  const monthEntries = filterByMonth(entries, month);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
      <LedgerSummary title="전체 잔액" entries={entries} emphasis />
      <MonthSelector month={month} onChange={setMonth} />
      <LedgerSummary title={`${Number(month.slice(5))}월 잔액`} entries={monthEntries} />
      <LedgerForm onSubmit={addEntry} />
      <LedgerList entries={monthEntries} />
      <CategoryTotals entries={monthEntries} />
    </div>
  );
}

export default LedgerPanel;
