import { useState } from 'react';
import { useCalcStore } from '../stores/calcStore';
import { amountFromCalculator, MAX_MEMO_LENGTH, parseAmount, today, validateEntry } from '../service/ledgerService';
import { CATEGORIES, defaultCategory, TYPES } from '../utils/category';

const fieldClass =
  'min-w-0 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50 [color-scheme:dark]';

const smallBtn = 'rounded-lg px-3 py-2 text-xs font-medium transition';

// 등록 / 수정 공용 폼
function LedgerForm({ initial, submitLabel = '등록', onSubmit, onCancel }) {
  const [type, setType] = useState(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [category, setCategory] = useState(initial?.category ?? defaultCategory('expense'));
  const [date, setDate] = useState(() => initial?.date ?? today());
  const [memo, setMemo] = useState(initial?.memo ?? '');

  const display = useCalcStore((s) => s.display);
  const error = useCalcStore((s) => s.error);
  const calcAmount = amountFromCalculator(display, error);

  const valid = validateEntry({ amount, category, date });

  const changeType = (next) => {
    setType(next);
    setCategory(defaultCategory(next));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onSubmit({ type, amount, category, date, memo });
    if (!initial) {
      setAmount(0);
      setMemo('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex shrink-0 rounded-lg bg-white/10 p-0.5">
          {TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => changeType(t.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                type === t.key
                  ? t.key === 'expense'
                    ? 'bg-pink-400/80 text-white'
                    : 'bg-emerald-400/80 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          inputMode="numeric"
          value={amount ? amount.toLocaleString('ko-KR') : ''}
          onChange={(e) => setAmount(parseAmount(e.target.value))}
          placeholder="금액"
          className={`${fieldClass} flex-1 text-right tabular-nums`}
        />
        <button
          type="button"
          onClick={() => setAmount(calcAmount)}
          disabled={calcAmount === null}
          title="계산기 결과값을 금액으로 가져오기"
          className={`${smallBtn} shrink-0 bg-white/15 text-white hover:bg-white/25 disabled:cursor-not-allowed disabled:text-white/30 disabled:hover:bg-white/15`}
        >
          계산기 값
        </button>
      </div>

      <div className="flex gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${fieldClass} flex-1`}>
          {CATEGORIES[type].map((c) => (
            <option key={c.key} value={c.key} className="text-gray-900">
              {c.label}
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${fieldClass} flex-1`} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={memo}
          maxLength={MAX_MEMO_LENGTH}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모 (선택)"
          className={`${fieldClass} flex-1`}
        />
        <button
          type="submit"
          disabled={!valid}
          className={`${smallBtn} shrink-0 bg-pink-400/80 text-white hover:bg-pink-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30`}
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={`${smallBtn} shrink-0 text-white/80 hover:bg-white/15`}>
            닫기
          </button>
        )}
      </div>
    </form>
  );
}

export default LedgerForm;
