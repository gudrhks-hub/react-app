const variants = {
  primary: 'bg-neon-yellow text-black shadow-[4px_4px_0_0_#a16207] hover:bg-yellow-300',
  secondary: 'border-2 border-white bg-black text-white shadow-[4px_4px_0_0_#3f3f46] hover:bg-zinc-900',
  danger: 'bg-neon-red text-black shadow-[4px_4px_0_0_#991b1b] hover:bg-red-300',
  green: 'bg-neon-green text-black shadow-[4px_4px_0_0_#166534] hover:bg-green-300',
}

// 각진 픽셀 버튼 (누르면 그림자만큼 눌리는 효과)
export default function PixelButton({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 text-sm font-bold transition-none active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
