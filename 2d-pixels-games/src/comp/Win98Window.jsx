// Windows 98 스타일 창 틀
export default function Win98Window({ title, icon, status, children, className = '' }) {
  return (
    <section className={`win98 ${className}`}>
      <div className="win98-title">
        <span className="flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        {/* 장식용 버튼 */}
        <span className="flex gap-0.5" aria-hidden="true">
          {['_', '□', '×'].map((c) => (
            <span key={c} className="win98-btn flex h-5 w-5 items-center justify-center text-xs leading-none">
              {c}
            </span>
          ))}
        </span>
      </div>
      <div className="flex gap-3 px-1 py-1 text-xs">
        <span className="underline">파일(F)</span>
        <span className="underline">편집(E)</span>
        <span className="underline">보기(V)</span>
        <span className="underline">도움말(H)</span>
      </div>
      <div className="win98-inset">{children}</div>
      {status && (
        <div className="mt-1 border border-t-zinc-500 border-l-zinc-500 border-r-white border-b-white px-2 py-0.5 text-xs">
          {status}
        </div>
      )}
    </section>
  )
}
