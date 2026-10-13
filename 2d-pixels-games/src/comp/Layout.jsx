import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import MenuBar from './MenuBar'
import UserMenu from './UserMenu'

export default function Layout() {
  const user = useAuthStore((s) => s.user)
  const { pathname } = useLocation()
  const isMain = pathname === '/'

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold tracking-wider">
          <span className="text-neon-yellow">2D</span> <span className="text-neon-green">PIXELS</span>{' '}
          <span className="text-neon-sky">GAMES</span>
        </Link>
        {user ? (
          <UserMenu user={user} />
        ) : (
          !isMain && (
            <Link to="/" className="text-sm text-neon-yellow hover:underline">
              ▶ LOGIN
            </Link>
          )
        )}
      </header>

      {/* 메인은 화면 중간에 메뉴 바가 있으므로 그 외 화면에서만 상단에 표시 */}
      {!isMain && (
        <div className="mx-auto max-w-5xl px-4">
          <MenuBar />
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="py-8 text-center text-xs text-zinc-600">© 2026 2D PIXELS GAMES · INSERT COIN TO CONTINUE</footer>
    </div>
  )
}
