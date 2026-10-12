import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_STATE, loadValue, reduce, roundResult, toDisplayString } from '../service/calculator';

export const useCalcStore = create(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      history: [],
      memory: [], // 0번이 가장 최근 값

      // 계산기 버튼
      press: (action) => set((s) => reduce(s, action)),

      // 기록
      recallHistory: (id) =>
        set((s) => {
          const item = s.history.find((h) => h.id === id);
          return item ? loadValue(s, item.result) : {};
        }),
      clearHistory: () => set({ history: [] }),

      // 메모리
      memoryClear: () => set({ memory: [] }),
      memoryRecall: (index = 0) =>
        set((s) => (s.memory[index] === undefined ? {} : loadValue(s, toDisplayString(s.memory[index])))),
      memoryAdd: () => set((s) => updateLatestMemory(s, 1)),
      memorySubtract: () => set((s) => updateLatestMemory(s, -1)),
      memoryStore: () => set((s) => (s.error ? {} : { memory: [Number(s.display), ...s.memory], overwrite: true })),
    }),
    {
      name: 'calculator',
      partialize: (s) => ({ history: s.history, memory: s.memory }),
    },
  ),
);

// M+ / M- (메모리가 없으면 새로 저장)
function updateLatestMemory(s, sign) {
  if (s.error) return {};
  const value = sign * Number(s.display);
  const memory = s.memory.length ? [roundResult(s.memory[0] + value), ...s.memory.slice(1)] : [value];
  return { memory, overwrite: true };
}
