import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './comp/Layout'
import RequireAdmin from './comp/RequireAdmin'
import RequireAuth from './comp/RequireAuth'
import { BoardDetailPage, BoardFormPage, BoardListPage } from './pages/BoardPages'
import { InquiryDetailPage, InquiryFormPage, InquiryListPage } from './pages/InquiryPages'
import MainPage from './pages/MainPage'
import { NoticeDetailPage, NoticeFormPage, NoticeListPage } from './pages/NoticePages'
import SignupPage from './pages/SignupPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* 비로그인도 볼 수 있는 화면 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 로그인 필요 */}
          <Route element={<RequireAuth />}>
            <Route path="/notices" element={<NoticeListPage />} />
            <Route path="/notices/:id" element={<NoticeDetailPage />} />
            <Route element={<RequireAdmin />}>
              <Route path="/notices/new" element={<NoticeFormPage />} />
              <Route path="/notices/:id/edit" element={<NoticeFormPage />} />
            </Route>

            <Route path="/board" element={<BoardListPage />} />
            <Route path="/board/new" element={<BoardFormPage />} />
            <Route path="/board/:id" element={<BoardDetailPage />} />
            <Route path="/board/:id/edit" element={<BoardFormPage />} />

            <Route path="/inquiries" element={<InquiryListPage />} />
            <Route path="/inquiries/new" element={<InquiryFormPage />} />
            <Route path="/inquiries/:id" element={<InquiryDetailPage />} />
            <Route path="/inquiries/:id/edit" element={<InquiryFormPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
