export const ROLES = {
  ADMIN: '운영자',
  USER: '사용자',
}

export const isAdmin = (user) => user?.role === 'ADMIN'

// 본인 글이거나 운영자면 수정/삭제 가능
export const canEditPost = (user, post) => !!user && !!post && (isAdmin(user) || user.id === post.authorId)
