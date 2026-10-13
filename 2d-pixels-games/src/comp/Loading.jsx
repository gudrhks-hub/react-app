export default function Loading({ text = 'LOADING' }) {
  return (
    <p className="py-16 text-center text-sm text-neon-green">
      {text}
      <span className="animate-blink">...</span>
    </p>
  )
}
