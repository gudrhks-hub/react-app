import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDateTime } from '../utils/date'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import PixelButton from './PixelButton'

// 공지 / 자유게시판 공용 상세
// canEdit(item): 수정/삭제 버튼 표시 여부
export default function ArticleDetail({ label, basePath, service, canEdit }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    service
      .getDetail(id)
      .then(setItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [service, id])

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return
    setDeleting(true)
    try {
      await service.remove(id)
      navigate(basePath, { replace: true })
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <ErrorMessage message={error} />
      {item && (
        <article className="pixel-panel">
          <header className="border-b-4 border-dashed border-zinc-700 p-6">
            <p className="mb-2 text-xs text-neon-sky">{label}</p>
            <h1 className="mb-4 text-2xl font-bold text-neon-yellow">{item.title}</h1>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-400">
              <div className="flex gap-1.5">
                <dt>글쓴이</dt>
                <dd className="text-white">{item.authorName}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>등록일</dt>
                <dd>{formatDateTime(item.createdAt)}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>수정일</dt>
                <dd>{formatDateTime(item.updatedAt)}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>조회</dt>
                <dd>{item.views}</dd>
              </div>
            </dl>
          </header>
          <div className="min-h-48 whitespace-pre-wrap p-6 leading-relaxed">{item.content}</div>
        </article>
      )}

      <div className="mt-8 flex gap-3">
        <PixelButton variant="secondary" onClick={() => navigate(basePath)}>
          목록
        </PixelButton>
        {canEdit(item) && (
          <>
            <PixelButton variant="green" className="ml-auto" onClick={() => navigate(`${basePath}/${id}/edit`)}>
              수정
            </PixelButton>
            <PixelButton variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? '삭제 중...' : '삭제'}
            </PixelButton>
          </>
        )}
      </div>
    </div>
  )
}
