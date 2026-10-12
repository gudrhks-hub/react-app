const KIND_CLASS = {
  number: 'bg-white/20 text-white text-xl hover:bg-white/30',
  function: 'bg-white/10 text-white/80 text-base hover:bg-white/20',
  operator: 'bg-white/25 text-white text-2xl hover:bg-white/35',
  equals: 'bg-pink-400/80 text-white text-2xl font-semibold hover:bg-pink-400 shadow-lg shadow-pink-500/30',
};

function CalcButton({ label, kind, onClick, pressed = false, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-14 rounded-2xl border border-white/10 backdrop-blur-md transition duration-100 select-none active:scale-95 ${
        KIND_CLASS[kind]
      } ${pressed ? 'scale-95 brightness-125' : ''} ${active ? 'ring-2 ring-white/70' : ''}`}
    >
      {label}
    </button>
  );
}

export default CalcButton;
