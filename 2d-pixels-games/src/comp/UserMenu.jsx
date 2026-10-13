import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { isAdmin, ROLES } from '../utils/role'
import PixelSprite from './PixelSprite'
import { heart } from './sprites'

// 헤더 우측: 닉네임 클릭 시 로그아웃 드롭다운
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

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-white/10"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <PixelSprite sprite={heart} scale={2} />
        <span className="font-bold">{user.nickname}</span>
        <span className={`text-xs ${isAdmin(user) ? 'text-neon-red' : 'text-neon-green'}`}>[{ROLES[user.role]}]</span>
        <span className="text-xs text-zinc-500">▾</span>
      </button>

      {open && (
        <div role="menu" className="pixel-panel absolute top-full right-0 z-20 mt-2 w-36 py-1 text-sm">
          <button role="menuitem" onClick={handleLogout} className="block w-full px-4 py-2 text-left text-neon-red hover:bg-white/10">
            ▶ LOGOUT
          </button>
        </div>
      )}
    </div>
  )
}
