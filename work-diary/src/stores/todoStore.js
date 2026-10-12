import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createTodo } from '../service/todoService';

const setStatus = (todos, id, from, to) =>
  todos.map((t) => (t.id === id && t.status === from ? { ...t, status: to } : t));

export const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      addTodo: (title, date, priority) =>
        set((state) => ({ todos: [createTodo({ title, date, priority }), ...state.todos] })),
      updateTodo: (id, { title, date, priority }) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id && t.status === 'active' ? { ...t, title: title.trim(), date, priority } : t,
          ),
        })),
      completeTodo: (id) => set((state) => ({ todos: setStatus(state.todos, id, 'active', 'done') })),
      cancelTodo: (id) => set((state) => ({ todos: setStatus(state.todos, id, 'active', 'canceled') })),
      deleteTodo: (id) => set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),
    }),
    { name: 'work-diary' },
  ),
);
