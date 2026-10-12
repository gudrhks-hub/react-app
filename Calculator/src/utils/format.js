// 천 단위 콤마 (입력 중인 '12.' 같은 값도 그대로 유지)
export function formatNumber(str) {
  if (/e/i.test(str)) return str;
  const negative = str.startsWith('-');
  const [int, dec] = (negative ? str.slice(1) : str).split('.');
  const intWithComma = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}${intWithComma}${dec !== undefined ? `.${dec}` : ''}`;
}

// 숫자 자릿수 ('-', '.' 제외)
export function countDigits(str) {
  return str.replace(/[-.]/g, '').length;
}

// 금액 표시 ('-12,000원' / '+50,000원' / 부호 없이 '2,180,000원')
export function formatWon(amount, type) {
  const sign = type === 'income' ? '+' : type === 'expense' ? '-' : '';
  return `${sign}${amount.toLocaleString('ko-KR')}원`;
}

// 결과 길이에 따라 글자 크기 조절
export function displaySizeClass(text) {
  if (text.length <= 10) return 'text-5xl';
  if (text.length <= 14) return 'text-4xl';
  if (text.length <= 18) return 'text-3xl';
  return 'text-2xl';
}
