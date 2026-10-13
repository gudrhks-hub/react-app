import AxiosMockAdapter from 'axios-mock-adapter'
import api from '../api'
import { db } from './db'

const DELAY = 300
const TOKEN_PREFIX = 'pixel-token-'

// ---------- 공통 헬퍼 ----------
const ok = (data, status = 200) => [status, data]
const fail = (status, message) => [status, { message }]
const now = () => new Date().toISOString()

const parseBody = (config) => (config.data ? JSON.parse(config.data) : {})
const idFromUrl = (config) => Number(config.url.match(/\/(\d+)(\/answer)?$/)[1])
const isBlank = (value) => !value || !String(value).trim()
const byLatest = (a, b) => b.createdAt.localeCompare(a.createdAt)
const isAdmin = (user) => user.role === 'ADMIN'

// 비밀번호를 제외한 회원 정보
const toUser = ({ password, ...user }) => user

// 글쓴이 닉네임 채우기
const withAuthor = (item) => {
  const author = db.users.findById(item.authorId)
  return { ...item, authorName: author ? author.nickname : '(탈퇴회원)' }
}

const issueToken = (userId) => TOKEN_PREFIX + btoa(`${userId}:${Date.now()}`)

// Authorization 헤더의 토큰으로 로그인 회원을 찾는다.
function getLoginUser(config) {
  const header = config.headers?.Authorization ?? ''
  const token = header.replace('Bearer ', '')
  if (!token.startsWith(TOKEN_PREFIX)) return null
  try {
    const [userId] = atob(token.slice(TOKEN_PREFIX.length)).split(':')
    return db.users.findById(Number(userId))
  } catch {
    return null
  }
}

// 로그인 / 관리자 체크를 감싼 핸들러
function auth(handler, { admin = false } = {}) {
  return (config) => {
    const me = getLoginUser(config)
    if (!me) return fail(401, '로그인이 필요합니다.')
    if (admin && !isAdmin(me)) return fail(403, '권한이 없습니다.')
    return handler(config, me)
  }
}
const adminOnly = (handler) => auth(handler, { admin: true })

// 공지 / 자유게시판 공용 CRUD 라우트
function articleRoutes(mock, path, table, { writeAdminOnly }) {
  const listUrl = `/${path}`
  const itemUrl = new RegExp(`/${path}/\\d+$`)
  const canWrite = (me, item) => (writeAdminOnly ? isAdmin(me) : isAdmin(me) || item.authorId === me.id)

  mock.onGet(listUrl).reply(auth(() => ok(table.findAll().sort(byLatest).map(withAuthor))))

  mock.onGet(itemUrl).reply(
    auth((config) => {
      const item = table.findById(idFromUrl(config))
      if (!item) return fail(404, '글을 찾을 수 없습니다.')
      // 수정 화면에서 불러올 때는 조회 수를 올리지 않는다.
      if (config.params?.increaseView === false) return ok(withAuthor(item))
      return ok(withAuthor(table.update(item.id, { views: item.views + 1 })))
    }),
  )

  mock.onPost(listUrl).reply(
    auth((config, me) => {
      if (writeAdminOnly && !isAdmin(me)) return fail(403, '권한이 없습니다.')
      const { title, content } = parseBody(config)
      if (isBlank(title) || isBlank(content)) return fail(400, '제목과 내용을 입력해 주세요.')
      const item = table.insert({
        title: title.trim(),
        content,
        views: 0,
        authorId: me.id,
        createdAt: now(),
        updatedAt: null,
      })
      return ok(withAuthor(item), 201)
    }),
  )

  mock.onPut(itemUrl).reply(
    auth((config, me) => {
      const item = table.findById(idFromUrl(config))
      if (!item) return fail(404, '글을 찾을 수 없습니다.')
      if (!canWrite(me, item)) return fail(403, '수정 권한이 없습니다.')
      const { title, content } = parseBody(config)
      if (isBlank(title) || isBlank(content)) return fail(400, '제목과 내용을 입력해 주세요.')
      return ok(withAuthor(table.update(item.id, { title: title.trim(), content, updatedAt: now() })))
    }),
  )

  mock.onDelete(itemUrl).reply(
    auth((config, me) => {
      const item = table.findById(idFromUrl(config))
      if (!item) return fail(404, '글을 찾을 수 없습니다.')
      if (!canWrite(me, item)) return fail(403, '삭제 권한이 없습니다.')
      table.remove(item.id)
      return [204]
    }),
  )
}

// ---------- 라우트 ----------
export function setupMockServer() {
  const mock = new AxiosMockAdapter(api, { delayResponse: DELAY })

  // 인증
  mock.onPost('/auth/login').reply((config) => {
    const { username, password } = parseBody(config)
    const user = db.users.findAll().find((u) => u.username === username && u.password === password)
    if (!user) return fail(401, '아이디 또는 비밀번호가 올바르지 않습니다.')
    return ok({ token: issueToken(user.id), user: toUser(user) })
  })

  mock.onPost('/auth/signup').reply((config) => {
    const { username, password, nickname } = parseBody(config)
    if ([username, password, nickname].some(isBlank)) return fail(400, '모든 항목을 입력해 주세요.')
    const loginId = username.trim()
    if (db.users.findAll().some((u) => u.username === loginId)) return fail(409, '이미 사용 중인 아이디입니다.')
    const user = db.users.insert({
      username: loginId,
      password,
      nickname: nickname.trim(),
      role: 'USER', // 회원가입은 항상 일반 회원
      createdAt: now(),
    })
    return ok(toUser(user), 201)
  })

  mock.onGet('/auth/me').reply(auth((config, me) => ok(toUser(me))))

  // 게임 목록 (비로그인도 조회 가능)
  mock.onGet('/games').reply(() => ok(db.games.findAll()))

  // 공지 / 자유게시판
  articleRoutes(mock, 'notices', db.notices, { writeAdminOnly: true })
  articleRoutes(mock, 'posts', db.posts, { writeAdminOnly: false })

  // 1:1문의
  const findInquiry = (config, me) => {
    const item = db.inquiries.findById(idFromUrl(config))
    if (!item) return [null, fail(404, '문의를 찾을 수 없습니다.')]
    if (!isAdmin(me) && item.authorId !== me.id) return [null, fail(403, '본인 문의만 볼 수 있습니다.')]
    return [item, null]
  }

  mock.onGet('/inquiries').reply(
    auth((config, me) => {
      const list = db.inquiries.findAll().filter((q) => isAdmin(me) || q.authorId === me.id)
      return ok(list.sort(byLatest).map(withAuthor))
    }),
  )

  mock.onGet(/\/inquiries\/\d+$/).reply(
    auth((config, me) => {
      const [item, error] = findInquiry(config, me)
      return error ?? ok(withAuthor(item))
    }),
  )

  mock.onPost('/inquiries').reply(
    auth((config, me) => {
      const { title, content } = parseBody(config)
      if (isBlank(title) || isBlank(content)) return fail(400, '제목과 내용을 입력해 주세요.')
      const item = db.inquiries.insert({
        title: title.trim(),
        content,
        authorId: me.id,
        status: 'WAITING',
        answer: null,
        answeredAt: null,
        createdAt: now(),
        updatedAt: null,
      })
      return ok(withAuthor(item), 201)
    }),
  )

  mock.onPut(/\/inquiries\/\d+$/).reply(
    auth((config, me) => {
      const [item, error] = findInquiry(config, me)
      if (error) return error
      if (item.authorId !== me.id) return fail(403, '본인 문의만 수정할 수 있습니다.')
      if (item.status !== 'WAITING') return fail(400, '답변이 완료된 문의는 수정할 수 없습니다.')
      const { title, content } = parseBody(config)
      if (isBlank(title) || isBlank(content)) return fail(400, '제목과 내용을 입력해 주세요.')
      return ok(withAuthor(db.inquiries.update(item.id, { title: title.trim(), content, updatedAt: now() })))
    }),
  )

  mock.onDelete(/\/inquiries\/\d+$/).reply(
    auth((config, me) => {
      const [item, error] = findInquiry(config, me)
      if (error) return error
      if (!isAdmin(me) && item.status !== 'WAITING') return fail(400, '답변이 완료된 문의는 삭제할 수 없습니다.')
      db.inquiries.remove(item.id)
      return [204]
    }),
  )

  mock.onPut(/\/inquiries\/\d+\/answer$/).reply(
    adminOnly((config) => {
      const item = db.inquiries.findById(idFromUrl(config))
      if (!item) return fail(404, '문의를 찾을 수 없습니다.')
      const { answer } = parseBody(config)
      if (isBlank(answer)) return fail(400, '답변 내용을 입력해 주세요.')
      return ok(withAuthor(db.inquiries.update(item.id, { answer, status: 'ANSWERED', answeredAt: now() })))
    }),
  )

  return mock
}
