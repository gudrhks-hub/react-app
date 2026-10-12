import { useEffect, useRef, useState } from 'react';
import { useCalcStore } from '../stores/calcStore';
import { BUTTON_BY_ID } from '../utils/buttons';
import { keyToButtonId } from '../utils/keyboard';
import Display from '../comp/Display';
import Keypad from '../comp/Keypad';
import MemoryBar from '../comp/MemoryBar';
import SidePanel from '../comp/SidePanel';

const glass = 'rounded-3xl border border-white/30 bg-white/15 shadow-2xl backdrop-blur-xl';

function CalculatorPage() {
  const press = useCalcStore((s) => s.press);
  const [pressedId, setPressedId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const timerRef = useRef(null);

  // 키보드 입력
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // 가계부 입력 칸에 입력할 때는 계산기로 보내지 않음
      if (e.target.closest?.('input, select, textarea')) return;
      const id = keyToButtonId(e.key);
      if (!id) return;
      e.preventDefault(); // 포커스된 버튼이 Enter로 한 번 더 눌리는 것 방지
      press(BUTTON_BY_ID[id].action);

      // 눌림 효과
      setPressedId(id);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setPressedId(null), 120);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(timerRef.current);
    };
  }, [press]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 p-4">
      {/* 배경 빛 */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-300/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative flex w-full max-w-[920px] gap-6">
        {/* 계산기 */}
        <section className={`${glass} w-full max-w-[340px] shrink-0 p-5 mx-auto sm:mx-0`}>
          <div className="flex items-center justify-between px-2">
            <h1 className="text-sm font-semibold tracking-wide text-white/90">Calculator</h1>
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-white/80 transition hover:bg-white/15 sm:hidden"
            >
              가계부 · 기록
            </button>
          </div>
          <Display />
          <MemoryBar />
          <Keypad pressedId={pressedId} />
        </section>

        {/* 기록 / 메모리 패널 (넓은 화면) */}
        {/* 계산기 높이에 맞추고, 기록이 많아지면 패널 안에서 스크롤 */}
        <aside className={`${glass} relative hidden flex-1 sm:block`}>
          <div className="absolute inset-5 flex flex-col">
            <SidePanel />
          </div>
        </aside>
      </div>

      {/* 기록 / 메모리 패널 (모바일) */}
      {panelOpen && (
        <div className="fixed inset-0 z-10 flex items-end bg-black/30 sm:hidden" onClick={() => setPanelOpen(false)}>
          <div
            className={`${glass} flex h-[70vh] w-full flex-col rounded-b-none p-5`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="mb-3 self-end rounded-lg px-2 py-1 text-xs font-medium text-white/80 hover:bg-white/15"
            >
              닫기
            </button>
            <SidePanel />
          </div>
        </div>
      )}
    </div>
  );
}

export default CalculatorPage;
