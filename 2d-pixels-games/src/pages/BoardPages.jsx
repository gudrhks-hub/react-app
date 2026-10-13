import ArticleDetail from '../comp/ArticleDetail'
import ArticleForm from '../comp/ArticleForm'
import ArticleList from '../comp/ArticleList'
import { postService } from '../service/articleService'
import { useAuthStore } from '../stores/authStore'
import { canEditPost } from '../utils/role'

const BASE = '/board'

// 자유게시판: 로그인하면 작성, 본인 글만 수정/삭제 (관리자는 전체)
export function BoardListPage() {
  return <ArticleList title="자유게시판" sub="자유롭게 이야기를 나눠요" basePath={BASE} service={postService} canWrite />
}

export function BoardDetailPage() {
  const user = useAuthStore((s) => s.user)
  return <ArticleDetail label="FREE BOARD" basePath={BASE} service={postService} canEdit={(item) => canEditPost(user, item)} />
}

export function BoardFormPage() {
  const user = useAuthStore((s) => s.user)
  return (
    <ArticleForm
      label="게시글"
      basePath={BASE}
      load={async (id) => {
        const item = await postService.getDetail(id, false)
        return canEditPost(user, item) ? item : { denied: '수정 권한이 없습니다.' }
      }}
      save={(id, data) => (id ? postService.update(id, data) : postService.create(data))}
    />
  )
}
