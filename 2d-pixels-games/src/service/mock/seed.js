// 최초 실행 시 mock DB에 들어가는 초기 데이터
export const seedUsers = [
  { id: 1, username: 'admin', password: 'admin1234', nickname: 'GM픽셀', role: 'ADMIN', createdAt: '2026-10-01T09:00:00.000Z' },
  { id: 2, username: 'player1', password: 'player1234', nickname: '용사1호', role: 'USER', createdAt: '2026-10-02T10:30:00.000Z' },
]

export const seedGames = [
  { id: 1, title: '픽셀 러너', genre: '러닝 액션', color: '#4ade80' },
  { id: 2, title: '스페이스 블래스터', genre: '슈팅', color: '#38bdf8' },
  { id: 3, title: '던전 퀘스트', genre: 'RPG', color: '#a78bfa' },
  { id: 4, title: '블록 퍼즐', genre: '퍼즐', color: '#facc15' },
  { id: 5, title: '레트로 레이서', genre: '레이싱', color: '#f87171' },
  { id: 6, title: '슬라임 헌터', genre: '액션', color: '#fb923c' },
]

export const seedNotices = [
  {
    id: 1,
    title: '2D Pixels Games 오픈 안내',
    content: '2D Pixels Games에 오신 것을 환영합니다!\n자유게시판과 1:1문의를 자유롭게 이용해 주세요.',
    views: 42,
    authorId: 1,
    createdAt: '2026-10-05T09:00:00.000Z',
    updatedAt: null,
  },
  {
    id: 2,
    title: '신규 게임 업데이트 예정',
    content: '픽셀 러너, 슬라임 헌터 등 신규 게임이 순차적으로 오픈될 예정입니다.\n조금만 기다려 주세요!',
    views: 18,
    authorId: 1,
    createdAt: '2026-10-10T11:00:00.000Z',
    updatedAt: null,
  },
]

export const seedPosts = [
  {
    id: 1,
    title: '드디어 오픈했네요!',
    content: '레트로 감성 너무 좋습니다 ㅎㅎ',
    views: 12,
    authorId: 2,
    createdAt: '2026-10-06T13:00:00.000Z',
    updatedAt: null,
  },
  {
    id: 2,
    title: '던전 퀘스트 언제 나오나요?',
    content: 'RPG 좋아해서 제일 기대됩니다.',
    views: 8,
    authorId: 2,
    createdAt: '2026-10-08T15:20:00.000Z',
    updatedAt: null,
  },
  {
    id: 3,
    title: '자유게시판 이용 규칙',
    content: '서로 존중하는 커뮤니티를 만들어 주세요.\n욕설, 도배 글은 삭제될 수 있습니다.',
    views: 20,
    authorId: 1,
    createdAt: '2026-10-05T10:00:00.000Z',
    updatedAt: null,
  },
]

export const seedInquiries = [
  {
    id: 1,
    title: '닉네임 변경이 가능한가요?',
    content: '가입할 때 닉네임을 잘못 입력했어요. 변경할 수 있을까요?',
    authorId: 2,
    status: 'ANSWERED',
    answer: '안녕하세요, GM픽셀입니다.\n닉네임 변경 기능은 다음 업데이트에 추가될 예정입니다.',
    answeredAt: '2026-10-09T10:00:00.000Z',
    createdAt: '2026-10-08T20:00:00.000Z',
    updatedAt: null,
  },
  {
    id: 2,
    title: '게임 실행이 안 돼요',
    content: '게임 아이콘을 더블클릭하면 준비 중이라고 나옵니다.',
    authorId: 2,
    status: 'WAITING',
    answer: null,
    answeredAt: null,
    createdAt: '2026-10-11T09:30:00.000Z',
    updatedAt: null,
  },
]
