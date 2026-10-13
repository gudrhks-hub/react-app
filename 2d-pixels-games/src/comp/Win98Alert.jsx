import { useEffect, useRef } from 'react'

// Windows 98 스타일 알림창
export default function Win98Alert({ title = '알림', message, onClose }) {
  const okRef = useRef(null)

  useEffect(() => {
    okRef.current?.focus()
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div role="alertdialog" aria-label={title} className="win98 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="win98-title">
          <span>{title}</span>
          <button onClick={onClose} className="win98-btn flex h-5 w-5 items-center justify-center text-xs leading-none">
            ×
          </button>
        </div>
        <div className="flex items-center gap-4 px-4 py-5 text-sm">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-blue-600 font-bold text-white">
            i
          </span>
          <p className="whitespace-pre-line">{message}</p>
        </div>
        <div className="flex justify-center pb-3">
          <button ref={okRef} onClick={onClose} className="win98-btn w-20 py-1 text-sm focus:outline-1 focus:outline-dotted focus:-outline-offset-4 focus:outline-black">
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
