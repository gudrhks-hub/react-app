export default function ErrorMessage({ message }) {
  if (!message) return null
  return <p className="border-2 border-neon-red px-3 py-2 text-sm text-neon-red">! {message}</p>
}
