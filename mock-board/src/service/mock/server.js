import AxiosMockAdapter from 'axios-mock-adapter'
import api from '../api'
import { db } from './db'

const DELAY = 300
const TOKEN_PREFIX = 'mock-token-'

// ---------- 공통 헬퍼 ----------
const ok = (data, status = 200) => [status, data]
const fail = (status, message) => [status, { message }]

// 비밀번호를 제외한 회원 정보
const toMember = ({ password, ...member }) => member

const toPost = (post) => {
  const author = db.members.findById(post.authorId)
  return { ...post, authorName: author ? author.name : '(탈퇴회원)' }
}

const issueToken = (memberId) => TOKEN_PREFIX + btoa(`${memberId}:${Date.now()}`)

// Authorization 헤더의 토큰으로 로그인 회원을 찾는다.
function getLoginMember(config) {
  const header = config.headers?.Authorization ?? ''
  const token = header.replace('Bearer ', '')
  if (!token.startsWith(TOKEN_PREFIX)) return null
  try {
    const [memberId] = atob(token.slice(TOKEN_PREFIX.length)).split(':')
    return db.members.findById(Number(memberId))
  } catch {
    return null
  }
}

const parseBody = (config) => (config.data ? JSON.parse(config.data) : {})
const idFromUrl = (config) => Number(config.url.split('/').pop())
const isBlank = (value) => !value || !String(value).trim()
const isValidRole = (role) => ['ADMIN', 'USER'].includes(role)

// 로그인 / 운영자 체크를 감싼 핸들러
function auth(handler, { admin = false } = {}) {
  return (config) => {
    const me = getLoginMember(config)
    if (!me) return fail(401, '로그인이 필요합니다.')
    if (admin && me.role !== 'ADMIN') return fail(403, '권한이 없습니다.')
    return handler(config, me)
  }
}

const adminOnly = (handler) => auth(handler, { admin: true })

// ---------- 라우트 ----------
export function setupMockServer() {
  const mock = new AxiosMockAdapter(api, { delayResponse: DELAY })

  // 인증
  mock.onPost('/auth/login').reply((config) => {
    const { username, password } = parseBody(config)
    const member = db.members.findAll().find((m) => m.username === username && m.password === password)
    if (!member) return fail(401, '아이디 또는 비밀번호가 올바르지 않습니다.')
    return ok({ token: issueToken(member.id), user: toMember(member) })
  })

  mock.onGet('/auth/me').reply(auth((config, me) => ok(toMember(me))))

  // 게시글 (목록은 비로그인도 조회 가능)
  mock.onGet('/posts').reply(() => {
    const posts = db.posts.findAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return ok(posts.map(toPost))
  })

  mock.onGet(/\/posts\/\d+$/).reply(
    auth((config) => {
      const post = db.posts.findById(idFromUrl(config))
      if (!post) return fail(404, '게시글을 찾을 수 없습니다.')
      // 수정 화면에서 불러올 때는 조회 수를 올리지 않는다.
      if (config.params?.increaseView === false) return ok(toPost(post))
      return ok(toPost(db.posts.update(post.id, { views: post.views + 1 })))
    }),
  )

  mock.onPost('/posts').reply(
    auth((config, me) => {
      const { title, content } = parseBody(config)
      if (isBlank(title) || isBlank(content)) return fail(400, '제목과 내용을 입력해 주세요.')
      const post = db.posts.insert({
        title: title.trim(),
        content,
        views: 0,
        authorId: me.id,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      })
      return ok(toPost(post), 201)
    }),
  )

  mock.onPut(/\/posts\/\d+$/).reply(
    auth((config, me) => {
      const post = db.posts.findById(idFromUrl(config))
      if (!post) return fail(404, '게시글을 찾을 수 없습니다.')
      if (post.authorId !== me.id && me.role !== 'ADMIN') return fail(403, '수정 권한이 없습니다.')
      const { title, content } = parseBody(config)
      if (isBlank(title) || isBlank(content)) return fail(400, '제목과 내용을 입력해 주세요.')
      const updated = db.posts.update(post.id, { title: title.trim(), content, updatedAt: new Date().toISOString() })
      return ok(toPost(updated))
    }),
  )

  mock.onDelete(/\/posts\/\d+$/).reply(
    auth((config, me) => {
      const post = db.posts.findById(idFromUrl(config))
      if (!post) return fail(404, '게시글을 찾을 수 없습니다.')
      if (post.authorId !== me.id && me.role !== 'ADMIN') return fail(403, '삭제 권한이 없습니다.')
      db.posts.remove(post.id)
      return [204]
    }),
  )

  // 회원
  mock.onGet('/members').reply(auth(() => ok(db.members.findAll().map(toMember))))

  mock.onGet(/\/members\/\d+$/).reply(
    adminOnly((config) => {
      const member = db.members.findById(idFromUrl(config))
      if (!member) return fail(404, '회원을 찾을 수 없습니다.')
      return ok(toMember(member))
    }),
  )

  mock.onPost('/members').reply(
    adminOnly((config) => {
      const { username, password, name, role } = parseBody(config)
      if ([username, password, name, role].some(isBlank)) return fail(400, '모든 항목을 입력해 주세요.')
      if (!isValidRole(role)) return fail(400, '권한 값이 올바르지 않습니다.')
      const loginId = username.trim()
      if (db.members.findAll().some((m) => m.username === loginId)) return fail(409, '이미 사용 중인 아이디입니다.')
      const member = db.members.insert({
        username: loginId,
        password,
        name: name.trim(),
        role,
        createdAt: new Date().toISOString(),
      })
      return ok(toMember(member), 201)
    }),
  )

  mock.onPut(/\/members\/\d+$/).reply(
    adminOnly((config) => {
      const member = db.members.findById(idFromUrl(config))
      if (!member) return fail(404, '회원을 찾을 수 없습니다.')
      const { password, name, role } = parseBody(config)
      if (isBlank(name) || isBlank(role)) return fail(400, '이름과 권한을 입력해 주세요.')
      if (!isValidRole(role)) return fail(400, '권한 값이 올바르지 않습니다.')
      const data = { name: name.trim(), role }
      if (!isBlank(password)) data.password = password // 빈칸이면 기존 비밀번호 유지
      return ok(toMember(db.members.update(member.id, data)))
    }),
  )

  mock.onDelete(/\/members\/\d+$/).reply(
    adminOnly((config, me) => {
      const id = idFromUrl(config)
      if (id === me.id) return fail(400, '로그인한 본인은 삭제할 수 없습니다.')
      if (!db.members.remove(id)) return fail(404, '회원을 찾을 수 없습니다.')
      return [204]
    }),
  )

  return mock
}
