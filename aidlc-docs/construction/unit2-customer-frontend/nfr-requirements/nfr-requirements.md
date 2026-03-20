# NFR Requirements - Unit 2: Customer Frontend

## 성능
- 메뉴 목록 초기 로딩: 1초 이내
- 장바구니 조작: 즉각 반응 (로컬 상태)

## 사용성
- 모든 버튼 최소 44x44px (터치 친화적)
- 카드 형태 메뉴 레이아웃
- 모바일 우선 반응형 디자인

## 기술 스택
| 항목 | 선택 |
|------|------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Styling | CSS Modules 또는 Tailwind CSS |
| 상태 관리 | React useState + localStorage (별도 라이브러리 불필요) |
| 테스트 | Vitest + React Testing Library |
