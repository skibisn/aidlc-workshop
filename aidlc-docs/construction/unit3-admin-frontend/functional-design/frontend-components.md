# Frontend Components - Unit 3: Admin Frontend

## 컴포넌트 계층 구조

```
AdminApp (라우터)
├── LoginPage              /admin/login
└── (인증 필요)
    ├── DashboardPage      /admin/dashboard  (기본 화면)
    │   └── TableCard (반복)
    │       └── OrderDetailModal (클릭 시)
    ├── TableManagePage    /admin/tables
    │   ├── TableSetupModal
    │   ├── OrderDeleteConfirm
    │   ├── CompleteSessionConfirm
    │   └── OrderHistoryModal
    └── MenuManagePage     /admin/menus
        ├── MenuForm (등록/수정)
        └── MenuOrderList
```

---

## 컴포넌트 상세

### LoginPage
- **State**: `storeIdentifier`, `username`, `password`, `error`
- **API**: POST /api/auth/login
- **동작**: 성공 시 JWT → localStorage → /admin/dashboard
- **data-testid**: `login-store-input`, `login-username-input`, `login-password-input`, `login-submit-button`

### DashboardPage
- **State**: `tables` (테이블별 주문 현황), `sseConnected`
- **API**: GET /api/orders?storeId={storeId} (초기), SSE /api/sse/orders?storeId={storeId}
- **동작**: SSE 구독으로 신규 주문 실시간 반영, 신규 주문 카드 강조
- **data-testid**: `table-card-{tableId}`, `table-total-{tableId}`, `order-status-select-{orderId}`

### TableManagePage
- **State**: `tables`, `selectedTable`, `showHistory`
- **API**: POST /api/tables/setup, POST /api/tables/{id}/complete, DELETE /api/orders/{id}, GET /api/tables/{id}/history
- **data-testid**: `table-setup-button-{tableId}`, `complete-session-button-{tableId}`, `delete-order-button-{orderId}`, `history-button-{tableId}`

### MenuManagePage
- **State**: `menus`, `categories`, `editingMenu`
- **API**: GET/POST/PUT/DELETE /api/menus, PATCH /api/menus/order
- **data-testid**: `menu-create-button`, `menu-edit-button-{menuId}`, `menu-delete-button-{menuId}`, `menu-form-name`, `menu-form-price`, `menu-form-submit`

---

## 전역 상태 (localStorage)

| 키 | 값 |
|----|-----|
| `admin_token` | JWT token |
| `admin_store_id` | storeId |
