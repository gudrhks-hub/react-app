# Calculator 개발 기획 문서

## 1. 개요

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | `Calculator` (폴더명. `package.json`의 `name`은 npm 규칙상 소문자 `calculator`) |
| 서비스명 | Calculator |
| 목적 | Windows 기본 계산기 **표준 모드** 수준의 기능을 가진 웹 계산기 |
| 디자인 방향 | 글래스모피즘 (그라데이션 배경 + 반투명 유리 느낌) |

## 2. 기술 스택 및 기본 구성 (CLAUDE.md 기준)

| 구분 | 내용 |
| --- | --- |
| 빌드 도구 | Vite |
| 프레임워크/언어 | React + JavaScript (TypeScript 사용 안 함) |
| CSS | Tailwind CSS |
| 상태 관리 | Zustand |
| 데이터 저장 | localStorage (Zustand `persist` 미들웨어, 기록·메모리만 저장) |
| 린터 | oxlint (`no-unused-vars`: off) |
| StrictMode | `src/main.jsx`에서 `<StrictMode>` 제거 |

### 프로젝트 생성

```bash
npm create vite@latest Calculator -- --template react
```

### 개발 서버 설정

```js
// vite.config.js
export default defineConfig({
  // ...
  server: {
    port: 3000,
    open: true,
  },
});
```

### Lint 설정

```json
// .oxlintrc.json
{
  "rules": {
    "no-unused-vars": "off"
  }
}
```

## 3. 기능 요구사항

### 3.1 화면 표시
- **수식 줄** (위, 작은 글씨): 진행 중인 식을 표시한다. 예: `12 + 7 =`
- **결과 줄** (아래, 큰 글씨): 현재 입력 중인 숫자 또는 계산 결과를 표시한다.
- 숫자는 천 단위 콤마로 표시한다. 예: `1,234,567.89`
- 입력은 최대 16자리까지 받는다.
- 결과가 길면 글자 크기를 줄여 한 줄에 맞춘다.

### 3.2 버튼 구성 (Windows 표준 모드와 동일)

```
┌──────┬──────┬──────┬──────┐
│  %   │  CE  │  C   │  ⌫   │
├──────┼──────┼──────┼──────┤
│ 1/x  │  x²  │  √x  │  ÷   │
├──────┼──────┼──────┼──────┤
│  7   │  8   │  9   │  ×   │
├──────┼──────┼──────┼──────┤
│  4   │  5   │  6   │  −   │
├──────┼──────┼──────┼──────┤
│  1   │  2   │  3   │  +   │
├──────┼──────┼──────┼──────┤
│  ±   │  0   │  .   │  =   │
└──────┴──────┴──────┴──────┘
```

### 3.3 버튼별 동작

| 버튼 | 동작 |
| --- | --- |
| `0`~`9` | 숫자 입력 |
| `.` | 소수점 입력 (한 숫자에 한 번만) |
| `+` `−` `×` `÷` | 사칙연산. 연산자를 연달아 누르면 마지막 연산자로 바뀐다 |
| `=` | 계산 실행. 다시 누르면 마지막 연산을 반복한다 (예: `2 + 3 = = =` → 5, 8, 11) |
| `%` | 퍼센트. `a + b %` → `b`를 `a × b / 100`으로 바꾼다 (Windows 방식) |
| `1/x` | 역수 |
| `x²` | 제곱 |
| `√x` | 제곱근 |
| `±` | 부호 전환 |
| `CE` | 현재 입력 중인 숫자만 지운다 |
| `C` | 전체 초기화 |
| `⌫` | 마지막 한 자리를 지운다 |

### 3.4 계산 방식
- Windows 표준 모드처럼 **누른 순서대로 바로 계산**한다. (연산자 우선순위 없음)
  - 예: `2 + 3 × 4 =` → `(2 + 3) × 4` = `20`
- 부동소수점 오차를 보정해 표시한다. 예: `0.1 + 0.2` → `0.3`
- 오류 처리
  - 0으로 나누기: `0으로 나눌 수 없습니다`
  - 음수의 제곱근, 0의 역수: `잘못된 입력입니다`
  - 오류 표시 중에는 숫자 버튼과 `C` / `CE`만 동작하고, 누르면 초기화된다.

### 3.5 기록 (History)
- `=`으로 계산이 끝날 때마다 `수식 = 결과`를 기록에 추가한다.
- 최신 기록이 맨 위에 온다.
- 기록 항목을 누르면 그 결과값을 결과 줄로 불러온다.
- **기록 전체 삭제** 버튼을 둔다.
- 기록은 최대 50개까지 보관한다. (오래된 것부터 삭제)

### 3.6 메모리 (Memory)

| 버튼 | 동작 |
| --- | --- |
| `MC` | 메모리 전체 삭제 |
| `MR` | 가장 최근 메모리 값을 불러온다 |
| `M+` | 가장 최근 메모리 값에 현재 값을 더한다 (메모리가 없으면 새로 저장) |
| `M-` | 가장 최근 메모리 값에서 현재 값을 뺀다 (메모리가 없으면 새로 저장) |
| `MS` | 현재 값을 새 메모리로 저장한다 |

- 메모리가 비어 있으면 `MC`, `MR`은 비활성화한다.
- 메모리 목록 패널에서 저장된 값들을 볼 수 있고, 항목을 누르면 그 값을 불러온다.

### 3.7 키보드 입력

| 키 | 동작 |
| --- | --- |
| `0`~`9`, `.` | 숫자, 소수점 |
| `+` `-` `*` `/` | 사칙연산 |
| `Enter`, `=` | 계산 |
| `Backspace` | ⌫ |
| `Delete` | CE |
| `Escape` | C |
| `%` | 퍼센트 |

- 키를 누르면 해당 버튼에도 눌림 효과를 보여 준다.

### 3.8 데이터 유지
- 기록과 메모리는 localStorage에 저장해 새로고침 후에도 유지한다.
- 현재 입력값과 진행 중인 식은 저장하지 않는다.

## 4. 데이터 구조

```js
// 계산기 상태 (저장 안 함)
{
  display: '0',        // 결과 줄에 표시하는 값
  expression: '',      // 수식 줄 (예: '12 + 7 =')
  operand: null,       // 앞에서 입력한 값
  operator: null,      // '+' | '-' | '×' | '÷'
  lastOperation: null, // '=' 반복용 { operator, value }
  waitingForNext: false, // 다음 숫자 입력 시 display를 새로 시작할지 여부
  error: null,         // 오류 메시지
}

// 기록 항목 (저장)
{ id: string, expression: '12 + 7 =', result: '19' }

// 메모리 (저장)
memory: [number, ...]  // 0번이 가장 최근 값
```

## 5. 폴더 구조

```
Calculator/
├── src/
│   ├── pages/
│   │   └── CalculatorPage.jsx   # 메인 화면 (계산기 + 기록/메모리 패널)
│   ├── comp/
│   │   ├── Display.jsx          # 수식 줄 + 결과 줄
│   │   ├── Keypad.jsx           # 버튼 그리드
│   │   ├── CalcButton.jsx       # 버튼 하나 (종류별 스타일)
│   │   ├── MemoryBar.jsx        # MC/MR/M+/M-/MS 버튼 줄
│   │   ├── SidePanel.jsx        # 기록 / 메모리 탭 패널
│   │   ├── HistoryList.jsx      # 기록 목록
│   │   └── MemoryList.jsx       # 메모리 목록
│   ├── service/
│   │   └── calculator.js        # 계산 로직 (사칙연산, %, 1/x, x², √x, 오차 보정, 오류 처리)
│   ├── utils/
│   │   ├── format.js            # 천 단위 콤마, 자릿수 제한
│   │   └── keyboard.js          # 키 → 버튼 매핑
│   ├── stores/
│   │   └── calcStore.js         # Zustand 스토어 (기록·메모리만 persist)
│   ├── App.jsx
│   ├── main.jsx                 # StrictMode 제거
│   └── index.css                # Tailwind import
├── .oxlintrc.json
└── vite.config.js
```

## 6. Store 설계 (Zustand)

```js
// src/stores/calcStore.js
{
  // 계산기 상태
  display, expression, operand, operator, lastOperation, waitingForNext, error,
  inputDigit(digit),
  inputDot(),
  setOperator(op),
  calculate(),           // =
  percent(),
  unary(type),           // 'reciprocal' | 'square' | 'sqrt' | 'negate'
  clearEntry(),          // CE
  clearAll(),            // C
  backspace(),

  // 기록
  history: [],
  recallHistory(id),
  clearHistory(),

  // 메모리
  memory: [],
  memoryClear(),         // MC
  memoryRecall(index),   // MR (기본 0)
  memoryAdd(),           // M+
  memorySubtract(),      // M-
  memoryStore(),         // MS
}
```

- `persist`의 `partialize`로 `history`, `memory`만 localStorage에 저장한다. (key: `calculator`)
- 실제 계산은 `service/calculator.js`의 순수 함수로 처리하고, 스토어는 상태만 바꾼다.

## 7. 화면 구성 및 디자인

### 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│               (보라 → 파랑 → 분홍 그라데이션 배경)               │
│                                                         │
│   ┌─────────────────────────┐  ┌────────────────────┐   │
│   │ Calculator              │  │ [기록] [메모리]       │   │
│   │                12 + 7 = │  │                    │   │
│   │                      19 │  │ 12 + 7 =           │   │
│   │ MC  MR  M+  M-  MS      │  │               19   │   │
│   │ ┌───┬───┬───┬───┐       │  │ 5 × 3 =            │   │
│   │ │ % │CE │ C │ ⌫ │       │  │               15   │   │
│   │ │1/x│x² │√x │ ÷ │       │  │                    │   │
│   │ │ 7 │ 8 │ 9 │ × │       │  │                    │   │
│   │ │ 4 │ 5 │ 6 │ − │       │  │                    │   │
│   │ │ 1 │ 2 │ 3 │ + │       │  │           [🗑 삭제] │   │
│   │ │ ± │ 0 │ . │ = │       │  │                    │   │
│   │ └───┴───┴───┴───┘       │  └────────────────────┘   │
│   └─────────────────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

- 넓은 화면: 계산기 왼쪽, 기록/메모리 패널 오른쪽
- 좁은 화면(모바일): 계산기만 보이고, 상단 버튼으로 기록/메모리 패널을 열고 닫는다.

### 디자인 가이드 (글래스모피즘)
- **배경**: 화면 전체에 부드러운 그라데이션 (예: `from-indigo-500 via-purple-500 to-pink-400`) + 흐릿한 원형 빛 2~3개를 배치해 유리 효과가 잘 보이게 한다.
- **유리 카드**: 반투명 흰색(`bg-white/15`) + 배경 흐림(`backdrop-blur-xl`) + 얇은 밝은 테두리(`border border-white/30`) + 부드러운 그림자(`shadow-2xl`) + 큰 둥근 모서리(`rounded-3xl`)
- **버튼 종류별 스타일**

| 종류 | 버튼 | 스타일 |
| --- | --- | --- |
| 숫자 | `0`~`9`, `.`, `±` | `bg-white/20`, 흰 글씨 |
| 기능 | `%`, `CE`, `C`, `⌫`, `1/x`, `x²`, `√x` | `bg-white/10`, 연한 흰 글씨 |
| 연산자 | `÷` `×` `−` `+` | `bg-white/25`, 선택된 연산자는 강조 |
| 등호 | `=` | 포인트 색 (`bg-pink-400/80` 등), 굵은 글씨 |
| 메모리 | `MC` `MR` `M+` `M-` `MS` | 배경 없는 작은 텍스트 버튼 |

- **효과**: hover 시 살짝 밝아짐, 클릭/키 입력 시 살짝 눌림(`active:scale-95`)
- **글꼴**: 결과 숫자는 크고 가는 글씨(`text-5xl font-light`), 숫자 폭 고정(`tabular-nums`)
- 모든 글씨는 흰색 계열로 유지해 배경과 대비를 확보한다.

## 8. 개발 순서

1. Vite + React 프로젝트 생성 (`Calculator`)
2. Tailwind CSS, Zustand, oxlint 설치 및 설정
3. `vite.config.js` 서버 설정 (port 3000, open: true)
4. `main.jsx`에서 StrictMode 제거
5. 폴더 구조 생성 (`pages`, `comp`, `service`, `utils`, `stores`)
6. 계산 로직 구현 (`service/calculator.js`)
7. Zustand 스토어 구현 (계산 상태 + 기록 + 메모리, persist)
8. 디스플레이 → 키패드 → 메모리 바 → 기록/메모리 패널 순서로 컴포넌트 구현
9. 키보드 입력 연결
10. 글래스모피즘 디자인 및 반응형 적용
11. 동작 확인 (사칙연산, 연속 계산, `=` 반복, %, 1/x, x², √x, ±, CE/C/⌫, 오류, 기록, 메모리, 키보드, 새로고침 유지)

## 9. 결정 사항

| 항목 | 결정 |
| --- | --- |
| 기준 | Windows 기본 계산기 표준 모드 |
| 추가 기능 | 기록, 메모리, 키보드 입력 |
| 계산 방식 | 누른 순서대로 계산 (우선순위 없음) |
| 디자인 | 글래스모피즘 |
| 데이터 저장 | 기록·메모리만 localStorage |
| 기록 보관 개수 | 최대 50개 |
| 입력 자릿수 | 최대 16자리 |
