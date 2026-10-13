import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { isAdmin, ROLES } from '../utils/role'
import ErrorMessage from './ErrorMessage'
import FormField, { inputClass } from './FormField'
import PixelButton from './PixelButton'

export const LOGIN_INPUT_ID = 'login-username'

// 메인 로그인 폼 (로그인 후에는 환영 박스)
export default function LoginBox({ notice, onLogin }) {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return (
      <div className="pixel-panel mx-auto w-full max-w-sm p-6 text-center">
        <p className="text-sm text-zinc-400">PLAYER 1</p>
        <p className="mt-2 text-xl font-bold">
          <span className="text-neon-yellow">{user.nickname}</span>님 환영합니다!
        </p>
        <p className={`mt-1 text-xs ${isAdmin(user) ? 'text-neon-red' : 'text-neon-green'}`}>[{ROLES[user.role]}]</p>
        <PixelButton variant="secondary" className="mt-5" onClick={logout}>
          LOGOUT
        </PixelButton>
      </div>
    )
  }

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
      onLogin?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pixel-panel mx-auto w-full max-w-sm space-y-4 p-6">
      {notice && <p className="text-center text-sm text-neon-yellow">{notice}</p>}
      <FormField label="아이디">
        <input
          id={LOGIN_INPUT_ID}
          className={inputClass}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </FormField>
      <FormField label="비밀번호">
        <input
          type="password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      <ErrorMessage message={error} />
      <PixelButton type="submit" className="w-full py-3" disabled={loading}>
        {loading ? 'LOADING...' : 'LOGIN'}
      </PixelButton>
      <p className="text-center text-xs text-zinc-400">
        아직 회원이 아니신가요?{' '}
        <Link to="/signup" className="text-neon-green hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  )
}
