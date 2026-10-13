import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { memberService } from '../service/memberService'
import { useAuthStore } from '../stores/authStore'
import { formatDate } from '../utils/date'
import { isAdmin } from '../utils/role'
import Button from '../comp/Button'
import ErrorMessage from '../comp/ErrorMessage'
import Loading from '../comp/Loading'
import PageHeader from '../comp/PageHeader'
import RoleBadge from '../comp/RoleBadge'

export default function MemberListPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const admin = isAdmin(user)

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    memberService
      .getList()
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (member) => {
    if (!confirm(`'${member.name}(${member.username})' 회원을 삭제하시겠습니까?`)) return
    setDeletingId(member.id)
    setError('')
    try {
      await memberService.remove(member.id)
      setMembers((list) => list.filter((m) => m.id !== member.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <PageHeader title="회원정보">{admin && <Button onClick={() => navigate('/members/new')}>회원 등록</Button>}</PageHeader>

      <ErrorMessage message={error} />
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="w-20 px-4 py-3 font-medium">번호</th>
                <th className="px-4 py-3 text-left font-medium">아이디</th>
                <th className="px-4 py-3 text-left font-medium">이름</th>
                <th className="w-28 px-4 py-3 font-medium">권한</th>
                <th className="w-32 px-4 py-3 font-medium">가입일</th>
                {admin && <th className="w-40 px-4 py-3 font-medium">관리</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-slate-100 text-center hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">{member.id}</td>
                  <td className="px-4 py-3 text-left font-medium">{member.username}</td>
                  <td className="px-4 py-3 text-left">
                    {member.name}
                    {member.id === user?.id && <span className="ml-1.5 text-xs text-indigo-500">(나)</span>}
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(member.createdAt)}</td>
                  {admin && (
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1.5">
                        <Button
                          variant="secondary"
                          className="px-3 py-1 text-xs"
                          onClick={() => navigate(`/members/${member.id}/edit`)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="danger"
                          className="px-3 py-1 text-xs"
                          onClick={() => handleDelete(member)}
                          disabled={member.id === user?.id || deletingId === member.id}
                          title={member.id === user?.id ? '본인은 삭제할 수 없습니다.' : undefined}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
