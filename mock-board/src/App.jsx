import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './comp/Layout'
import RequireAdmin from './comp/RequireAdmin'
import RequireAuth from './comp/RequireAuth'
import BoardDetailPage from './pages/BoardDetailPage'
import BoardFormPage from './pages/BoardFormPage'
import BoardListPage from './pages/BoardListPage'
import LoginPage from './pages/LoginPage'
import MemberFormPage from './pages/MemberFormPage'
import MemberListPage from './pages/MemberListPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          {/* 첫 화면: 게시판 목록은 비로그인도 볼 수 있다 */}
          <Route path="/board" element={<BoardListPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/board/new" element={<BoardFormPage />} />
            <Route path="/board/:id" element={<BoardDetailPage />} />
            <Route path="/board/:id/edit" element={<BoardFormPage />} />
            <Route path="/members" element={<MemberListPage />} />
            <Route element={<RequireAdmin />}>
              <Route path="/members/new" element={<MemberFormPage />} />
              <Route path="/members/:id/edit" element={<MemberFormPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
