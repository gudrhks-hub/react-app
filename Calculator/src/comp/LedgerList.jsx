import { sortEntries } from '../service/ledgerService';
import LedgerItem from './LedgerItem';

function LedgerList({ entries }) {
  if (entries.length === 0) {
    return <p className="py-8 text-center text-sm text-white/60">이번 달 내역이 없습니다</p>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {sortEntries(entries).map((entry) => (
        <LedgerItem key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

export default LedgerList;
