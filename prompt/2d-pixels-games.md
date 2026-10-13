# 2D Pixels Games 개발 기획 문서

## 1. 개요

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | `2d-pixels-games` |
| 서비스명 | 2D Pixels Games |
| 목적 | 2D 픽셀 컨셉의 게임 사이트. 로그인/회원가입, 공지사항, 자유게시판, 1:1문의 제공 |
| 게임 | 게임 목록만 표시 (실제 게임 구현 없음) |
| 서버 | 없음. mock-board와 같이 **axios + mock 서버**로 서버 통신 흉내, 데이터는 localStorage에 저장 |
| 외부 API | 사용 안 함 |
| 디자인 방향 | 검은색 배경의 2D 픽셀 아트 + Windows 98 스타일 창 |

## 2. 기술 스택 및 기본 구성 (CLAUDE.md 기준)

| 구분 | 내용 |
| --- | --- |
| 빌드 도구 | Vite |
| 프레임워크/언어 | React + JavaScript (TypeScript 사용 안 함) |
| CSS | Tailwind CSS |
| 라우팅 | react-router-dom |
| 상태 관리 | Zustand (로그인 정보, `persist`로 localStorage 유지) |
| HTTP 통신 | axios |
| Mock 서버 | axios-mock-adapter (300ms 지연) |
| Mock DB | localStorage |
| 폰트 | Galmuri (한글 지원 픽셀 폰트, npm `galmuri`) |
| 린터 | oxlint (`no-unused-vars`: off) |
| StrictMode | `src/main.jsx`에서 `<StrictMode>` 제거 |
| 개발 서버 | port 3000, 브라우저 자동 열기 |

```bash
npm create vite@latest 2d-pixels-games -- --template react
```

## 3. 디자인 가이드

| 항목 | 내용 |
| --- | --- |
| 배경 | 전체 **검은색** (`#000`) |
| 폰트 | Galmuri11 (픽셀 폰트) |
| 강조색 | 네온 계열 (노랑 `#facc15`, 초록 `#4ade80`, 하늘 `#38bdf8`, 빨강 `#f87171`) |
| 테두리/버튼 | 둥근 모서리 없음, 각진 픽셀 테두리 + 그림자(`box-shadow`로 계단형 픽셀 느낌) |
| 픽셀 캐릭터 | SVG로 직접 그린 픽셀 캐릭터를 화면 곳곳에 **소수(4~5개)만** 배치. 그중 하나는 **마리오 느낌의 캐릭터**(빨간 모자, 콧수염, 멜빵 바지). 가볍게 위아래로 움직이는 애니메이션 |
| 게임 목록 창 | **Windows 98 스타일 창** (회색 `#c0c0c0` 창, 남색 그라데이션 제목 표시줄, 입체 테두리, `_ □ ×` 버튼) |
| 게임 아이콘 | 픽셀로 그린 **컴퓨터 모니터 모양 아이콘** + 아래에 게임 이름 |

> 마리오 캐릭터는 닌텐도 저작물이므로 원본 도트를 그대로 복사하지 않고, 마리오를 떠올리게 하는 **오리지널 배관공 캐릭터**로 직접 그린다.

## 4. 메인 화면 구성 (위 → 아래)

```
┌──────────────────────────────────────────────────────────┐
│ 2D PIXELS GAMES                         (로그인 시) 닉네임 ▾ │  ← 상단 로고
│                                                          │
│   👾                 ┌───────────┐               🍄      │
│                     /  GAME      \                       │  ← ① 픽셀 동그라미
│                     \  START!    /     (깜빡임)            │     GAME START
│      (배관공)          └───────────┘                👻      │
│                                                          │
│              ┌─ 아이디   [__________] ─┐                    │  ← ② 로그인 폼
│              │  비밀번호 [__________]  │                    │     (로그인 후엔
│              │  [ LOGIN ]  회원가입     │                    │      환영 박스)
│              └────────────────────────┘                    │
│                                                          │
│  [ 공지사항 ] [ 자유게시판 ] [ 1:1문의 ]                       │  ← ③ 메뉴 바
│                                                          │
│  ┌ GAMES.EXE ─────────────────────── _ □ × ┐             │  ← ④ Win98 창
│  │  [🖥]      [🖥]      [🖥]      [🖥]          │             │     게임 아이콘 목록
│  │ 픽셀러너  스페이스  던전퀘스트  블록퍼즐        │             │
│  │  [🖥]      [🖥]                            │             │
│  │ 레트로레이서 슬라임헌터                       │             │
│  ├──────────────────────────────────────────┤             │
│  │ 6개 개체                                  │             │  ← 상태 표시줄
│  └──────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────┘
```

### 4.1 GAME START (픽셀 동그라미)
- 화면 가운데에 픽셀(계단형)로 그린 동그라미 + `GAME START` 글자, 글자는 깜빡이는 애니메이션.
- 클릭 시: 비로그인이면 로그인 폼(아이디 입력칸)에 포커스, 로그인 상태면 게임 목록 창으로 스크롤.

### 4.2 로그인 폼
- 아이디 / 비밀번호 입력 + `LOGIN` 버튼, 아래에 `회원가입` 링크.
- 실패 시 `아이디 또는 비밀번호가 올바르지 않습니다.` 표시.
- 로그인 후에는 폼 대신 `○○님 환영합니다!` 박스 + 권한 표시 + `LOGOUT` 버튼.

### 4.3 메뉴 바
- `공지사항` / `자유게시판` / `1:1문의` 픽셀 버튼.
- 비로그인 상태에서 누르면 `로그인이 필요합니다.` 안내 후 로그인 폼에 포커스.
- 메인 외 화면에서도 상단에 같은 메뉴 바를 표시한다.

### 4.4 게임 목록 (Windows 98 창)
- 제목 표시줄: `GAMES.EXE`, 오른쪽 `_ □ ×` 버튼 (장식용).
- 컴퓨터 모양 픽셀 아이콘 + 게임 이름을 격자로 배치.
- 아이콘 **클릭: 선택(파란 반전 표시)**, **더블클릭: 실행** → Win98 스타일 알림창 `「○○」은(는) 준비 중인 게임입니다.` + `확인` 버튼.
- 하단 상태 표시줄에 `N개 개체` 표시.
- 게임 목록은 `GET /api/games`로 받아온다. (비로그인도 조회 가능)

## 5. 서버 통신 구조 (Mock)

mock-board와 같은 구조.

```
화면 → service → axios 인스턴스(api.js, baseURL=/api, 토큰 자동 첨부)
     → axios-mock-adapter(service/mock/server.js) → localStorage mock DB
```

- 로그인 시 mock 토큰 발급, `Authorization: Bearer {token}`으로 인증.
- 401: 자동 로그아웃 / 403: 권한 없음 / 409: 아이디 중복.
- 응답에 비밀번호는 포함하지 않는다.

### 5.1 API 명세

| 기능 | Method | URL | 권한 |
| --- | --- | --- | --- |
| 로그인 | POST | `/api/auth/login` | 없음 |
| 회원가입 | POST | `/api/auth/signup` | 없음 |
| 내 정보 | GET | `/api/auth/me` | 로그인 |
| 게임 목록 | GET | `/api/games` | 없음 |
| 공지 목록/상세 | GET | `/api/notices`, `/api/notices/:id` | 로그인 |
| 공지 등록/수정/삭제 | POST/PUT/DELETE | `/api/notices(/:id)` | 관리자 |
| 게시글 목록/상세 | GET | `/api/posts`, `/api/posts/:id` | 로그인 |
| 게시글 등록 | POST | `/api/posts` | 로그인 |
| 게시글 수정/삭제 | PUT/DELETE | `/api/posts/:id` | 본인 또는 관리자 |
| 문의 목록 | GET | `/api/inquiries` | 로그인 (본인 것만, 관리자는 전체) |
| 문의 상세 | GET | `/api/inquiries/:id` | 본인 또는 관리자 |
| 문의 등록 | POST | `/api/inquiries` | 로그인 |
| 문의 수정 | PUT | `/api/inquiries/:id` | 본인, **답변 대기** 상태만 |
| 문의 삭제 | DELETE | `/api/inquiries/:id` | 본인 또는 관리자 |
| 문의 답변 등록/수정 | PUT | `/api/inquiries/:id/answer` | 관리자 |

- 공지/게시글 상세 조회 시 조회 수 +1 (수정 화면은 `increaseView=false`).

## 6. 데이터 구조

### 6.1 회원 (user)
| 필드 | 설명 |
| --- | --- |
| `id` | 번호 |
| `username` | 아이디 (중복 불가) |
| `password` | 비밀번호 (응답 제외) |
| `nickname` | 닉네임 |
| `role` | `ADMIN`(관리자) / `USER`(일반) — 회원가입은 항상 `USER` |
| `createdAt` | 가입일 |

### 6.2 공지 (notice) / 게시글 (post)
| 필드 | 설명 |
| --- | --- |
| `id`, `title`, `content`, `views` | 번호, 제목, 내용, 조회 수 |
| `authorId` / `authorName` | 글쓴이 (응답 시 닉네임 채움) |
| `createdAt`, `updatedAt` | 등록일, 수정일 |

### 6.3 1:1문의 (inquiry)
| 필드 | 설명 |
| --- | --- |
| `id`, `title`, `content` | 번호, 제목, 내용 |
| `authorId` / `authorName` | 문의자 |
| `status` | `WAITING`(답변 대기) / `ANSWERED`(답변 완료) |
| `answer`, `answeredAt` | 답변 내용, 답변일 |
| `createdAt`, `updatedAt` | 등록일, 수정일 |

### 6.4 게임 (game) — 읽기 전용
| 필드 | 설명 |
| --- | --- |
| `id`, `title`, `genre`, `color` | 번호, 이름, 장르, 아이콘 화면 색 |

### 6.5 Seed 데이터
| 아이디 | 비밀번호 | 닉네임 | 권한 |
| --- | --- | --- | --- |
| `admin` | `admin1234` | GM픽셀 | 관리자 |
| `player1` | `player1234` | 용사1호 | 일반 |

- 공지 2건, 자유게시판 3건, 문의 2건(답변 대기 1, 답변 완료 1), 게임 6개.

## 7. 기능 요구사항

### 7.1 회원가입 (`/signup`)
- 아이디, 비밀번호, 비밀번호 확인, 닉네임 (모두 필수).
- 비밀번호 확인 불일치, 아이디 중복 시 안내.
- 가입 성공 시 `회원가입이 완료되었습니다.` 안내 후 메인으로 이동 (로그인은 직접).

### 7.2 공지사항
- 목록(번호, 제목, 글쓴이, 조회, 등록일) / 상세 / 등록 / 수정 / 삭제.
- 관리자만 `글쓰기`, `수정`, `삭제` 버튼 표시.

### 7.3 자유게시판
- 목록 / 상세 / 등록 / 수정 / 삭제. mock-board 게시판과 동일.
- 로그인하면 등록 가능, 본인 글만 수정/삭제 (관리자는 전체).

### 7.4 1:1문의
- 목록: 번호, 제목, 상태(`답변 대기`/`답변 완료` 배지), 등록일 (+ 관리자는 문의자 표시).
- 일반 회원: 본인 문의만 보임. 등록 / 답변 대기 상태일 때만 수정 / 삭제.
- 관리자: 전체 문의 조회, 상세 화면에서 답변 등록·수정, 삭제 가능.
- 상세 화면: 문의 내용 아래에 답변 영역 표시 (답변 없으면 `답변을 기다리고 있습니다.`).

### 7.5 접근 권한
| 화면 | 비로그인 | 일반 | 관리자 |
| --- | --- | --- | --- |
| 메인 (게임 목록 포함) | O | O | O |
| 회원가입 | O | X (메인으로) | X (메인으로) |
| 공지 읽기 | X | O | O |
| 공지 쓰기/수정/삭제 | X | X | O |
| 자유게시판 | X | O (수정/삭제는 본인 글) | O (전체) |
| 1:1문의 | X | O (본인 것) | O (전체 + 답변) |

- 비로그인 상태로 메인 외 화면에 접근하면 메인으로 이동 후 로그인 안내.
- 로그인 후 상단 오른쪽에 닉네임 표시, 클릭 시 `LOGOUT` 드롭다운.

### 7.6 공통
- 삭제 전 확인 창, 요청 중 로딩 표시와 버튼 중복 클릭 방지, 에러 메시지 표시.
- 날짜 형식: `yyyy-MM-dd HH:mm`.

## 8. 라우팅

| 경로 | 화면 | 접근 |
| --- | --- | --- |
| `/` | 메인 | 누구나 |
| `/signup` | 회원가입 | 비로그인 |
| `/notices`, `/notices/:id` | 공지 목록/상세 | 로그인 |
| `/notices/new`, `/notices/:id/edit` | 공지 등록/수정 | 관리자 |
| `/board`, `/board/:id` | 자유게시판 목록/상세 | 로그인 |
| `/board/new`, `/board/:id/edit` | 게시글 등록/수정 | 로그인 |
| `/inquiries`, `/inquiries/:id` | 문의 목록/상세(+답변) | 로그인 |
| `/inquiries/new`, `/inquiries/:id/edit` | 문의 등록/수정 | 로그인 |

## 9. 폴더 구조

```
2d-pixels-games/src/
├── main.jsx / App.jsx / index.css
├── pages/
│   ├── MainPage.jsx
│   ├── SignupPage.jsx
│   ├── NoticePages.jsx      # 공지 목록/상세/폼 (공용 Article 컴포넌트 사용)
│   ├── BoardPages.jsx       # 자유게시판 목록/상세/폼
│   └── InquiryPages.jsx     # 1:1문의 목록/상세(+답변)/폼
├── comp/
│   ├── Layout.jsx           # 상단 로고 + 사용자 메뉴 + 메뉴 바 + Outlet
│   ├── MenuBar.jsx          # 공지/자유게시판/1:1문의 바
│   ├── UserMenu.jsx         # 닉네임 + 로그아웃 드롭다운
│   ├── RequireAuth.jsx / RequireAdmin.jsx
│   ├── LoginBox.jsx         # 메인 로그인 폼 / 환영 박스
│   ├── GameStart.jsx        # 픽셀 동그라미 GAME START
│   ├── PixelSprite.jsx      # 문자열 격자 → SVG 픽셀 그림
│   ├── sprites.js           # 픽셀 도트 데이터 (배관공, 슬라임, 유령, 코인, 하트, 컴퓨터 아이콘)
│   ├── Win98Window.jsx      # Win98 창 틀
│   ├── Win98Alert.jsx       # Win98 알림창
│   ├── GameIcon.jsx         # 컴퓨터 모양 게임 아이콘
│   ├── ArticleList.jsx / ArticleDetail.jsx / ArticleForm.jsx  # 공지·게시판(·문의 폼) 공용
│   └── PixelButton.jsx / FormField.jsx / Loading.jsx / ErrorMessage.jsx / PageTitle.jsx
├── service/
│   ├── api.js
│   ├── authService.js / gameService.js / inquiryService.js
│   ├── articleService.js    # noticeService, postService (공용 생성 함수)
│   └── mock/ (server.js, db.js, seed.js)
├── utils/ (date.js, role.js)
└── stores/ (authStore.js)
```

## 10. 개발 순서

1. 프로젝트 생성, Tailwind / oxlint / vite.config / StrictMode 제거, 라이브러리 설치
2. mock DB + mock 서버 + axios + service + authStore
3. 픽셀 공통 요소 (폰트, PixelSprite, 버튼, Win98 창/알림)
4. 메인 화면 (GAME START, 로그인 폼, 메뉴 바, 게임 목록 창, 캐릭터 배치)
5. 회원가입
6. 공지사항 → 자유게시판 → 1:1문의
7. lint / build, 브라우저 기능 검증

## 11. 결정 사항

| 항목 | 결정 |
| --- | --- |
| 게임 | 게임 사이트 형태만, 게임 실행은 "준비 중" 알림 |
| 회원가입 | 누구나 가능 (일반 권한), 관리자는 seed 계정 |
| 비로그인 | 메인만 가능 (게임 목록 창 포함) |
| 공지 | 회원 읽기, 관리자만 작성/수정/삭제 |
| 자유게시판 | 로그인 작성, 본인 글만 수정/삭제 (관리자 전체) |
| 1:1문의 | 본인 문의만, 관리자 전체 조회 + 답변 |
| 배경 | 검은색 |
| 캐릭터 | 픽셀 캐릭터 4~5개, 마리오 느낌의 배관공 포함 |
| 게임 목록 | Windows 98 창 안 컴퓨터 아이콘, 클릭 선택 / 더블클릭 실행 |
| 회원 관리 화면 | 요청에 없어 미포함 |

## 12. 변경 이력

| 버전 | 내용 |
| --- | --- |
| v1 | 최초 작성 |
