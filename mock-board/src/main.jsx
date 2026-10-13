import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setupMockServer } from './service/mock/server.js'

// 서버가 없으므로 axios 요청을 mock 서버가 가로채 응답한다.
// 실제 서버 연동 시 이 줄만 제거하면 된다.
setupMockServer()

createRoot(document.getElementById('root')).render(<App />)
