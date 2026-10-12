import { useState } from 'react';
import { useTodoStore } from '../stores/todoStore';
import { validateTodo } from '../service/todoService';
import { formatDate } from '../utils/date';
import PrioritySelect from './PrioritySelect';

const inputClass =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400';

function TodoForm() {
  const addTodo = useTodoStore((s) => s.addTodo);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => formatDate(new Date()));
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateTodo({ title, date })) return;
    addTodo(title, date, priority);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm sm:flex-row">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할일을 입력하세요"
        className={`${inputClass} flex-1`}
      />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      <PrioritySelect value={priority} onChange={setPriority} />
      <button
        type="submit"
        disabled={!validateTodo({ title, date })}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        등록
      </button>
    </form>
  );
}

export default TodoForm;
