import { getCategory } from '../utils/category';

const pad = (n) => String(n).padStart(2, '0');
export const MAX_AMOUNT_DIGITS = 12;
export const MAX_MEMO_LENGTH = 50;

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// 'YYYY-MM'
export function currentMonth() {
  return today().slice(0, 7);
}

export function shiftMonth(month, delta) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function monthLabel(month) {
  const [y, m] = month.split('-').map(Number);
  return `${y}년 ${m}월`;
}

// 입력값 → 금액 숫자 (숫자 외 문자 제거, 자릿수 제한)
export function parseAmount(text) {
  const digits = text.replace(/\D/g, '').replace(/^0+/, '').slice(0, MAX_AMOUNT_DIGITS);
  return digits === '' ? 0 : Number(digits);
}

// 계산기 결과값 → 금액 (0 이하, 오류면 null)
export function amountFromCalculator(display, error) {
  if (error) return null;
  const value = Math.round(Number(display));
  if (!Number.isFinite(value) || value <= 0 || String(value).length > MAX_AMOUNT_DIGITS) return null;
  return value;
}

export function validateEntry({ amount, category, date }) {
  return Number.isInteger(amount) && amount > 0 && Boolean(category) && Boolean(date);
}

export function createEntry({ type, amount, category, date, memo }) {
  return {
    id: crypto.randomUUID(),
    type,
    amount,
    category,
    date,
    memo: memo.trim().slice(0, MAX_MEMO_LENGTH),
    createdAt: Date.now(),
  };
}

export function filterByMonth(entries, month) {
  return entries.filter((e) => e.date.startsWith(month));
}

// 날짜 최신순 → 등록 최신순
export function sortEntries(entries) {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}

// 수입 / 지출 / 잔액
export function summarize(entries) {
  let income = 0;
  let expense = 0;
  for (const e of entries) {
    if (e.type === 'income') income += e.amount;
    else expense += e.amount;
  }
  return { income, expense, balance: income - expense };
}

// 카테고리별 지출 합계 (금액 큰 순서, 비율 포함)
export function expenseByCategory(entries) {
  const totals = {};
  for (const e of entries) {
    if (e.type === 'expense') totals[e.category] = (totals[e.category] ?? 0) + e.amount;
  }
  const sum = Object.values(totals).reduce((a, b) => a + b, 0);
  return Object.entries(totals)
    .map(([key, amount]) => ({ ...getCategory(key), amount, ratio: sum ? amount / sum : 0 }))
    .sort((a, b) => b.amount - a.amount);
}
