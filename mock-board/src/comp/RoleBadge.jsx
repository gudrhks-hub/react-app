import { ROLES } from '../utils/role'

export default function RoleBadge({ role }) {
  if (!role) return null
  const style = role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{ROLES[role]}</span>
}
