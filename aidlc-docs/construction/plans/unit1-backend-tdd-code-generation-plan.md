# TDD Code Generation Plan - Unit 1: Backend API

## Unit Context
- **Workspace Root**: /Users/avo/code/aidlc-workshop
- **Code Location**: `backend/src/main/java/com/tableorder/`
- **Test Location**: `backend/src/test/java/com/tableorder/`
- **Build Tool**: Gradle
- **Stories**: US-C-01~05, US-A-01~04

---

## Plan Step 0: 프로젝트 구조 및 스켈레톤 생성
- [x] `backend/build.gradle` 생성 (의존성 포함)
- [x] `backend/src/main/resources/application.yml` 생성
- [x] Domain Entity 클래스 생성 (Store, Admin, Table, Category, Menu, Order, OrderItem, OrderHistory)
- [x] Repository 인터페이스 생성 (JpaRepository 상속, 메서드 stub)
- [x] Service 클래스 스켈레톤 생성 (모든 메서드 `throw new UnsupportedOperationException()`)
- [x] Controller 클래스 스켈레톤 생성
- [x] Security 클래스 스켈레톤 생성 (JwtTokenProvider, JwtAuthenticationFilter)
- [x] Exception 클래스 생성 (GlobalExceptionHandler, 커스텀 예외들)
- [x] FileStorageService 스켈레톤 생성
- [x] SseService 스켈레톤 생성
- [x] Seed 데이터 SQL 생성 (`backend/src/main/resources/data.sql`)

---

## Plan Step 1: Business Logic Layer (TDD)

### AuthService
- [x] TC-B-001: authenticate() - 로그인 성공 RED-GREEN-REFACTOR
- [x] TC-B-002: authenticate() - 비밀번호 실패 RED-GREEN-REFACTOR
- [x] TC-B-003: authenticate() - 5회 실패 잠금 RED-GREEN-REFACTOR
- [x] TC-B-004: authenticate() - 잠긴 계정 RED-GREEN-REFACTOR

### TableService
- [x] TC-B-005: autoLogin() - 기존 세션 반환 RED-GREEN-REFACTOR
- [x] TC-B-006: autoLogin() - 새 세션 생성 RED-GREEN-REFACTOR
- [x] TC-B-007: autoLogin() - 잘못된 비밀번호 RED-GREEN-REFACTOR
- [x] TC-B-008: completeSession() - 이용 완료 처리 RED-GREEN-REFACTOR
- [x] TC-B-009: completeSession() - 세션 없음 RED-GREEN-REFACTOR

### OrderService
- [x] TC-B-010: createOrder() - 주문 생성 성공 RED-GREEN-REFACTOR
- [x] TC-B-011: createOrder() - 잘못된 세션 RED-GREEN-REFACTOR
- [x] TC-B-012: deleteOrder() - 삭제 및 총액 재계산 RED-GREEN-REFACTOR

### MenuService
- [x] TC-B-013: createMenu() - 메뉴 등록 성공 RED-GREEN-REFACTOR
- [x] TC-B-014: createMenu() - 잘못된 파일 확장자 RED-GREEN-REFACTOR

---

## Plan Step 2: API Layer (TDD - MockMvc)

- [x] TC-B-015: POST /api/auth/login 성공 RED-GREEN-REFACTOR
- [x] TC-B-016: POST /api/auth/login 실패 RED-GREEN-REFACTOR
- [ ] TC-B-017: POST /api/tables/auto-login 성공 RED-GREEN-REFACTOR
- [ ] TC-B-018: GET /api/menus 성공 RED-GREEN-REFACTOR
- [ ] TC-B-019: POST /api/orders 성공 RED-GREEN-REFACTOR
- [ ] TC-B-020: GET /api/orders 현재 세션 필터 RED-GREEN-REFACTOR
- [ ] TC-B-021: PATCH /api/orders/{id}/status RED-GREEN-REFACTOR
- [ ] TC-B-022: POST /api/tables/{id}/complete RED-GREEN-REFACTOR
- [ ] TC-B-023: 인증 없이 관리자 API → 401 RED-GREEN-REFACTOR

---

## Plan Step 3: 추가 산출물
- [x] `backend/README.md` 생성 (실행 방법, 환경 변수 설명)
- [x] `aidlc-docs/construction/unit1-backend/code/code-summary.md` 생성
