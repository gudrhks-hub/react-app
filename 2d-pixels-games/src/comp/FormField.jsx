export const inputClass =
  'w-full border-2 border-zinc-500 bg-zinc-950 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-neon-yellow'

export default function FormField({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-neon-sky">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  )
}
