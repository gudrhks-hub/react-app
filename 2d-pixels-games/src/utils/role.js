export const ROLES = {
  ADMIN: '관리자',
  USER: '일반',
}

export const isAdmin = (user) => user?.role === 'ADMIN'

// 본인 글이거나 관리자면 수정/삭제 가능
export const canEditPost = (user, post) => !!user && !!post && (isAdmin(user) || user.id === post.authorId)

export const INQUIRY_STATUS = {
  WAITING: '답변 대기',
  ANSWERED: '답변 완료',
}
