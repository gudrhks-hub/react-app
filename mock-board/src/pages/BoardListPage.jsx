import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { postService } from '../service/postService'
import { useAuthStore } from '../stores/authStore'
import { formatDate } from '../utils/date'
import Button from '../comp/Button'
import ErrorMessage from '../comp/ErrorMessage'
import Loading from '../comp/Loading'
import PageHeader from '../comp/PageHeader'

export default function BoardListPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    postService
      .getList()
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="게시판">
        {/* 글쓰기는 로그인한 회원만 */}
        {user && <Button onClick={() => navigate('/board/new')}>글쓰기</Button>}
      </PageHeader>

      <ErrorMessage message={error} />
      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="w-20 px-4 py-3 font-medium">번호</th>
                <th className="px-4 py-3 text-left font-medium">제목</th>
                <th className="w-32 px-4 py-3 font-medium">글쓴이</th>
                <th className="w-20 px-4 py-3 font-medium">조회</th>
                <th className="w-32 px-4 py-3 font-medium">등록일</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    등록된 게시글이 없습니다.
                  </td>
                </tr>
              )}
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-slate-100 text-center hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">{post.id}</td>
                  <td className="px-4 py-3 text-left">
                    <Link to={`/board/${post.id}`} className="font-medium hover:text-indigo-600">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{post.authorName}</td>
                  <td className="px-4 py-3 text-slate-500">{post.views}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(post.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
