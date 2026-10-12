// 가계부 카테고리 (구분별)
export const CATEGORIES = {
  expense: [
    { key: 'food', label: '식비', color: 'bg-orange-400' },
    { key: 'transport', label: '교통', color: 'bg-sky-400' },
    { key: 'shopping', label: '쇼핑', color: 'bg-pink-400' },
    { key: 'living', label: '생활', color: 'bg-lime-400' },
    { key: 'culture', label: '문화', color: 'bg-violet-400' },
    { key: 'medical', label: '의료', color: 'bg-red-400' },
    { key: 'etcExpense', label: '기타', color: 'bg-slate-300' },
  ],
  income: [
    { key: 'salary', label: '급여', color: 'bg-emerald-400' },
    { key: 'allowance', label: '용돈', color: 'bg-teal-300' },
    { key: 'sideIncome', label: '부수입', color: 'bg-cyan-300' },
    { key: 'etcIncome', label: '기타', color: 'bg-slate-300' },
  ],
};

export const TYPES = [
  { key: 'expense', label: '지출' },
  { key: 'income', label: '수입' },
];

const ALL = Object.values(CATEGORIES).flat();

export function getCategory(key) {
  return ALL.find((c) => c.key === key) ?? { key, label: '기타', color: 'bg-slate-300' };
}

export function defaultCategory(type) {
  return CATEGORIES[type][0].key;
}
