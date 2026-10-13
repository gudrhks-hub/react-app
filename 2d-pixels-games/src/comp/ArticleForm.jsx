import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from './ErrorMessage'
import FormField, { inputClass } from './FormField'
import Loading from './Loading'
import PageTitle from './PageTitle'
import PixelButton from './PixelButton'

// 공지 / 자유게시판 / 1:1문의 공용 등록·수정 폼
// load(id): 수정할 글을 불러옴. 수정 불가면 { denied: '메시지' } 반환
export default function ArticleForm({ label, basePath, load, save }) {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    load(id)
      .then((item) => {
        if (item.denied) {
          alert(item.denied)
          navigate(`${basePath}/${id}`, { replace: true })
          return
        }
        setTitle(item.title)
        setContent(item.content)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해 주세요.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const saved = await save(isEdit ? id : null, { title, content })
      navigate(`${basePath}/${saved.id}`, { replace: true })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <PageTitle title={`${label} ${isEdit ? '수정' : '등록'}`} />
      <form onSubmit={handleSubmit} className="pixel-panel space-y-5 p-6">
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
        <div className="flex justify-end gap-3">
          <PixelButton type="button" variant="secondary" onClick={() => navigate(-1)}>
            취소
          </PixelButton>
          <PixelButton type="submit" disabled={saving}>
            {saving ? 'SAVING...' : isEdit ? '저장' : '등록'}
          </PixelButton>
        </div>
      </form>
    </div>
  )
}
