import { PRIORITIES } from '../utils/priority';

function PriorityBadge({ priority }) {
  const p = PRIORITIES[priority];
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${p.badge}`}>
      {p.label}
    </span>
  );
}

export default PriorityBadge;
