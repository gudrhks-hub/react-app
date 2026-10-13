import { NavLink } from 'react-router-dom'

const menus = [
  { to: '/notices', label: '공지사항', color: 'text-neon-yellow border-neon-yellow' },
  { to: '/board', label: '자유게시판', color: 'text-neon-green border-neon-green' },
  { to: '/inquiries', label: '1:1문의', color: 'text-neon-sky border-neon-sky' },
]

// 공지사항 / 자유게시판 / 1:1문의 메뉴 바
// 비로그인 상태로 누르면 RequireAuth가 메인으로 보내 로그인 안내를 띄운다.
export default function MenuBar() {
  return (
    <nav className="flex flex-wrap justify-center gap-3 border-y-4 border-dashed border-zinc-700 py-4">
      {menus.map((menu) => (
        <NavLink
          key={menu.to}
          to={menu.to}
          className={({ isActive }) =>
            `border-2 px-5 py-2 text-sm font-bold ${menu.color} ${
              isActive ? 'bg-white/10' : 'hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? '▶ ' : ''}
              {menu.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
