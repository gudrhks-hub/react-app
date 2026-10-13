import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

// 실제 서버 연동 시 baseURL만 서버 주소로 바꾸면 된다.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// 요청마다 로그인 토큰을 헤더에 첨부
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401이면 로그아웃 처리, 에러 메시지는 서버 응답의 message로 통일
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401 && !error.config?.url?.endsWith('/auth/login')) {
      useAuthStore.getState().logout()
    }
    error.message = error.response?.data?.message ?? '서버와 통신 중 오류가 발생했습니다.'
    return Promise.reject(error)
  },
)

export default api
