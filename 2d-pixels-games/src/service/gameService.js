import api from './api'

export const gameService = {
  getList: () => api.get('/games').then((res) => res.data),
}
