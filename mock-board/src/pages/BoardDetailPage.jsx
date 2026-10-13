import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postService } from '../service/postService'
import { useAuthStore } from '../stores/authStore'
import { formatDateTime } from '../utils/date'
import { canEditPost } from '../utils/role'
import Button from '../comp/Button'
import ErrorMessage from '../comp/ErrorMessage'
import Loading from '../comp/Loading'

export default function BoardDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    postService
      .getDetail(id)
      .then(setPost)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return
    setDeleting(true)
    try {
      await postService.remove(id)
      navigate('/board', { replace: true })
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <ErrorMessage message={error} />
      {post && (
        <article className="rounded-xl border border-slate-200 bg-white">
          <header className="border-b border-slate-100 p-6">
            <h1 className="mb-3 text-2xl font-bold">{post.title}</h1>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
              <div className="flex gap-1.5">
                <dt>글쓴이</dt>
                <dd className="font-medium text-slate-700">{post.authorName}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>등록일</dt>
                <dd>{formatDateTime(post.createdAt)}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>수정일</dt>
                <dd>{formatDateTime(post.updatedAt)}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>조회</dt>
                <dd>{post.views}</dd>
              </div>
            </dl>
          </header>
          <div className="min-h-48 whitespace-pre-wrap p-6 leading-relaxed">{post.content}</div>
        </article>
      )}

      <div className="mt-6 flex gap-2">
        <Button variant="secondary" onClick={() => navigate('/board')}>
          목록
        </Button>
        {canEditPost(user, post) && (
          <>
            <Button variant="secondary" className="ml-auto" onClick={() => navigate(`/board/${id}/edit`)}>
              수정
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? '삭제 중...' : '삭제'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
