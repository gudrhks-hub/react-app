import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import RoleBadge from './RoleBadge'

function UserIcon() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
      </svg>
    </span>
  )
}

// 헤더 우측: 회원 아이콘 + 이름 + 권한 배지, 클릭 시 드롭다운
export default function UserMenu({ user }) {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // 바깥 클릭 / Esc 로 닫기
  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const goMembers = () => {
    setOpen(false)
    navigate('/members')
  }

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <UserIcon />
        <span className="font-medium">{user.name}</span>
        <RoleBadge role={user.role} />
        <span className={`text-xs text-slate-400 transition ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 z-10 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          <button role="menuitem" onClick={goMembers} className="block w-full px-4 py-2 text-left hover:bg-slate-50">
            회원정보
          </button>
          <button
            role="menuitem"
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
