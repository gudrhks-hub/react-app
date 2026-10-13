import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gameService } from '../service/gameService'
import { useAuthStore } from '../stores/authStore'
import GameIcon from '../comp/GameIcon'
import GameStart from '../comp/GameStart'
import LoginBox, { LOGIN_INPUT_ID } from '../comp/LoginBox'
import MenuBar from '../comp/MenuBar'
import PixelSprite from '../comp/PixelSprite'
import Win98Alert from '../comp/Win98Alert'
import Win98Window from '../comp/Win98Window'
import { coin, computerIcon, ghost, plumber, slime } from '../comp/sprites'

const focusLogin = () => {
  const input = document.getElementById(LOGIN_INPUT_ID)
  input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  input?.focus({ preventScroll: true })
}

export default function MainPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const location = useLocation()
  const needLogin = location.state?.needLogin
  const from = location.state?.from

  const [games, setGames] = useState([])
  const [loadingGames, setLoadingGames] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [alertGame, setAlertGame] = useState(null)
  const gamesRef = useRef(null)

  useEffect(() => {
    gameService
      .getList()
      .then(setGames)
      .catch(() => setGames([]))
      .finally(() => setLoadingGames(false))
  }, [])

  // 로그인이 필요한 화면에서 넘어왔으면 로그인 폼에 포커스
  useEffect(() => {
    if (needLogin && !user) focusLogin()
  }, [needLogin, user])

  const handleStart = () => {
    if (!user) focusLogin()
    else gamesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // 로그인 후 원래 가려던 화면이 있으면 이동
  const handleLogin = () => {
    if (from) navigate(from, { replace: true })
    else navigate('/', { replace: true, state: null })
  }

  return (
    <div className="relative space-y-12">
      {/* 픽셀 캐릭터 (소수만 배치) */}
      <PixelSprite sprite={plumber} scale={5} title="배관공" className="animate-bob absolute top-40 left-0 hidden md:block" />
      <PixelSprite sprite={slime} scale={4} className="animate-bob absolute top-56 right-4 hidden md:block [animation-delay:0.4s]" />
      <PixelSprite sprite={ghost} scale={4} className="animate-bob absolute top-0 right-16 hidden md:block [animation-delay:0.8s]" />
      <PixelSprite sprite={coin} scale={4} className="animate-bob absolute top-4 left-20 hidden md:block [animation-delay:0.2s]" />

      {/* ① GAME START */}
      <section className="pt-4">
        <GameStart onClick={handleStart} />
      </section>

      {/* ② 로그인 */}
      <section>
        <LoginBox notice={needLogin && !user ? '로그인이 필요합니다.' : ''} onLogin={handleLogin} />
      </section>

      {/* ③ 메뉴 바 */}
      <MenuBar />

      {/* ④ 게임 목록 (Windows 98 창) */}
      <section ref={gamesRef} className="relative scroll-mt-8">
        <PixelSprite sprite={plumber} scale={3} className="absolute -top-[54px] right-6 md:hidden" />
        <Win98Window
          title="GAMES.EXE"
          icon={<PixelSprite sprite={computerIcon('#38bdf8')} scale={1} />}
          status={loadingGames ? '불러오는 중...' : `${games.length}개 개체`}
        >
          <div className="flex min-h-52 flex-wrap content-start gap-x-4 gap-y-5 p-5" onClick={(e) => e.target === e.currentTarget && setSelectedId(null)}>
            {games.map((game) => (
              <GameIcon
                key={game.id}
                game={game}
                selected={selectedId === game.id}
                onSelect={() => setSelectedId(game.id)}
                onOpen={() => setAlertGame(game)}
              />
            ))}
          </div>
        </Win98Window>
        <p className="mt-2 text-center text-xs text-zinc-500">아이콘을 더블클릭하면 게임이 실행됩니다.</p>
      </section>

      {alertGame && (
        <Win98Alert
          title="GAMES.EXE"
          message={`「${alertGame.title}」은(는)\n준비 중인 게임입니다.`}
          onClose={() => setAlertGame(null)}
        />
      )}
    </div>
  )
}
