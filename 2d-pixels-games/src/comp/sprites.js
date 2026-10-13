// 픽셀 캐릭터 도트 데이터
// grid: 한 글자 = 한 픽셀, '.' 은 투명. palette: 글자 → 색

// 마리오 느낌의 오리지널 배관공 (빨간 모자, 콧수염, 멜빵 바지)
export const plumber = {
  palette: { R: '#e52521', W: '#ffffff', S: '#fbc59a', H: '#6b3a1e', K: '#000000', N: '#f4a27a', B: '#2b59c3', Y: '#facc15', O: '#7c4a1e' },
  grid: [
    '....RRRRRR....',
    '...RRRRRRRR...',
    '..RRRRWWRRRR..',
    '..RRRRWWRRRR..',
    '.RRRRRRRRRRRR.',
    '..HSSSSSSSSH..',
    '..SSKSSSSKSS..',
    '..SSKSSSSKSS..',
    '..SSSSNNSSSS..',
    '..SHHHHHHHHS..',
    '...SSSSSSSS...',
    '..RRBRRRRBRR..',
    '.RRRBYBBYBRRR.',
    'SSRBBBBBBBBRSS',
    'SS.BBBBBBBB.SS',
    '...BBB..BBB...',
    '..OOOO..OOOO..',
    '.OOOOO..OOOOO.',
  ],
}

export const slime = {
  palette: { G: '#4ade80', L: '#bbf7d0', K: '#000000', W: '#ffffff', D: '#15803d' },
  grid: [
    '....GGGG....',
    '..GGGGGGGG..',
    '.GGLGGGGGGG.',
    '.GLLGGGGGGG.',
    'GGGKWGGGKWGG',
    'GGGKKGGGKKGG',
    'GGGGGGGGGGGG',
    'GGGGGDDGGGGG',
    '.GGGGGGGGGG.',
  ],
}

export const ghost = {
  palette: { W: '#e0e7ff', K: '#000000', B: '#38bdf8', P: '#f9a8d4' },
  grid: [
    '....WWWW....',
    '..WWWWWWWW..',
    '.WWWWWWWWWW.',
    '.WWKKWWKKWW.',
    '.WWKBWWKBWW.',
    'WWWWWWWWWWWW',
    'WWPWWWWWWPWW',
    'WWWWWWWWWWWW',
    'WWWWWWWWWWWW',
    'WW.WWW.WWW.W',
    'W...W...W...',
  ],
}

export const coin = {
  palette: { Y: '#facc15', W: '#fef9c3', O: '#ca8a04' },
  grid: [
    '..YYYY..',
    '.YYWWYY.',
    'YYWYYOYY',
    'YYWYYOYY',
    'YYWYYOYY',
    'YYWYYOYY',
    'YYYYYOYY',
    '.YYOOYY.',
    '..YYYY..',
  ],
}

export const heart = {
  palette: { R: '#f87171', W: '#fecaca' },
  grid: [
    '.RR...RR.',
    'RRRR.RRRR',
    'RWRRRRRRR',
    'RRRRRRRRR',
    '.RRRRRRR.',
    '..RRRRR..',
    '...RRR...',
    '....R....',
  ],
}

// 컴퓨터 모니터 아이콘 (S = 화면 색은 게임마다 다르게)
export function computerIcon(screenColor) {
  return {
    palette: { K: '#000000', G: '#c0c0c0', D: '#808080', S: screenColor, L: '#ffffff' },
    grid: [
      '..KKKKKKKKKKKK..',
      '..KGGGGGGGGGGK..',
      '..KGKKKKKKKKGK..',
      '..KGKLSSSSSKGK..',
      '..KGKSLSSSSKGK..',
      '..KGKSSSSSSKGK..',
      '..KGKSSSSSSKGK..',
      '..KGKKKKKKKKGK..',
      '..KGGGGGGGDGGK..',
      '..KKKKKKKKKKKK..',
      '......KGGK......',
      '....KKKKKKKK....',
      '...KGGGGGGGGK...',
      '...KDDDDDDDDK...',
      '...KKKKKKKKKK...',
    ],
  }
}
