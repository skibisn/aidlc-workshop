# Code Summary - Unit 1: Backend API

## 생성된 파일 목록

### 설정
- `backend/build.gradle` — Gradle 빌드 설정 (Spring Boot 3.x, jjwt, Springdoc)
- `backend/src/main/resources/application.yml` — 애플리케이션 설정
- `backend/src/main/resources/data.sql` — Seed 데이터 (매장, 관리자, 카테고리, 메뉴, 테이블)

### 메인 애플리케이션
- `TableOrderApplication.java`

### Domain Entities
- `Store.java`, `Admin.java`, `TableEntity.java`
- `Category.java`, `Menu.java`
- `Order.java`, `OrderItem.java`, `OrderHistory.java`, `OrderStatus.java`

### Repositories
- `StoreRepository`, `AdminRepository`, `TableRepository`
- `CategoryRepository`, `MenuRepository`
- `OrderRepository`, `OrderHistoryRepository`

### Services
- `AuthService.java` — JWT 인증, 로그인 시도 제한
- `TableService.java` — 세션 관리, 이용 완료 처리
- `OrderService.java` — 주문 생성/삭제/상태 변경
- `MenuService.java` — 메뉴 CRUD
- `FileStorageService.java` — 이미지 파일 저장
- `SseService.java` — SSE 구독/발행

### Controllers
- `AuthController.java` — POST /api/auth/login, /logout
- `TableController.java` — POST /api/tables/auto-login, /setup, /{id}/complete, GET /{id}/history
- `MenuController.java` — GET/POST/PUT/DELETE /api/menus
- `OrderController.java` — POST/GET /api/orders, PATCH/DELETE /api/orders/{id}
- `SseController.java` — GET /api/sse/orders

### Security
- `JwtTokenProvider.java`, `JwtAuthenticationFilter.java`, `AdminPrincipal.java`
- `SecurityConfig.java`

### Exception
- `GlobalExceptionHandler.java`
- `UnauthorizedException`, `AccountLockedException`, `NotFoundException`
- `InvalidSessionException`, `InvalidFileException`, `NoActiveSessionException`

### 테스트 (TDD)
- `AuthServiceTest.java` — TC-B-001~004 (4개)
- `TableServiceTest.java` — TC-B-005~009 (5개)
- `OrderServiceTest.java` — TC-B-010~012 (3개)
- `MenuServiceTest.java` — TC-B-013~014 (2개)
- `AuthControllerTest.java` — TC-B-015~016 (2개)

## 총 테스트: 16개 (TC-B-001~016)
