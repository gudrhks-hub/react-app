// 문자열 격자 → SVG 픽셀 그림
export default function PixelSprite({ sprite, scale = 4, className = '', title }) {
  const { grid, palette } = sprite
  const cols = Math.max(...grid.map((row) => row.length))
  const rows = grid.length

  return (
    <svg
      width={cols * scale}
      height={rows * scale}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {grid.flatMap((row, y) =>
        [...row].map((ch, x) =>
          palette[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[ch]} /> : null,
        ),
      )}
    </svg>
  )
}
