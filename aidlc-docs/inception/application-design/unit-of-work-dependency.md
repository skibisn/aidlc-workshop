# Unit of Work Dependency

## 의존성 관계

| Unit | 의존 대상 | 의존 유형 |
|------|-----------|-----------|
| Unit 1: Backend API | MySQL (외부) | 런타임 |
| Unit 2: Customer Frontend | Unit 1 Backend API | API 호출 (런타임) |
| Unit 3: Admin Frontend | Unit 1 Backend API | API 호출 + SSE (런타임) |

## 개발 순서 근거

```
Unit 1 (Backend)
    |
    | API 계약 확정 후
    v
Unit 2 (Customer Frontend)
    |
    | 병렬 가능하나 순차 권장
    v
Unit 3 (Admin Frontend)
```

- Unit 2, 3은 Unit 1의 API 엔드포인트에 의존
- Unit 1 완료 후 API 계약이 확정되므로 순차 개발이 안전
- Unit 2와 Unit 3은 서로 독립적 (병렬 개발 가능)

## 통합 포인트

| 통합 포인트 | Unit 2 | Unit 3 |
|------------|--------|--------|
| 테이블 자동 로그인 | POST /api/tables/auto-login | - |
| 메뉴 조회 | GET /api/menus | GET /api/menus |
| 주문 생성 | POST /api/orders | - |
| 주문 조회 | GET /api/orders | GET /api/orders |
| SSE 구독 | - | GET /api/sse/orders |
| 관리자 로그인 | - | POST /api/auth/login |
| 테이블 관리 | - | POST /api/tables/setup, POST /api/tables/{id}/complete |
| 메뉴 관리 | - | POST/PUT/DELETE /api/menus |
