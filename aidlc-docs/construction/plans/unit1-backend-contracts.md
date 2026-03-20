# Contract/Interface Definition - Unit 1: Backend API

## Unit Context
- **Stories**: US-C-01, US-C-02, US-C-03, US-C-04, US-C-05, US-A-01, US-A-02, US-A-03, US-A-04
- **Workspace Root**: /Users/avo/code/aidlc-workshop
- **Code Location**: `backend/src/main/java/com/tableorder/`
- **Test Location**: `backend/src/test/java/com/tableorder/`
- **Database Entities**: Store, Admin, Table, Category, Menu, Order, OrderItem, OrderHistory

---

## Domain Entities (JPA)

### Store
- `id`, `identifier` (unique), `name`, `createdAt`

### Admin
- `id`, `storeId`, `username`, `passwordHash`, `failedLoginCount`, `lockedUntil`, `createdAt`

### Table
- `id`, `storeId`, `tableNumber`, `passwordHash`, `currentSessionId` (UUID), `sessionCreatedAt`, `totalAmount`

### Category
- `id`, `storeId`, `name`, `sortOrder`

### Menu
- `id`, `storeId`, `categoryId`, `name`, `price`, `description`, `imagePath`, `sortOrder`

### Order
- `id`, `storeId`, `tableId`, `sessionId`, `status` (PENDING/PREPARING/COMPLETED), `totalAmount`, `createdAt`

### OrderItem
- `id`, `orderId`, `menuId` (nullable), `menuName`, `quantity`, `unitPrice`

### OrderHistory
- `id`, `storeId`, `tableId`, `sessionId`, `completedAt`, `totalAmount`

---

## Business Logic Layer

### AuthService
- `authenticate(storeIdentifier, username, password) -> JwtResponse`
  - Returns: JWT token + expiresAt
  - Raises: UnauthorizedException, AccountLockedException
- `validateToken(token) -> AdminDetails`
  - Raises: InvalidTokenException

### TableService
- `autoLogin(storeIdentifier, tableNumber, password) -> TableSessionResponse`
  - Returns: sessionToken (currentSessionId)
  - Raises: UnauthorizedException
- `setupTable(storeId, tableNumber, password) -> TableSessionResponse`
- `completeSession(tableId, storeId) -> void`
  - Raises: NotFoundException, NoActiveSessionException
- `getHistory(tableId, storeId, date) -> List<OrderHistoryResponse>`

### MenuService
- `getMenus(storeId, categoryId) -> List<MenuResponse>`
- `createMenu(storeId, menuData, imageFile) -> MenuResponse`
  - Raises: InvalidFileException
- `updateMenu(menuId, storeId, menuData, imageFile) -> MenuResponse`
  - Raises: NotFoundException
- `deleteMenu(menuId, storeId) -> void`
- `updateOrder(storeId, List<menuId, sortOrder>) -> void`

### OrderService
- `createOrder(tableId, sessionId, storeId, items) -> OrderResponse`
  - Raises: InvalidSessionException, NotFoundException
- `getOrdersBySession(tableId, sessionId) -> List<OrderResponse>`
- `updateStatus(orderId, storeId, status) -> void`
  - Raises: NotFoundException, AccessDeniedException
- `deleteOrder(orderId, storeId) -> void`
  - Raises: NotFoundException, AccessDeniedException

### SseService
- `subscribe(storeId) -> SseEmitter`
- `publishNewOrder(storeId, orderEvent) -> void`

### FileStorageService
- `store(file) -> String` (저장 경로 반환)
  - Raises: InvalidFileException
- `delete(filePath) -> void`

---

## API Layer

### POST /api/auth/login → 200 JwtResponse | 401 | 423
### POST /api/auth/logout → 200
### POST /api/tables/auto-login → 200 TableSessionResponse | 401
### POST /api/tables/setup → 200 TableSessionResponse (관리자 전용)
### POST /api/tables/{tableId}/complete → 200 (관리자 전용)
### GET  /api/tables/{tableId}/history → 200 List<OrderHistoryResponse> (관리자 전용)
### GET  /api/menus → 200 List<MenuResponse>
### POST /api/menus → 201 MenuResponse (관리자 전용, multipart)
### PUT  /api/menus/{menuId} → 200 MenuResponse (관리자 전용)
### DELETE /api/menus/{menuId} → 200 (관리자 전용)
### PATCH /api/menus/order → 200 (관리자 전용)
### POST /api/orders → 201 OrderResponse
### GET  /api/orders → 200 List<OrderResponse>
### PATCH /api/orders/{orderId}/status → 200 (관리자 전용)
### DELETE /api/orders/{orderId} → 200 (관리자 전용)
### GET  /api/sse/orders → SSE stream (관리자 전용)
