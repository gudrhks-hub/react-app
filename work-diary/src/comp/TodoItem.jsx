import { useState } from 'react';
import { useTodoStore } from '../stores/todoStore';
import { validateTodo } from '../service/todoService';
import { PRIORITIES } from '../utils/priority';
import PriorityBadge from './PriorityBadge';
import PrioritySelect from './PrioritySelect';

const STATUS_BADGE = {
  done: { label: '완료', className: 'bg-gray-100 text-gray-500' },
  canceled: { label: '일정 취소', className: 'bg-gray-100 text-gray-400' },
};

const btn = 'rounded-md px-2.5 py-1 text-xs font-medium transition';
const inputClass = 'rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400';

function TodoItem({ todo }) {
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const completeTodo = useTodoStore((s) => s.completeTodo);
  const cancelTodo = useTodoStore((s) => s.cancelTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(todo);

  const isActive = todo.status === 'active';
  const isDone = todo.status === 'done';
  const isCanceled = todo.status === 'canceled';

  const startEdit = () => {
    setForm(todo);
    setEditing(true);
  };

  const save = () => {
    if (!validateTodo(form)) return;
    updateTodo(todo.id, form);
    setEditing(false);
  };

  const remove = () => {
    if (window.confirm('삭제하시겠습니까?')) deleteTodo(todo.id);
  };

  const titleColor = isActive ? 'text-gray-900' : 'text-gray-400';

  return (
    <li className="flex overflow-hidden rounded-xl bg-white shadow-sm">
      <div className={`w-1.5 shrink-0 ${PRIORITIES[todo.priority].bar} ${isActive ? '' : 'opacity-30'}`} />

      {editing ? (
        <div className="flex flex-1 flex-col gap-2 p-4 sm:flex-row sm:items-center">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`${inputClass} flex-1`}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass}
          />
          <PrioritySelect value={form.priority} onChange={(priority) => setForm({ ...form, priority })} />
          <div className="flex gap-1">
            <button
              type="button"
              onClick={save}
              disabled={!validateTodo(form)}
              className={`${btn} bg-gray-900 text-white hover:bg-gray-700 disabled:bg-gray-300`}
            >
              저장
            </button>
            <button type="button" onClick={() => setEditing(false)} className={`${btn} text-gray-500 hover:bg-gray-100`}>
              닫기
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className={`flex items-center gap-1.5 text-sm font-medium ${titleColor}`}>
              {isDone && <span className="text-emerald-500">✓</span>}
              <span className={`truncate ${isCanceled ? 'line-through' : ''}`}>{todo.title}</span>
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="tabular-nums">{todo.date}</span>
              <PriorityBadge priority={todo.priority} />
              {!isActive && (
                <span className={`rounded-full px-2 py-0.5 font-medium ${STATUS_BADGE[todo.status].className}`}>
                  {STATUS_BADGE[todo.status].label}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-1">
            {isActive && (
              <>
                <button
                  type="button"
                  onClick={() => completeTodo(todo.id)}
                  className={`${btn} text-emerald-600 hover:bg-emerald-50`}
                >
                  완료
                </button>
                <button type="button" onClick={() => cancelTodo(todo.id)} className={`${btn} text-gray-500 hover:bg-gray-100`}>
                  취소
                </button>
                <button type="button" onClick={startEdit} className={`${btn} text-gray-500 hover:bg-gray-100`}>
                  수정
                </button>
              </>
            )}
            <button type="button" onClick={remove} className={`${btn} text-red-500 hover:bg-red-50`}>
              삭제
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default TodoItem;
