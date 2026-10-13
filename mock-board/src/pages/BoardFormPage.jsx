import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postService } from '../service/postService'
import { useAuthStore } from '../stores/authStore'
import { canEditPost } from '../utils/role'
import Button from '../comp/Button'
import ErrorMessage from '../comp/ErrorMessage'
import FormField, { inputClass } from '../comp/FormField'
import Loading from '../comp/Loading'
import PageHeader from '../comp/PageHeader'

// 게시글 등록 / 수정 공용 화면
export default function BoardFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    postService
      .getDetail(id, false)
      .then((post) => {
        if (!canEditPost(user, post)) {
          alert('수정 권한이 없습니다.')
          navigate(`/board/${id}`, { replace: true })
          return
        }
        setTitle(post.title)
        setContent(post.content)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해 주세요.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const saved = isEdit
        ? await postService.update(id, { title, content })
        : await postService.create({ title, content })
      navigate(`/board/${saved.id}`, { replace: true })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <PageHeader title={isEdit ? '게시글 수정' : '게시글 등록'} />
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <FormField label="제목">
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
        </FormField>
        <FormField label="내용">
          <textarea
            className={`${inputClass} min-h-64 resize-y`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </FormField>
        <ErrorMessage message={error} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
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
