import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { isAdmin } from '../utils/role'

// 관리자가 아니면 안내 후 공지 목록으로 이동
export default function RequireAdmin() {
  const user = useAuthStore((s) => s.user)
  const allowed = isAdmin(user)

  useEffect(() => {
    if (!allowed) alert('권한이 없습니다.')
  }, [allowed])

  if (!allowed) return <Navigate to="/notices" replace />
  return <Outlet />
}
