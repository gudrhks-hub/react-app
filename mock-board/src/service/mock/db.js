import { seedMembers, seedPosts } from './seed'

// localStorage를 서버 DB처럼 사용한다.
const KEYS = {
  members: 'mock-board-db-members',
  posts: 'mock-board-db-posts',
}

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

function createTable(key, seed) {
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
  members: createTable(KEYS.members, seedMembers),
  posts: createTable(KEYS.posts, seedPosts),
}
