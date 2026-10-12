import { countDigits, formatNumber } from '../utils/format';

const MAX_DIGITS = 16;
const MAX_HISTORY = 50;

export const ERRORS = {
  divideByZero: '0으로 나눌 수 없습니다',
  invalid: '잘못된 입력입니다',
};

// 계산기 상태 (저장 안 함)
export const INITIAL_STATE = {
  display: '0', // 결과 줄
  expression: '', // 수식 줄
  operand: null, // 앞에서 입력한 값
  operator: null, // '+' | '−' | '×' | '÷'
  lastOperation: null, // '=' 반복용 { operator, value }
  overwrite: false, // 다음 숫자 입력 시 display를 새로 시작
  entered: false, // 연산자 뒤에 두 번째 값을 입력했는지
  evaluated: false, // 방금 '='로 계산을 끝냈는지
  error: null,
};

class CalcError extends Error {}

// 부동소수점 오차 보정 (0.1 + 0.2 → 0.3)
export function roundResult(n) {
  return parseFloat(n.toPrecision(15));
}

export function toDisplayString(n) {
  const r = roundResult(n);
  return Object.is(r, -0) ? '0' : String(r);
}

const fmt = (value) => formatNumber(typeof value === 'number' ? toDisplayString(value) : value);

function ensureFinite(n) {
  if (!Number.isFinite(n)) throw new CalcError(ERRORS.invalid);
  return n;
}

function compute(a, operator, b) {
  switch (operator) {
    case '+':
      return ensureFinite(a + b);
    case '−':
      return ensureFinite(a - b);
    case '×':
      return ensureFinite(a * b);
    case '÷':
      if (b === 0) throw new CalcError(ERRORS.divideByZero);
      return ensureFinite(a / b);
    default:
      return b;
  }
}

const UNARY = {
  reciprocal: {
    label: '1/',
    fn: (x) => {
      if (x === 0) throw new CalcError(ERRORS.invalid);
      return 1 / x;
    },
  },
  square: { label: 'sqr', fn: (x) => ensureFinite(x * x) },
  sqrt: {
    label: '√',
    fn: (x) => {
      if (x < 0) throw new CalcError(ERRORS.invalid);
      return Math.sqrt(x);
    },
  },
};

function errorPatch(e, expression) {
  if (!(e instanceof CalcError)) throw e;
  return { ...INITIAL_STATE, expression, error: e.message };
}

// 오류 상태이거나 방금 계산을 끝낸 경우 새로 시작
const isFresh = (s) => s.error || s.evaluated;
const freshState = (s) => ({ ...INITIAL_STATE, lastOperation: s.error ? null : s.lastOperation });

function inputDigit(s, digit) {
  if (isFresh(s)) return { ...freshState(s), display: digit, entered: true };
  if (s.overwrite) return { display: digit, overwrite: false, entered: true };
  if (countDigits(s.display) >= MAX_DIGITS) return {};
  if (s.display === '0') return { display: digit, entered: true };
  if (s.display === '-0') return { display: `-${digit}`, entered: true };
  return { display: s.display + digit, entered: true };
}

function inputDot(s) {
  if (isFresh(s)) return { ...freshState(s), display: '0.', entered: true };
  if (s.overwrite) return { display: '0.', overwrite: false, entered: true };
  if (s.display.includes('.')) return {};
  return { display: `${s.display}.`, entered: true };
}

function setOperator(s, operator) {
  if (s.error) return {};
  const current = Number(s.display);

  // 연산자를 연달아 누르면 마지막 연산자로 교체
  if (s.operator && !s.entered) {
    return { operator, expression: `${fmt(s.operand)} ${operator}` };
  }

  // 누른 순서대로 계산 (2 + 3 × → 5 ×)
  if (s.operator && s.entered) {
    try {
      const result = toDisplayString(compute(s.operand, s.operator, current));
      return {
        display: result,
        operand: Number(result),
        operator,
        expression: `${fmt(result)} ${operator}`,
        overwrite: true,
        entered: false,
        evaluated: false,
      };
    } catch (e) {
      return errorPatch(e, `${fmt(s.operand)} ${s.operator} ${fmt(s.display)} ${operator}`);
    }
  }

  const value = toDisplayString(current);
  return {
    display: value,
    operand: current,
    operator,
    expression: `${fmt(value)} ${operator}`,
    overwrite: true,
    entered: false,
    evaluated: false,
  };
}

function calculate(s) {
  if (s.error) return { ...INITIAL_STATE };
  const current = Number(s.display);

  let a, operator, b;
  if (s.operator) {
    // '5 + =' → 5 + 5
    a = s.operand;
    operator = s.operator;
    b = s.entered ? current : s.operand;
  } else if (s.lastOperation) {
    // '=' 반복 (2 + 3 = = → 8)
    a = current;
    ({ operator, value: b } = s.lastOperation);
  } else {
    return { display: toDisplayString(current), expression: `${fmt(current)} =`, overwrite: true, evaluated: true };
  }

  const expression = `${fmt(a)} ${operator} ${fmt(b)} =`;
  try {
    const result = toDisplayString(compute(a, operator, b));
    return {
      display: result,
      expression,
      operand: null,
      operator: null,
      lastOperation: { operator, value: b },
      overwrite: true,
      entered: false,
      evaluated: true,
      history: [{ id: crypto.randomUUID(), expression, result }, ...s.history].slice(0, MAX_HISTORY),
    };
  } catch (e) {
    return errorPatch(e, expression);
  }
}

// Windows 방식: + − 는 a × b / 100, × ÷ 는 b / 100, 연산자가 없으면 0
function percent(s) {
  if (s.error) return {};
  const current = Number(s.display);
  let value = 0;
  if (s.operator === '+' || s.operator === '−') value = (s.operand * current) / 100;
  else if (s.operator) value = current / 100;

  const result = toDisplayString(value);
  return {
    display: result,
    expression: s.operator ? `${fmt(s.operand)} ${s.operator} ${fmt(result)}` : fmt(result),
    overwrite: true,
    entered: true,
    evaluated: false,
  };
}

function unary(s, type) {
  if (s.error) return {};

  if (type === 'negate') {
    if (Number(s.display) === 0) return {};
    const display = s.display.startsWith('-') ? s.display.slice(1) : `-${s.display}`;
    return s.evaluated ? { display, expression: '', evaluated: false, entered: true } : { display, entered: true };
  }

  const { label, fn } = UNARY[type];
  const term = `${label}(${fmt(s.display)})`;
  const expression = s.operator ? `${fmt(s.operand)} ${s.operator} ${term}` : term;
  try {
    return {
      display: toDisplayString(fn(Number(s.display))),
      expression,
      overwrite: true,
      entered: true,
      evaluated: false,
    };
  } catch (e) {
    return errorPatch(e, expression);
  }
}

function clearEntry(s) {
  if (isFresh(s)) return { ...INITIAL_STATE };
  return { display: '0', overwrite: false, entered: true };
}

function backspace(s) {
  if (s.error) return {};
  if (s.evaluated) return { expression: '' };
  if (s.overwrite) return {};
  const display = s.display.slice(0, -1);
  return { display: display === '' || display === '-' ? '0' : display };
}

// 기록·메모리 값 불러오기
export function loadValue(s, value) {
  if (isFresh(s)) return { ...freshState(s), display: value, overwrite: true, entered: true };
  return { display: value, overwrite: true, entered: true };
}

// 버튼 동작 → 상태 변경 내용
export function reduce(s, action) {
  switch (action.type) {
    case 'digit':
      return inputDigit(s, action.value);
    case 'dot':
      return inputDot(s);
    case 'operator':
      return setOperator(s, action.value);
    case 'equals':
      return calculate(s);
    case 'percent':
      return percent(s);
    case 'unary':
      return unary(s, action.value);
    case 'clearEntry':
      return clearEntry(s);
    case 'clearAll':
      return { ...INITIAL_STATE };
    case 'backspace':
      return backspace(s);
    default:
      return {};
  }
}
