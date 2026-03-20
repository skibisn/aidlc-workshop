# Business Logic Model - Unit 1: Backend API

## 1. 관리자 인증 플로우

```
POST /api/auth/login
  1. storeIdentifier로 Store 조회 → 없으면 401
  2. username으로 Admin 조회 (storeId 조건) → 없으면 401
  3. lockedUntil > now() 이면 → 423 (잠금)
  4. bcrypt.verify(password, admin.passwordHash) 실패 → failedLoginCount++ → 5회 이상이면 lockedUntil 설정 → 401
  5. 성공 → failedLoginCount=0, lockedUntil=null → JWT 발급 (16시간) → 200
```

## 2. 테이블 자동 로그인 플로우

```
POST /api/tables/auto-login
  1. storeIdentifier로 Store 조회 → 없으면 401
  2. tableNumber + storeId로 Table 조회 → 없으면 401
  3. bcrypt.verify(password, table.passwordHash) 실패 → 401
  4. currentSessionId가 없으면 새 UUID 세션 생성
  5. currentSessionId가 있으면 기존 세션 반환
  6. sessionToken(currentSessionId) 반환 → 200
```

## 3. 주문 생성 플로우

```
POST /api/orders
  1. sessionId == table.currentSessionId 검증 → 불일치 시 409
  2. 각 OrderItem의 menuId로 Menu 조회 (storeId 조건) → 없으면 400
  3. OrderItem 생성 (menuName, unitPrice 스냅샷)
  4. Order 생성 (totalAmount = sum(quantity * unitPrice))
  5. Table.totalAmount += order.totalAmount
  6. 트랜잭션 커밋
  7. SseService.publishNewOrder(storeId, orderEvent) 호출
  8. orderId 반환 → 201
```

## 4. 이용 완료 처리 플로우

```
POST /api/tables/{tableId}/complete
  1. tableId + storeId(JWT) 로 Table 조회 → 없으면 404
  2. currentSessionId가 null이면 → 400 (활성 세션 없음)
  3. 트랜잭션 시작:
     a. OrderHistory 생성 (sessionId, completedAt, totalAmount)
     b. Table.totalAmount = 0
     c. Table.currentSessionId = null
     d. Table.sessionCreatedAt = null
  4. 트랜잭션 커밋 → 200
```

## 5. SSE 실시간 알림 플로우

```
GET /api/sse/orders?storeId={storeId}
  1. JWT 검증 (관리자)
  2. SseEmitter 생성 (timeout: 30분)
  3. SseService에 emitter 등록 (storeId 키)
  4. 연결 유지

주문 생성 시 (OrderService → SseService):
  1. storeId에 등록된 모든 emitter에 OrderEvent 전송
  2. 전송 실패한 emitter는 목록에서 제거
```

## 6. 메뉴 이미지 업로드 플로우

```
POST /api/menus (multipart/form-data)
  1. 파일 확장자 검증 (jpg/jpeg/png/webp)
  2. UUID 파일명 생성
  3. /uploads/menus/{UUID}.{ext} 로 저장
  4. Menu.imagePath = "/uploads/menus/{UUID}.{ext}"
  5. Menu 저장 → 201
```

## 7. 과거 주문 내역 조회 플로우

```
GET /api/tables/{tableId}/history?date={yyyy-MM-dd}
  1. tableId + storeId(JWT) 로 Table 조회
  2. OrderHistory 조회 (tableId 조건, date 필터 적용)
  3. 각 OrderHistory의 sessionId로 Order + OrderItem 조회
  4. 시간 역순 정렬하여 반환
```
