import ArticleDetail from '../comp/ArticleDetail'
import ArticleForm from '../comp/ArticleForm'
import ArticleList from '../comp/ArticleList'
import { noticeService } from '../service/articleService'
import { useAuthStore } from '../stores/authStore'
import { isAdmin } from '../utils/role'

const BASE = '/notices'

// 공지사항: 회원 누구나 읽기, 관리자만 작성/수정/삭제
export function NoticeListPage() {
  const user = useAuthStore((s) => s.user)
  return (
    <ArticleList title="공지사항" sub="2D Pixels Games 소식" basePath={BASE} service={noticeService} canWrite={isAdmin(user)} />
  )
}

export function NoticeDetailPage() {
  const user = useAuthStore((s) => s.user)
  return <ArticleDetail label="NOTICE" basePath={BASE} service={noticeService} canEdit={(item) => !!item && isAdmin(user)} />
}

export function NoticeFormPage() {
  return (
    <ArticleForm
      label="공지"
      basePath={BASE}
      load={(id) => noticeService.getDetail(id, false)}
      save={(id, data) => (id ? noticeService.update(id, data) : noticeService.create(data))}
    />
  )
}
