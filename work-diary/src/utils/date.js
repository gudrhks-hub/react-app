const pad = (n) => String(n).padStart(2, '0');

// 'yyyy-MM-dd HH:mm'
export function formatDateTime(date) {
  return `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 'yyyy-MM-dd'
export function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
