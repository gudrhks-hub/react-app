import { useTodoStore } from '../stores/todoStore';
import { sortByLatest } from '../service/todoService';
import TodoItem from './TodoItem';

function TodoList() {
  const todos = useTodoStore((s) => s.todos);

  if (todos.length === 0) {
    return (
      <p className="rounded-xl bg-white py-12 text-center text-sm text-gray-400 shadow-sm">등록된 할일이 없습니다</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {sortByLatest(todos).map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
