import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Button from '../comp/Button'
import ErrorMessage from '../comp/ErrorMessage'
import FormField, { inputClass } from '../comp/FormField'

export default function LoginPage() {
  const token = useAuthStore((s) => s.token)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  // 로그인 전에 가려던 화면 (없으면 게시판 목록)
  const from = location.state?.from ?? '/board'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) return <Navigate to={from} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 입력해 주세요.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-3xl font-bold text-indigo-600">Mock Board</h1>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <FormField label="아이디">
            <input className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </FormField>
          <FormField label="비밀번호">
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
          <ErrorMessage message={error} />
          <Button type="submit" className="w-full py-2.5" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
        <div className="mt-4 rounded-xl bg-white/60 p-4 text-xs text-slate-500">
          <p className="mb-1 font-medium text-slate-600">테스트 계정</p>
          <p>운영자: admin / admin1234</p>
          <p>사용자: user1 / user1234, user2 / user1234</p>
        </div>
      </div>
    </div>
  )
}
