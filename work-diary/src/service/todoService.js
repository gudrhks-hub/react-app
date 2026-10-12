// 할일 입력값 검증
export function validateTodo({ title, date }) {
  return title.trim() !== '' && date !== '';
}

// 새 할일 생성
export function createTodo({ title, date, priority }) {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    date,
    priority,
    status: 'active',
    createdAt: Date.now(),
  };
}

// 최신순 정렬 (createdAt 내림차순)
export function sortByLatest(todos) {
  return [...todos].sort((a, b) => b.createdAt - a.createdAt);
}
