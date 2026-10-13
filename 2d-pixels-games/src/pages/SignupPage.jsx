import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import ErrorMessage from '../comp/ErrorMessage'
import FormField, { inputClass } from '../comp/FormField'
import PageTitle from '../comp/PageTitle'
import PixelButton from '../comp/PixelButton'
import PixelSprite from '../comp/PixelSprite'
import { slime } from '../comp/sprites'
import { authService } from '../service/authService'
import { useAuthStore } from '../stores/authStore'

const emptyForm = { username: '', password: '', passwordConfirm: '', nickname: '' }

export default function SignupPage() {
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // 이미 로그인했으면 메인으로
  if (token) return <Navigate to="/" replace />

  const change = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { username, password, passwordConfirm, nickname } = form
    if ([username, password, nickname].some((v) => !v.trim())) {
      setError('모든 항목을 입력해 주세요.')
      return
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await authService.signup({ username, password, nickname })
      alert('회원가입이 완료되었습니다.')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex justify-center">
        <PixelSprite sprite={slime} scale={5} className="animate-bob" />
      </div>
      <PageTitle title="NEW PLAYER" sub="회원가입하고 2D Pixels Games를 즐겨보세요!" />
      <form onSubmit={handleSubmit} className="pixel-panel space-y-4 p-6">
        <FormField label="아이디">
          <input className={inputClass} value={form.username} onChange={change('username')} autoComplete="username" />
        </FormField>
        <FormField label="비밀번호">
          <input type="password" className={inputClass} value={form.password} onChange={change('password')} autoComplete="new-password" />
        </FormField>
        <FormField label="비밀번호 확인">
          <input
            type="password"
            className={inputClass}
            value={form.passwordConfirm}
            onChange={change('passwordConfirm')}
            autoComplete="new-password"
          />
        </FormField>
        <FormField label="닉네임">
          <input className={inputClass} value={form.nickname} onChange={change('nickname')} maxLength={12} />
        </FormField>
        <ErrorMessage message={error} />
        <PixelButton type="submit" variant="green" className="w-full py-3" disabled={saving}>
          {saving ? 'LOADING...' : '회원가입'}
        </PixelButton>
        <p className="text-center text-xs text-zinc-400">
          <Link to="/" className="hover:text-neon-yellow">
            ◀ 메인으로
          </Link>
        </p>
      </form>
    </div>
  )
}
