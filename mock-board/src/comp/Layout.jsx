import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import UserMenu from './UserMenu'

const menus = [
  { to: '/board', label: '게시판' },
  { to: '/members', label: '회원정보' },
]

export default function Layout() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-8 px-4">
          <span className="text-lg font-bold text-indigo-600">Mock Board</span>
          <nav className="flex gap-1">
            {menus.map((menu) => (
              <NavLink
                key={menu.to}
                to={menu.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {menu.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
