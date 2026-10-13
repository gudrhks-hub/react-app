import api from './api'

export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }).then((res) => res.data),
  signup: (user) => api.post('/auth/signup', user).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
}
