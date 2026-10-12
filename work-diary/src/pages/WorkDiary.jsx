import Header from '../comp/Header';
import TodoForm from '../comp/TodoForm';
import TodoList from '../comp/TodoList';

function WorkDiary() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
        <Header />
        <TodoForm />
        <TodoList />
      </main>
    </div>
  );
}

export default WorkDiary;
