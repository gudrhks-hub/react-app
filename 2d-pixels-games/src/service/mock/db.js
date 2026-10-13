import { seedGames, seedInquiries, seedNotices, seedPosts, seedUsers } from './seed'

function load(key, seed) {
  const saved = localStorage.getItem(key)
  if (saved) return JSON.parse(saved)
  localStorage.setItem(key, JSON.stringify(seed))
  return structuredClone(seed)
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

// localStorage를 서버 DB 테이블처럼 사용한다.
function createTable(name, seed) {
  const key = `pixel-games-db-${name}`
  return {
    findAll: () => load(key, seed),
    findById: (id) => load(key, seed).find((item) => item.id === id) ?? null,
    insert(data) {
      const list = load(key, seed)
      const item = { ...data, id: nextId(list) }
      list.push(item)
      save(key, list)
      return item
    },
    update(id, data) {
      const list = load(key, seed)
      const index = list.findIndex((item) => item.id === id)
      if (index < 0) return null
      list[index] = { ...list[index], ...data, id }
      save(key, list)
      return list[index]
    },
    remove(id) {
      const list = load(key, seed)
      const next = list.filter((item) => item.id !== id)
      save(key, next)
      return next.length !== list.length
    },
  }
}

export const db = {
  users: createTable('users', seedUsers),
  games: createTable('games', seedGames),
  notices: createTable('notices', seedNotices),
  posts: createTable('posts', seedPosts),
  inquiries: createTable('inquiries', seedInquiries),
}
