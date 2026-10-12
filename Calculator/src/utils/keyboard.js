// 키보드 키 → 버튼 id
const KEY_TO_BUTTON = {
  '.': 'dot',
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div',
  '=': 'equals',
  Enter: 'equals',
  '%': 'percent',
  Backspace: 'back',
  Delete: 'ce',
  Escape: 'c',
};

export function keyToButtonId(key) {
  if (/^[0-9]$/.test(key)) return key;
  return KEY_TO_BUTTON[key] ?? null;
}
