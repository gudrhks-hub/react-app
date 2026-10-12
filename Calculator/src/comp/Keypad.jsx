import { useCalcStore } from '../stores/calcStore';
import { BUTTONS } from '../utils/buttons';
import CalcButton from './CalcButton';

function Keypad({ pressedId }) {
  const press = useCalcStore((s) => s.press);
  const operator = useCalcStore((s) => s.operator);
  const entered = useCalcStore((s) => s.entered);

  return (
    <div className="grid grid-cols-4 gap-2">
      {BUTTONS.map((btn) => (
        <CalcButton
          key={btn.id}
          label={btn.label}
          kind={btn.kind}
          onClick={() => press(btn.action)}
          pressed={pressedId === btn.id}
          active={btn.kind === 'operator' && operator === btn.label && !entered}
        />
      ))}
    </div>
  );
}

export default Keypad;
