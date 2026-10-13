const pad = (n) => String(n).padStart(2, '0')

// yyyy-MM-dd HH:mm
export function formatDateTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// yyyy-MM-dd
export function formatDate(value) {
  if (!value) return '-'
  return formatDateTime(value).slice(0, 10)
}
