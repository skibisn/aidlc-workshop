# Frontend Components - Unit 2: Customer Frontend

## 컴포넌트 계층 구조

```
App
└── CustomerApp (라우터)
    ├── TableSetupPage       /setup
    ├── MenuPage             /menu (기본 화면)
    │   ├── CategoryTabs
    │   └── MenuCard (반복)
    ├── CartPage             /cart
    │   ├── CartItem (반복)
    │   └── OrderSummary
    ├── OrderConfirmPage     /order/confirm
    └── OrderHistoryPage     /orders
        └── OrderHistoryItem (반복)
```

---

## 컴포넌트 상세

### TableSetupPage
- **역할**: 관리자가 1회 설정하는 화면. storeIdentifier, tableNumber, password 입력
- **Props**: 없음
- **State**: `storeIdentifier`, `tableNumber`, `password`, `error`
- **API**: POST /api/tables/auto-login
- **동작**: 성공 시 localStorage에 저장 → /menu 이동
- **data-testid**: `setup-store-input`, `setup-table-input`, `setup-password-input`, `setup-submit-button`

### MenuPage
- **역할**: 기본(홈) 화면. 카테고리 탭 + 메뉴 카드 그리드
- **Props**: 없음
- **State**: `menus`, `categories`, `selectedCategoryId`
- **API**: GET /api/menus?storeId={storeId}
- **data-testid**: `category-tab-{id}`, `menu-card-{id}`, `cart-button`

### CategoryTabs
- **Props**: `categories`, `selectedId`, `onSelect`
- **data-testid**: `category-tab-{id}`

### MenuCard
- **Props**: `menu` (id, name, price, description, imagePath)
- **동작**: 클릭 시 장바구니에 추가
- **data-testid**: `menu-card-{id}`, `menu-add-button-{id}`

### CartPage
- **역할**: 장바구니 목록, 수량 조절, 총액 표시
- **Props**: 없음
- **State**: localStorage에서 로드한 `cartItems`
- **data-testid**: `cart-item-{menuId}`, `quantity-increase-{menuId}`, `quantity-decrease-{menuId}`, `cart-delete-{menuId}`, `cart-total`, `cart-order-button`

### OrderConfirmPage
- **역할**: 주문 확정 전 최종 확인
- **Props**: 없음
- **State**: `cartItems`, `isSubmitting`, `orderId`
- **API**: POST /api/orders
- **동작**: 성공 시 orderId 표시 → 장바구니 비우기 → /menu 이동
- **data-testid**: `confirm-submit-button`, `order-success-message`

### OrderHistoryPage
- **역할**: 현재 세션 주문 내역 목록
- **Props**: 없음
- **State**: `orders`
- **API**: GET /api/orders?tableId={tableId}&sessionId={sessionId}
- **data-testid**: `order-history-item-{orderId}`, `order-status-{orderId}`

---

## 전역 상태 (localStorage)

| 키 | 값 | 설명 |
|----|-----|------|
| `tableorder_store_id` | storeId (number) | 매장 ID |
| `tableorder_table_id` | tableId (number) | 테이블 ID |
| `tableorder_session_id` | sessionId (string) | 현재 세션 UUID |
| `tableorder_cart` | CartItem[] (JSON) | 장바구니 |

## CartItem 타입
```typescript
interface CartItem {
  menuId: number;
  menuName: string;
  unitPrice: number;
  quantity: number;
}
```
