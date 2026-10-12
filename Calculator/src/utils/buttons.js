// 키패드 버튼 정의 (Windows 표준 모드 배치)
// kind: number | function | operator | equals
const digit = (d) => ({ id: d, label: d, kind: 'number', action: { type: 'digit', value: d } });
const op = (id, label) => ({ id, label, kind: 'operator', action: { type: 'operator', value: label } });
const fn = (id, label, action) => ({ id, label, kind: 'function', action });

export const BUTTONS = [
  fn('percent', '%', { type: 'percent' }),
  fn('ce', 'CE', { type: 'clearEntry' }),
  fn('c', 'C', { type: 'clearAll' }),
  fn('back', '⌫', { type: 'backspace' }),

  fn('reciprocal', '1/x', { type: 'unary', value: 'reciprocal' }),
  fn('square', 'x²', { type: 'unary', value: 'square' }),
  fn('sqrt', '√x', { type: 'unary', value: 'sqrt' }),
  op('div', '÷'),

  digit('7'), digit('8'), digit('9'), op('mul', '×'),
  digit('4'), digit('5'), digit('6'), op('sub', '−'),
  digit('1'), digit('2'), digit('3'), op('add', '+'),

  { id: 'negate', label: '±', kind: 'number', action: { type: 'unary', value: 'negate' } },
  digit('0'),
  { id: 'dot', label: '.', kind: 'number', action: { type: 'dot' } },
  { id: 'equals', label: '=', kind: 'equals', action: { type: 'equals' } },
];

export const BUTTON_BY_ID = Object.fromEntries(BUTTONS.map((b) => [b.id, b]));
