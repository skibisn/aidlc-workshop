# Component Dependency

## 의존성 방향
Controller → Service → Repository  
Service → Service (OrderService → SseService)

---

## 의존성 매트릭스

| Component | 의존 대상 |
|-----------|-----------|
| AuthController | AuthService |
| TableController | TableService |
| MenuController | MenuService |
| OrderController | OrderService |
| SseController | SseService |
| AuthService | AdminRepository, StoreRepository |
| TableService | TableRepository, OrderRepository, OrderHistoryRepository |
| MenuService | MenuRepository, CategoryRepository |
| OrderService | OrderRepository, TableRepository, SseService |
| SseService | (없음 - 메모리 상태만 관리) |

---

## 데이터 흐름

### 고객 주문 흐름
```
CustomerApp
  → POST /api/tables/auto-login → TableController → TableService → TableRepository
  → GET /api/menus              → MenuController  → MenuService  → MenuRepository
  → POST /api/orders            → OrderController → OrderService → OrderRepository
                                                               → SseService (이벤트 발행)
```

### 관리자 실시간 모니터링 흐름
```
AdminApp
  → GET /api/sse/orders (SSE 구독) → SseController → SseService
  <- SSE 이벤트 수신 (OrderService가 주문 생성 시 발행)
```

### 테이블 이용 완료 흐름
```
AdminApp
  → POST /api/tables/{id}/complete → TableController → TableService
      → OrderRepository       (현재 세션 주문 조회)
      → OrderHistoryRepository (이력 저장)
      → TableRepository        (총액 리셋)
```

---

## 프론트엔드 통신 방식

| 프론트엔드 | 통신 방식 | 백엔드 엔드포인트 |
|-----------|-----------|-----------------|
| CustomerApp | REST API | /api/tables, /api/menus, /api/orders |
| AdminApp | REST API | /api/auth, /api/orders, /api/tables, /api/menus |
| AdminApp | SSE | /api/sse/orders |
