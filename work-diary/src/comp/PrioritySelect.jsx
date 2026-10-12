import { PRIORITIES, PRIORITY_KEYS } from '../utils/priority';

function PrioritySelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
    >
      {PRIORITY_KEYS.map((key) => (
        <option key={key} value={key}>
          {PRIORITIES[key].label}
        </option>
      ))}
    </select>
  );
}

export default PrioritySelect;
