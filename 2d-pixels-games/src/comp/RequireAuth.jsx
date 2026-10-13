import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

// 로그인하지 않았으면 메인으로 보내 로그인 안내 (로그인 후 원래 화면으로 돌아오도록 경로 전달)
export default function RequireAuth() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  if (!token) return <Navigate to="/" replace state={{ needLogin: true, from: location.pathname }} />
  return <Outlet />
}
