# Components

아키텍처: Layered Architecture (Controller → Service → Repository)  
프론트엔드: 단일 React SPA (고객/관리자 라우팅 분리)  
API: REST API + SSE

---

## Backend Components

### 1. StoreController
- **책임**: 매장 관련 HTTP 요청 처리
- **레이어**: Controller

### 2. AuthController
- **책임**: 관리자 로그인/로그아웃, JWT 발급
- **레이어**: Controller

### 3. TableController
- **책임**: 테이블 초기 설정, 자동 로그인, 세션 관리 HTTP 요청 처리
- **레이어**: Controller

### 4. MenuController
- **책임**: 메뉴 CRUD, 이미지 업로드 HTTP 요청 처리
- **레이어**: Controller

### 5. OrderController
- **책임**: 주문 생성, 주문 내역 조회 HTTP 요청 처리
- **레이어**: Controller

### 6. SseController
- **책임**: 관리자용 실시간 주문 알림 SSE 스트림 제공
- **레이어**: Controller

### 7. StoreService
- **책임**: 매장 생성/조회 비즈니스 로직
- **레이어**: Service

### 8. AuthService
- **책임**: 관리자 인증, JWT 생성/검증, 로그인 시도 제한
- **레이어**: Service

### 9. TableService
- **책임**: 테이블 설정, 세션 생성/종료, 이용 완료 처리, 과거 이력 조회
- **레이어**: Service

### 10. MenuService
- **책임**: 메뉴 CRUD, 이미지 파일 저장, 순서 조정
- **레이어**: Service

### 11. OrderService
- **책임**: 주문 생성, 주문 상태 변경, 주문 삭제, 세션별 주문 조회
- **레이어**: Service

### 12. SseService
- **책임**: SSE 구독자 관리, 신규 주문 이벤트 발행
- **레이어**: Service

### 13. StoreRepository
- **책임**: Store 엔티티 DB CRUD
- **레이어**: Repository

### 14. AdminRepository
- **책임**: Admin 엔티티 DB CRUD
- **레이어**: Repository

### 15. TableRepository
- **책임**: Table 엔티티 DB CRUD
- **레이어**: Repository

### 16. CategoryRepository
- **책임**: Category 엔티티 DB CRUD
- **레이어**: Repository

### 17. MenuRepository
- **책임**: Menu 엔티티 DB CRUD
- **레이어**: Repository

### 18. OrderRepository
- **책임**: Order, OrderItem 엔티티 DB CRUD
- **레이어**: Repository

### 19. OrderHistoryRepository
- **책임**: OrderHistory 엔티티 DB CRUD (세션 종료 이력)
- **레이어**: Repository

---

## Frontend Components

### 20. CustomerApp (React)
- **책임**: 고객용 라우팅 및 전체 레이아웃 관리
- **주요 페이지**: MenuPage, CartPage, OrderHistoryPage, TableSetupPage

### 21. AdminApp (React)
- **책임**: 관리자용 라우팅 및 전체 레이아웃 관리
- **주요 페이지**: LoginPage, DashboardPage, TableManagePage, MenuManagePage
