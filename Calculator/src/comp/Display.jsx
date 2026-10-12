import { useCalcStore } from '../stores/calcStore';
import { displaySizeClass, formatNumber } from '../utils/format';

function Display() {
  const display = useCalcStore((s) => s.display);
  const expression = useCalcStore((s) => s.expression);
  const error = useCalcStore((s) => s.error);

  const text = error ?? formatNumber(display);
  const sizeClass = error ? 'text-2xl' : displaySizeClass(text);

  return (
    <div className="flex flex-col items-end gap-1 px-2 pt-6 pb-3">
      <p className="h-6 max-w-full truncate text-sm text-white/60 tabular-nums">{expression}</p>
      <p
        className={`flex h-16 max-w-full items-center truncate font-light text-white tabular-nums ${sizeClass}`}
        aria-live="polite"
      >
        {text}
      </p>
    </div>
  );
}

export default Display;
