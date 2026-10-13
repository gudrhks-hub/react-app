import api from './api'

// 공지 / 자유게시판 공용 서비스
function createArticleService(path) {
  return {
    getList: () => api.get(`/${path}`).then((res) => res.data),
    getDetail: (id, increaseView = true) =>
      api.get(`/${path}/${id}`, { params: { increaseView } }).then((res) => res.data),
    create: (article) => api.post(`/${path}`, article).then((res) => res.data),
    update: (id, article) => api.put(`/${path}/${id}`, article).then((res) => res.data),
    remove: (id) => api.delete(`/${path}/${id}`),
  }
}

export const noticeService = createArticleService('notices')
export const postService = createArticleService('posts')
