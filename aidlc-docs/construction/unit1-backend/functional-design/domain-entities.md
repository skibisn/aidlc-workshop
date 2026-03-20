# Domain Entities - Unit 1: Backend API

## Store
```
Store {
  id: Long (PK)
  identifier: String (unique) - 매장 식별자 (로그인/테이블 설정에 사용)
  name: String
  createdAt: LocalDateTime
}
```

## Admin
```
Admin {
  id: Long (PK)
  storeId: Long (FK → Store)
  username: String
  passwordHash: String - bcrypt 해시
  failedLoginCount: Integer - 로그인 실패 횟수
  lockedUntil: LocalDateTime (nullable) - 잠금 해제 시각
  createdAt: LocalDateTime
}
```

## Table
```
Table {
  id: Long (PK)
  storeId: Long (FK → Store)
  tableNumber: String - 테이블 번호 (매장 내 고유)
  passwordHash: String - bcrypt 해시
  currentSessionId: String (UUID, nullable) - 현재 활성 세션
  sessionCreatedAt: LocalDateTime (nullable)
  totalAmount: BigDecimal - 현재 세션 총 주문액
}
```

## Category
```
Category {
  id: Long (PK)
  storeId: Long (FK → Store)
  name: String
  sortOrder: Integer
}
```

## Menu
```
Menu {
  id: Long (PK)
  storeId: Long (FK → Store)
  categoryId: Long (FK → Category)
  name: String
  price: BigDecimal
  description: String (nullable)
  imagePath: String (nullable) - 서버 로컬 파일 경로
  sortOrder: Integer
}
```

## Order
```
Order {
  id: Long (PK)
  storeId: Long (FK → Store)
  tableId: Long (FK → Table)
  sessionId: String (UUID) - 주문 시점의 테이블 세션 ID
  status: OrderStatus (PENDING / PREPARING / COMPLETED)
  totalAmount: BigDecimal
  createdAt: LocalDateTime
}
```

## OrderItem
```
OrderItem {
  id: Long (PK)
  orderId: Long (FK → Order)
  menuId: Long (FK → Menu, nullable) - 메뉴 삭제 시 null 허용
  menuName: String - 주문 시점 메뉴명 스냅샷
  quantity: Integer
  unitPrice: BigDecimal - 주문 시점 단가 스냅샷
}
```

## OrderHistory
```
OrderHistory {
  id: Long (PK)
  storeId: Long (FK → Store)
  tableId: Long (FK → Table)
  sessionId: String (UUID)
  completedAt: LocalDateTime - 이용 완료 처리 시각
  totalAmount: BigDecimal - 세션 전체 주문 총액
}
```

## Enum: OrderStatus
```
PENDING    - 대기중
PREPARING  - 준비중
COMPLETED  - 완료
```
