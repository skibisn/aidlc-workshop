# TDD Code Generation Plan - Unit 2: Customer Frontend

## Unit Context
- **Code Location**: `frontend/` (Vite + React + TypeScript)
- **Stories**: US-C-01, US-C-02, US-C-03, US-C-04, US-C-05

## Plan Step 0: 프로젝트 구조 생성
- [x] `frontend/package.json`
- [x] `frontend/vite.config.ts`
- [x] `frontend/tsconfig.json`
- [x] `frontend/index.html`
- [x] `frontend/src/main.tsx`
- [x] `frontend/src/api/client.ts` (Axios 인스턴스)
- [x] `frontend/src/hooks/useCart.ts` (장바구니 localStorage 훅)
- [x] `frontend/src/hooks/useSession.ts` (세션 localStorage 훅)
- [x] 컴포넌트 스켈레톤 생성

## Plan Step 1: 컴포넌트 TDD
- [x] useCart 훅 테스트 + 구현
- [x] useSession 훅 테스트 + 구현
- [x] TableSetupPage 테스트 + 구현
- [x] MenuPage 테스트 + 구현
- [x] CartPage 테스트 + 구현
- [x] OrderConfirmPage 테스트 + 구현
- [x] OrderHistoryPage 테스트 + 구현

## Plan Step 2: 추가 산출물
- [x] `frontend/Dockerfile`
- [x] docker-compose.yml에 frontend 서비스 추가
