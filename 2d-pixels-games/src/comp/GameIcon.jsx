import PixelSprite from './PixelSprite'
import { computerIcon } from './sprites'

// 컴퓨터 모양 게임 아이콘 (클릭: 선택, 더블클릭/Enter: 실행)
export default function GameIcon({ game, selected, onSelect, onOpen }) {
  return (
    <button
      onClick={onSelect}
      onDoubleClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="flex w-24 flex-col items-center gap-1 p-1 outline-none"
      title={`${game.title} (${game.genre})`}
    >
      <span className={selected ? 'opacity-70 mix-blend-multiply' : ''}>
        <PixelSprite sprite={computerIcon(game.color)} scale={3} />
      </span>
      <span
        className={`px-1 text-center text-xs leading-tight text-black ${
          selected ? 'bg-win-navy text-white outline-1 outline-dotted outline-white' : ''
        }`}
      >
        {game.title}
      </span>
    </button>
  )
}
