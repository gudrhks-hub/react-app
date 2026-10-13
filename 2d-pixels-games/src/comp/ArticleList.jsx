import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/date'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import PageTitle from './PageTitle'
import PixelButton from './PixelButton'

// 공지 / 자유게시판 공용 목록
export default function ArticleList({ title, sub, basePath, service, canWrite }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    service
      .getList()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [service])

  return (
    <div>
      <PageTitle title={title} sub={sub}>
        {canWrite && <PixelButton onClick={() => navigate(`${basePath}/new`)}>글쓰기</PixelButton>}
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
                <th className="w-28 px-3 py-3">글쓴이</th>
                <th className="w-16 px-3 py-3">조회</th>
                <th className="w-28 px-3 py-3">등록일</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-zinc-500">
                    등록된 글이 없습니다.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b-2 border-dashed border-zinc-800 text-center hover:bg-white/5">
                  <td className="px-3 py-3 text-zinc-500">{item.id}</td>
                  <td className="px-3 py-3 text-left">
                    <Link to={`${basePath}/${item.id}`} className="hover:text-neon-yellow">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-3 py-3">{item.authorName}</td>
                  <td className="px-3 py-3 text-zinc-400">{item.views}</td>
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
