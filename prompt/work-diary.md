# Work Diary 개발 기획 문서

## 1. 개요

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | `work-diary` |
| 서비스명 | Work Diary |
| 목적 | 할일과 날짜를 등록하고, 상태(완료/취소)와 중요도를 관리하는 Todo 리스트 웹 페이지 |
| 디자인 방향 | 모던하고 심플한 UI |

## 2. 기술 스택 및 기본 구성 (CLAUDE.md 기준)

| 구분 | 내용 |
| --- | --- |
| 빌드 도구 | Vite |
| 프레임워크/언어 | React + JavaScript (TypeScript 사용 안 함) |
| CSS | Tailwind CSS |
| 상태 관리 | Zustand |
| 데이터 저장 | localStorage (Zustand `persist` 미들웨어 사용) |
| 날씨 API | OpenWeather API (Current Weather Data) |
| 린터 | oxlint (`no-unused-vars`: off) |
| StrictMode | `src/main.jsx`에서 `<StrictMode>` 제거 |

### 프로젝트 생성

```bash
npm create vite@latest work-diary -- --template react
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

### 3.1 할일 등록
- 입력 항목
  - **할일** (텍스트, 필수)
  - **날짜** (date 입력, 필수)
  - **중요도** (높음 / 보통 / 낮음)
- 등록 시 상태는 `진행중`으로 생성된다.
- 할일 내용이 비어 있으면 등록되지 않는다.

### 3.2 할일 수정
- 리스트의 각 항목에서 **수정** 버튼으로 수정 모드로 전환한다.
- 수정 가능 항목: 할일, 날짜, 중요도
- 수정 모드에서 **저장** / **닫기** 를 선택할 수 있다. (일정 취소와 헷갈리지 않도록 `취소` 대신 `닫기` 사용)
- 수정은 `진행중` 상태의 항목에서만 가능하다.

### 3.3 상태 변경
상태는 `진행중`, `완료`, `취소됨` 세 가지다.

| 동작 | 설명 | 상태 변화 |
| --- | --- | --- |
| 완료 | 일정을 완료 처리 | 진행중 → 완료 |
| 취소 | **일정 취소**. 삭제하지 않고 취소된 일정으로 리스트에 남김 | 진행중 → 취소됨 |

- `완료` / `취소됨` 상태는 최종 상태로, 다시 `진행중`으로 되돌리지 않는다.

### 3.4 삭제
- 항목을 리스트에서 완전히 삭제한다.
- 삭제 전에 확인 창(`삭제하시겠습니까?`)을 띄운다.

### 3.5 리스트 표시
- 등록된 할일은 **리스트 형태**로 표시한다.
- 정렬: **최신순** (등록 시각 `createdAt` 내림차순, 가장 최근에 등록한 항목이 맨 위)
- 각 항목에 할일, 날짜, 중요도, 상태, 동작 버튼을 표시한다.
- 상태별 표시 방식과 버튼

| 상태 | 표시 | 버튼 |
| --- | --- | --- |
| 진행중 | 기본 스타일 | 완료 / 취소 / 수정 / 삭제 |
| 완료 | 체크 표시 + 흐린 텍스트 + `완료` 배지 | 삭제 |
| 취소됨 | 취소선 + 흐린 텍스트 + `일정 취소` 배지 | 삭제 |

### 3.6 중요도별 색상

| 중요도 | 값 | 색상 (Tailwind 예시) |
| --- | --- | --- |
| 높음 | `high` | 빨강 계열 (`red-500`) |
| 보통 | `medium` | 주황/노랑 계열 (`amber-500`) |
| 낮음 | `low` | 초록 계열 (`emerald-500`) |

- 리스트 항목의 좌측 컬러 바 또는 중요도 배지로 색을 표시한다.

### 3.7 데이터 유지
- 모든 할일 데이터는 localStorage에 저장되어 새로고침 후에도 유지된다.

### 3.8 오늘 날짜 표시
- 헤더 오른쪽에 현재 날짜와 시각을 표시한다.
- 형식: `yyyy-MM-dd HH:mm` (예: `2026-10-12 17:30`, 24시간제)
- 브라우저의 현재 시각(`new Date()`)을 기준으로 하며, 1분마다 갱신한다.

### 3.9 서울 날씨 표시 (OpenWeather API)
- 헤더 오른쪽, 날짜 옆에 서울의 날씨를 표시한다.
- 기준: 프로그램 실행 시점의 현재 날씨
- 표시 항목

| 항목 | API 응답 필드 | 표시 예시 |
| --- | --- | --- |
| 날씨 설명 | `weather[0].description` | 맑음 / 튼구름 / 약한 비 |
| 현재 온도 | `main.temp` | 18℃ |
| 습도 | `main.humidity` | 습도 60% |

- 날씨 설명은 **한글**로 표시한다. `lang=kr`로 받은 한글 설명을 그대로 표시한다.

- API 호출

```
GET https://api.openweathermap.org/data/2.5/weather?q=Seoul&units=metric&lang=kr&appid={API_KEY}
```

  - `units=metric`: 섭씨(℃) 단위
  - `lang=kr`: 날씨 상태를 한글로 받음
- 호출 시점
  - 프로그램 실행(페이지 최초 로드) 시 1회 호출한다.
  - 이후 **1시간마다** 다시 호출해 갱신한다. (`setInterval`, 3,600,000ms)
  - 컴포넌트가 사라질 때 타이머를 정리한다. (`clearInterval`)
- 로딩 중에는 `날씨 불러오는 중...`, 실패하면 `날씨 정보를 불러올 수 없습니다`를 표시한다.

### 3.10 API Key 관리
- API Key는 프로젝트 루트의 `.env` 파일에 저장한다.

```
# .env
VITE_OPENWEATHER_API_KEY=발급받은_API_KEY
```

- 코드에서는 `import.meta.env.VITE_OPENWEATHER_API_KEY`로 읽는다.
- `.env`는 `.gitignore`에 추가해 저장소에 올리지 않는다.
- API Key 값은 사용자가 직접 `.env`에 입력한다. 개발 시에는 `.env` 파일과 키 이름만 준비한다.

## 4. 데이터 구조

```js
// Todo 항목
{
  id: string,          // 고유 ID (Date.now() 또는 crypto.randomUUID())
  title: string,       // 할일 내용
  date: string,        // 'YYYY-MM-DD'
  priority: 'high' | 'medium' | 'low',
  status: 'active' | 'done' | 'canceled',
  createdAt: number,   // 생성 시각 (timestamp)
}
```

## 5. 폴더 구조

```
work-diary/
├── src/
│   ├── pages/
│   │   └── WorkDiary.jsx        # 메인 화면
│   ├── comp/
│   │   ├── TodoForm.jsx         # 할일 등록 폼
│   │   ├── TodoList.jsx         # 할일 리스트
│   │   ├── TodoItem.jsx         # 할일 항목 (보기/수정 모드)
│   │   ├── PriorityBadge.jsx    # 중요도 배지
│   │   ├── Header.jsx           # 제목 + 오늘 날짜 + 날씨
│   │   ├── TodayDate.jsx        # 오늘 날짜 표시
│   │   └── WeatherWidget.jsx    # 서울 날씨 표시
│   ├── service/
│   │   ├── todoService.js       # 할일 생성/검증 로직
│   │   └── weatherService.js    # OpenWeather API 호출
│   ├── utils/
│   │   ├── date.js              # 날짜 포맷 유틸 ('yyyy-MM-dd HH:mm' 포함)
│   │   └── priority.js          # 중요도 라벨/색상 매핑
│   ├── stores/
│   │   └── todoStore.js         # Zustand 스토어 (persist → localStorage)
│   ├── App.jsx
│   ├── main.jsx                 # StrictMode 제거
│   └── index.css                # Tailwind import
├── .env                         # VITE_OPENWEATHER_API_KEY (git 제외)
├── .oxlintrc.json
└── vite.config.js
```

## 6. Store 설계 (Zustand)

```js
// src/stores/todoStore.js
{
  todos: [],
  addTodo(title, date, priority),
  updateTodo(id, { title, date, priority }),
  completeTodo(id),     // active → done
  cancelTodo(id),       // active → canceled (일정 취소)
  deleteTodo(id),
}
```

- 새 항목은 배열 앞에 추가하고, 화면에서는 `createdAt` 내림차순(최신순)으로 정렬해 표시한다.

- `persist` 미들웨어로 localStorage에 저장한다. (key: `work-diary`)

## 7. 화면 구성 및 디자인

### 레이아웃

```
┌──────────────────────────────────────────────
│  Work Diary                  2026-10-12 17:30
│                         맑음 · 18℃ · 습도 60%
├──────────────────────────────────────────────
│  [ 할일 입력 ] [날짜] [중요도] [등록]
├──────────────────────────────────────────────
│ ▌ 기획 문서 작성   2026-10-14   높음          ← 가장 최근 등록
│ ▌                 [완료] [취소] [수정] [삭제]
│ ▌ ✓ 회의 준비      2026-10-13   보통   완료
│ ▌                                    [삭제]
│ ▌ ~~운동~~         2026-10-12   낮음   일정 취소
│ ▌                                    [삭제]
└──────────────────────────────────────────────
```

### 디자인 가이드 (모던 & 심플)
- 밝은 배경(`gray-50`) + 흰색 카드(`white`), 둥근 모서리(`rounded-xl`), 옅은 그림자(`shadow-sm`)
- 중앙 정렬된 단일 컬럼 레이아웃 (최대 너비 `max-w-2xl`)
- 산세리프 기본 폰트, 여백을 넉넉하게 사용
- 버튼은 작고 단순한 형태, hover 시 색상 변화
- 중요도 색상 외에는 무채색 위주로 구성

## 8. 개발 순서

1. Vite + React 프로젝트 생성 (`work-diary`)
2. Tailwind CSS, Zustand, oxlint 설치 및 설정
3. `vite.config.js` 서버 설정 (port 3000, open: true)
4. `main.jsx`에서 StrictMode 제거
5. 폴더 구조 생성 (`pages`, `comp`, `service`, `utils`, `stores`)
6. Zustand 스토어 구현 (persist 포함)
7. 등록 폼 → 리스트 → 항목(상태 변경/삭제) → 수정 모드 순서로 컴포넌트 구현
8. 중요도 색상 및 상태별 스타일 적용
9. `.env` 파일 생성(키 값은 사용자 입력), `.gitignore`에 `.env` 추가
10. 헤더 구현 (현재 날짜·시각 1분 갱신 + 서울 날씨 1시간 갱신, 로딩/에러 처리 포함)
11. 동작 확인 (등록/수정/완료/완료취소/취소/복구/삭제/새로고침 유지, 날짜·날씨 표시)

## 9. 결정 사항

| 항목 | 결정 |
| --- | --- |
| 취소 | 일정 취소 (진행중 → 취소됨, 되돌리기 없음) |
| 정렬 기준 | 최신순 (`createdAt` 내림차순) |
| 날씨 설명 | 한글 (`lang=kr` 응답 그대로 표시) |
| 시간 갱신 | 1분마다 |
| 날씨 갱신 | 실행 시 1회 + 1시간마다 |
| 삭제 확인 창 | 표시 |
| 상태별·중요도별 필터 | 포함하지 않음 |
