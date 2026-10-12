import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createEntry, MAX_MEMO_LENGTH } from '../service/ledgerService';

export const useLedgerStore = create(
  persist(
    (set) => ({
      entries: [],
      addEntry: (data) => set((s) => ({ entries: [createEntry(data), ...s.entries] })),
      updateEntry: (id, { type, amount, category, date, memo }) =>
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id
              ? { ...e, type, amount, category, date, memo: memo.trim().slice(0, MAX_MEMO_LENGTH) }
              : e,
          ),
        })),
      deleteEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
    }),
    { name: 'calculator-ledger' },
  ),
);
