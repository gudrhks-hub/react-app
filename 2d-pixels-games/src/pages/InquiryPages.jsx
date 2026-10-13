import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ArticleForm from '../comp/ArticleForm'
import ErrorMessage from '../comp/ErrorMessage'
import { inputClass } from '../comp/FormField'
import Loading from '../comp/Loading'
import PageTitle from '../comp/PageTitle'
import PixelButton from '../comp/PixelButton'
import { inquiryService } from '../service/inquiryService'
import { useAuthStore } from '../stores/authStore'
import { formatDate, formatDateTime } from '../utils/date'
import { INQUIRY_STATUS, isAdmin } from '../utils/role'

const BASE = '/inquiries'

function StatusBadge({ status }) {
  const style = status === 'ANSWERED' ? 'border-neon-green text-neon-green' : 'border-neon-yellow text-neon-yellow'
  return <span className={`inline-block border-2 px-2 py-0.5 text-xs ${style}`}>{INQUIRY_STATUS[status]}</span>
}

// 일반 회원: 본인 문의만 / 관리자: 전체 문의
export function InquiryListPage() {
  const navigate = useNavigate()
  const admin = isAdmin(useAuthStore((s) => s.user))
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    inquiryService
      .getList()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageTitle title="1:1문의" sub={admin ? '전체 회원의 문의 목록입니다.' : '내가 남긴 문의만 보입니다.'}>
        <PixelButton onClick={() => navigate(`${BASE}/new`)}>문의하기</PixelButton>
      </PageTitle>

      <ErrorMessage message={error} />
      {loading ? (
        <Loading />
      ) : (
        <div className="pixel-panel overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b-4 border-white text-neon-sky">
              <tr>
                <th className="w-16 px-3 py-3">NO</th>
                <th className="px-3 py-3 text-left">제목</th>
                {admin && <th className="w-28 px-3 py-3">문의자</th>}
                <th className="w-28 px-3 py-3">상태</th>
                <th className="w-28 px-3 py-3">등록일</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={admin ? 5 : 4} className="py-16 text-center text-zinc-500">
                    등록된 문의가 없습니다.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b-2 border-dashed border-zinc-800 text-center hover:bg-white/5">
                  <td className="px-3 py-3 text-zinc-500">{item.id}</td>
                  <td className="px-3 py-3 text-left">
                    <Link to={`${BASE}/${item.id}`} className="hover:text-neon-yellow">
                      {item.title}
                    </Link>
                  </td>
                  {admin && <td className="px-3 py-3">{item.authorName}</td>}
                  <td className="px-3 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-3 text-zinc-400">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// 문의 상세 + 답변 (관리자는 답변 등록/수정)
export function InquiryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const admin = isAdmin(user)

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState('')
  const [editingAnswer, setEditingAnswer] = useState(false)

  useEffect(() => {
    inquiryService
      .getDetail(id)
      .then((data) => {
        setItem(data)
        setAnswer(data.answer ?? '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const isOwner = item?.authorId === user?.id
  const waiting = item?.status === 'WAITING'

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return
    setBusy(true)
    try {
      await inquiryService.remove(id)
      navigate(BASE, { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const handleAnswer = async (e) => {
    e.preventDefault()
    if (!answer.trim()) {
      setError('답변 내용을 입력해 주세요.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const saved = await inquiryService.answer(id, answer)
      setItem(saved)
      setEditingAnswer(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <ErrorMessage message={error} />
      {item && (
        <>
          <article className="pixel-panel">
            <header className="border-b-4 border-dashed border-zinc-700 p-6">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-xs text-neon-sky">Q. 1:1 INQUIRY</span>
                <StatusBadge status={item.status} />
              </div>
              <h1 className="mb-4 text-2xl font-bold text-neon-yellow">{item.title}</h1>
              <dl className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-400">
                <div className="flex gap-1.5">
                  <dt>문의자</dt>
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
              </dl>
            </header>
            <div className="min-h-32 whitespace-pre-wrap p-6 leading-relaxed">{item.content}</div>
          </article>

          {/* 답변 영역 */}
          <section className="border-4 border-neon-green p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold text-neon-green">A. 답변</h2>
              {item.answeredAt && <span className="text-xs text-zinc-400">{formatDateTime(item.answeredAt)}</span>}
            </div>
            {admin && (editingAnswer || waiting) ? (
              <form onSubmit={handleAnswer} className="space-y-3">
                <textarea
                  className={`${inputClass} min-h-40 resize-y`}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="답변 내용을 입력해 주세요."
                />
                <div className="flex justify-end gap-3">
                  {editingAnswer && (
                    <PixelButton type="button" variant="secondary" onClick={() => setEditingAnswer(false)}>
                      취소
                    </PixelButton>
                  )}
                  <PixelButton type="submit" variant="green" disabled={busy}>
                    {waiting ? '답변 등록' : '답변 저장'}
                  </PixelButton>
                </div>
              </form>
            ) : waiting ? (
              <p className="text-sm text-zinc-400">
                답변을 기다리고 있습니다<span className="animate-blink">...</span>
              </p>
            ) : (
              <>
                <p className="whitespace-pre-wrap leading-relaxed">{item.answer}</p>
                {admin && (
                  <PixelButton variant="secondary" className="mt-4" onClick={() => setEditingAnswer(true)}>
                    답변 수정
                  </PixelButton>
                )}
              </>
            )}
          </section>
        </>
      )}

      <div className="flex gap-3">
        <PixelButton variant="secondary" onClick={() => navigate(BASE)}>
          목록
        </PixelButton>
        {item && isOwner && waiting && (
          <PixelButton variant="green" className="ml-auto" onClick={() => navigate(`${BASE}/${id}/edit`)}>
            수정
          </PixelButton>
        )}
        {item && (admin || (isOwner && waiting)) && (
          <PixelButton variant="danger" className={isOwner && waiting ? '' : 'ml-auto'} onClick={handleDelete} disabled={busy}>
            삭제
          </PixelButton>
        )}
      </div>
    </div>
  )
}

export function InquiryFormPage() {
  const user = useAuthStore((s) => s.user)
  return (
    <ArticleForm
      label="문의"
      basePath={BASE}
      load={async (id) => {
        const item = await inquiryService.getDetail(id)
        if (item.authorId !== user.id) return { denied: '본인 문의만 수정할 수 있습니다.' }
        if (item.status !== 'WAITING') return { denied: '답변이 완료된 문의는 수정할 수 없습니다.' }
        return item
      }}
      save={(id, data) => (id ? inquiryService.update(id, data) : inquiryService.create(data))}
    />
  )
}
