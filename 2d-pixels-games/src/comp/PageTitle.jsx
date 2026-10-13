export default function PageTitle({ title, sub, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-neon-yellow">▶ {title}</h1>
        {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
      </div>
      <div className="flex gap-3">{children}</div>
    </div>
  )
}
