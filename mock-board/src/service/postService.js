import api from './api'

export const postService = {
  getList: () => api.get('/posts').then((res) => res.data),
  getDetail: (id, increaseView = true) => api.get(`/posts/${id}`, { params: { increaseView } }).then((res) => res.data),
  create: (post) => api.post('/posts', post).then((res) => res.data),
  update: (id, post) => api.put(`/posts/${id}`, post).then((res) => res.data),
  remove: (id) => api.delete(`/posts/${id}`),
}
