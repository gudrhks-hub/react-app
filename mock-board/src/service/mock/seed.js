// 최초 실행 시 mock DB에 들어가는 초기 데이터
export const seedMembers = [
  { id: 1, username: 'admin', password: 'admin1234', name: '관리자', role: 'ADMIN', createdAt: '2026-10-01T09:00:00.000Z' },
  { id: 2, username: 'user1', password: 'user1234', name: '홍길동', role: 'USER', createdAt: '2026-10-02T10:30:00.000Z' },
  { id: 3, username: 'user2', password: 'user1234', name: '김철수', role: 'USER', createdAt: '2026-10-03T14:20:00.000Z' },
]

export const seedPosts = [
  {
    id: 1,
    title: 'Mock Board에 오신 것을 환영합니다',
    content: '이 게시판은 서버 없이 mock 데이터로 동작합니다.\n자유롭게 글을 등록, 수정, 삭제해 보세요.',
    views: 24,
    authorId: 1,
    createdAt: '2026-10-04T09:00:00.000Z',
    updatedAt: null,
  },
  {
    id: 2,
    title: '게시판 이용 안내',
    content: '본인이 작성한 글만 수정/삭제할 수 있습니다.\n운영자는 모든 글을 관리할 수 있습니다.',
    views: 15,
    authorId: 1,
    createdAt: '2026-10-05T11:10:00.000Z',
    updatedAt: '2026-10-06T08:40:00.000Z',
  },
  {
    id: 3,
    title: '첫 글 남겨봅니다',
    content: '안녕하세요. 홍길동입니다.\n잘 부탁드립니다!',
    views: 7,
    authorId: 2,
    createdAt: '2026-10-07T13:25:00.000Z',
    updatedAt: null,
  },
  {
    id: 4,
    title: '이번 주 회의 일정 공유',
    content: '목요일 오후 2시 회의실 A에서 주간 회의가 있습니다.',
    views: 11,
    authorId: 3,
    createdAt: '2026-10-09T16:00:00.000Z',
    updatedAt: null,
  },
  {
    id: 5,
    title: '점심 메뉴 추천 받습니다',
    content: '회사 근처 맛집 추천해 주세요.',
    views: 3,
    authorId: 2,
    createdAt: '2026-10-11T03:30:00.000Z',
    updatedAt: null,
  },
]
