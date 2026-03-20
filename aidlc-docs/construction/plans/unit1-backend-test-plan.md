# Test Plan - Unit 1: Backend API

## Unit Overview
- **Unit**: unit1-backend
- **Stories**: US-C-01~05, US-A-01~04
- **Approach**: TDD (JUnit 5 + Mockito)

---

## AuthService Tests

### AuthService.authenticate()
- **TC-B-001**: 유효한 자격증명으로 로그인 성공 → JWT 반환
  - Story: US-A-01 | Status: 🟢
- **TC-B-002**: 잘못된 비밀번호로 로그인 실패 → failedLoginCount 증가
  - Story: US-A-01 | Status: 🟢
- **TC-B-003**: 5회 실패 후 계정 잠금
  - Story: US-A-01 | Status: 🟢
- **TC-B-004**: 잠긴 계정 로그인 시도 → AccountLockedException
  - Story: US-A-01 | Status: 🟢

---

## TableService Tests

### TableService.autoLogin()
- **TC-B-005**: 유효한 자격증명으로 자동 로그인 → 기존 세션 반환
  - Story: US-C-01 | Status: 🟢
- **TC-B-006**: 세션 없는 테이블 자동 로그인 → 새 세션 생성
  - Story: US-C-01 | Status: 🟢
- **TC-B-007**: 잘못된 비밀번호 → UnauthorizedException
  - Story: US-C-01 | Status: 🟢

### TableService.completeSession()
- **TC-B-008**: 이용 완료 처리 → OrderHistory 생성, 테이블 리셋
  - Story: US-A-03 | Status: 🟢
- **TC-B-009**: 활성 세션 없는 테이블 완료 처리 → NoActiveSessionException
  - Story: US-A-03 | Status: 🟢

---

## OrderService Tests

### OrderService.createOrder()
- **TC-B-010**: 유효한 주문 생성 → Order 저장, 테이블 총액 업데이트
  - Story: US-C-04 | Status: 🟢
- **TC-B-011**: 잘못된 sessionId로 주문 → InvalidSessionException
  - Story: US-C-04 | Status: 🟢

### OrderService.deleteOrder()
- **TC-B-012**: 주문 삭제 → 테이블 총액 재계산
  - Story: US-A-03 | Status: 🟢

---

## MenuService Tests

### MenuService.createMenu()
- **TC-B-013**: 유효한 메뉴 등록 → Menu 저장
  - Story: US-A-04 | Status: 🟢
- **TC-B-014**: 허용되지 않는 이미지 확장자 → InvalidFileException
  - Story: US-A-04 | Status: 🟢

---

## API Layer Tests (MockMvc)

- **TC-B-015**: POST /api/auth/login - 성공 → 200 + JWT | Story: US-A-01 | Status: 🟢
- **TC-B-016**: POST /api/auth/login - 실패 → 401 | Story: US-A-01 | Status: 🟢
- **TC-B-017**: POST /api/tables/auto-login - 성공 → 200 | Story: US-C-01 | Status: ⬜
- **TC-B-018**: GET /api/menus - 성공 → 200 + 목록 | Story: US-C-02 | Status: ⬜
- **TC-B-019**: POST /api/orders - 성공 → 201 | Story: US-C-04 | Status: ⬜
- **TC-B-020**: GET /api/orders - 현재 세션 주문만 반환 | Story: US-C-05 | Status: ⬜
- **TC-B-021**: PATCH /api/orders/{id}/status - 상태 변경 → 200 | Story: US-A-02 | Status: ⬜
- **TC-B-022**: POST /api/tables/{id}/complete - 이용 완료 → 200 | Story: US-A-03 | Status: ⬜
- **TC-B-023**: 인증 없이 관리자 API 접근 → 401 | Story: US-A-01 | Status: ⬜

---

## Requirements Coverage

| Story | Test Cases | Status |
|-------|-----------|--------|
| US-C-01 (자동 로그인) | TC-B-005, 006, 007, 017 | ⬜ |
| US-C-02 (메뉴 탐색) | TC-B-018 | ⬜ |
| US-C-04 (주문 생성) | TC-B-010, 011, 019 | ⬜ |
| US-C-05 (주문 내역) | TC-B-020 | ⬜ |
| US-A-01 (관리자 로그인) | TC-B-001~004, 015, 016, 023 | ⬜ |
| US-A-02 (실시간 모니터링) | TC-B-021 | ⬜ |
| US-A-03 (테이블 관리) | TC-B-008, 009, 012, 022 | ⬜ |
| US-A-04 (메뉴 관리) | TC-B-013, 014 | ⬜ |
