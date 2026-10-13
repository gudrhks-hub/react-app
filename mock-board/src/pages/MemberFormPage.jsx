import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { memberService } from '../service/memberService'
import { useAuthStore } from '../stores/authStore'
import { ROLES } from '../utils/role'
import Button from '../comp/Button'
import ErrorMessage from '../comp/ErrorMessage'
import FormField, { inputClass } from '../comp/FormField'
import Loading from '../comp/Loading'
import PageHeader from '../comp/PageHeader'

const emptyForm = { username: '', password: '', name: '', role: 'USER' }

// 회원 등록 / 수정 공용 화면 (운영자 전용)
export default function MemberFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    memberService
      .getDetail(id)
      .then((member) => setForm({ username: member.username, password: '', name: member.name, role: member.role }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const change = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const required = isEdit ? [form.name] : [form.username, form.password, form.name]
    if (required.some((v) => !v.trim())) {
      setError(isEdit ? '이름을 입력해 주세요.' : '아이디, 비밀번호, 이름을 모두 입력해 주세요.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        const saved = await memberService.update(id, { name: form.name, role: form.role, password: form.password })
        // 본인 정보를 수정했으면 헤더 정보도 갱신
        if (saved.id === user.id) setUser(saved)
      } else {
        await memberService.create(form)
      }
      navigate('/members', { replace: true })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-xl">
      <PageHeader title={isEdit ? '회원 수정' : '회원 등록'} />
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <FormField label="아이디" hint={isEdit ? '아이디는 수정할 수 없습니다.' : undefined}>
          <input className={inputClass} value={form.username} onChange={change('username')} disabled={isEdit} />
        </FormField>
        <FormField label="비밀번호" hint={isEdit ? '빈칸으로 두면 기존 비밀번호가 유지됩니다.' : undefined}>
          <input type="password" className={inputClass} value={form.password} onChange={change('password')} />
        </FormField>
        <FormField label="이름">
          <input className={inputClass} value={form.name} onChange={change('name')} />
        </FormField>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">권한</span>
          <div className="flex gap-2">
            {Object.entries(ROLES).map(([value, label]) => (
              <label
                key={value}
                className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition ${
                  form.role === value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={form.role === value}
                  onChange={change('role')}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        <ErrorMessage message={error} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/members')}>
            취소
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? '저장 중...' : isEdit ? '저장' : '등록'}
          </Button>
        </div>
      </form>
    </div>
  )
}
