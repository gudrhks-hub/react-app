const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
  danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
}

export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
