// 픽셀로 그린 동그라미 + GAME START
const SIZE = 25
const CENTER = (SIZE - 1) / 2
const RADIUS = 12

// 격자 칸마다 테두리 / 안쪽 / 바깥 판정
const cells = []
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const d = Math.hypot(x - CENTER, y - CENTER)
    if (d <= RADIUS - 1.6) cells.push({ x, y, type: 'inner' })
    else if (d <= RADIUS + 0.4) cells.push({ x, y, type: 'ring' })
  }
}

export default function GameStart({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative mx-auto block h-56 w-56 cursor-pointer sm:h-64 sm:w-64"
      aria-label="GAME START"
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} shapeRendering="crispEdges" className="absolute inset-0 h-full w-full">
        {cells.map(({ x, y, type }) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1"
            height="1"
            className={
              type === 'ring'
                ? 'fill-neon-yellow'
                : (x + y) % 2 === 0
                  ? 'fill-zinc-900 group-hover:fill-zinc-800'
                  : 'fill-zinc-950 group-hover:fill-zinc-900'
            }
          />
        ))}
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="text-3xl font-bold tracking-widest text-neon-yellow sm:text-4xl">GAME</span>
        <span className="animate-blink text-2xl font-bold tracking-widest text-white sm:text-3xl">START</span>
        <span className="mt-1 text-xs text-zinc-400">▶ PRESS</span>
      </span>
    </button>
  )
}
