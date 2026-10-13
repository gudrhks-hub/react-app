import api from './api'

export const inquiryService = {
  getList: () => api.get('/inquiries').then((res) => res.data),
  getDetail: (id) => api.get(`/inquiries/${id}`).then((res) => res.data),
  create: (inquiry) => api.post('/inquiries', inquiry).then((res) => res.data),
  update: (id, inquiry) => api.put(`/inquiries/${id}`, inquiry).then((res) => res.data),
  remove: (id) => api.delete(`/inquiries/${id}`),
  answer: (id, answer) => api.put(`/inquiries/${id}/answer`, { answer }).then((res) => res.data),
}
