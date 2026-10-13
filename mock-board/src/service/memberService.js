import api from './api'

export const memberService = {
  getList: () => api.get('/members').then((res) => res.data),
  getDetail: (id) => api.get(`/members/${id}`).then((res) => res.data),
  create: (member) => api.post('/members', member).then((res) => res.data),
  update: (id, member) => api.put(`/members/${id}`, member).then((res) => res.data),
  remove: (id) => api.delete(`/members/${id}`),
}
