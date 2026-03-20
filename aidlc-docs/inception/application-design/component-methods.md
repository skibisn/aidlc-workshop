# Component Methods

상세 비즈니스 로직은 Construction Phase의 Functional Design에서 정의됩니다.

---

## AuthController
| 메서드 | HTTP | 경로 | 입력 | 출력 |
|--------|------|------|------|------|
| login | POST | /api/auth/login | LoginRequest(storeIdentifier, username, password) | JwtResponse(token, expiresAt) |
| logout | POST | /api/auth/logout | - | 200 OK |

## TableController
| 메서드 | HTTP | 경로 | 입력 | 출력 |
|--------|------|------|------|------|
| setup | POST | /api/tables/setup | TableSetupRequest(storeIdentifier, tableNumber, password) | TableSessionResponse(sessionToken) |
| autoLogin | POST | /api/tables/auto-login | AutoLoginRequest(storeIdentifier, tableNumber, password) | TableSessionResponse(sessionToken) |
| complete | POST | /api/tables/{tableId}/complete | - | 200 OK |
| getHistory | GET | /api/tables/{tableId}/history | date(query) | List\<OrderHistoryResponse\> |

## MenuController
| 메서드 | HTTP | 경로 | 입력 | 출력 |
|--------|------|------|------|------|
| getMenus | GET | /api/menus | categoryId(query, optional) | List\<MenuResponse\> |
| createMenu | POST | /api/menus | MenuRequest(multipart) | MenuResponse |
| updateMenu | PUT | /api/menus/{menuId} | MenuRequest(multipart) | MenuResponse |
| deleteMenu | DELETE | /api/menus/{menuId} | - | 200 OK |
| updateOrder | PATCH | /api/menus/order | List\<MenuOrderRequest\> | 200 OK |

## OrderController
| 메서드 | HTTP | 경로 | 입력 | 출력 |
|--------|------|------|------|------|
| createOrder | POST | /api/orders | OrderRequest(tableId, sessionId, items) | OrderResponse(orderId) |
| getOrders | GET | /api/orders | tableId, sessionId(query) | List\<OrderResponse\> |
| updateStatus | PATCH | /api/orders/{orderId}/status | StatusRequest(status) | 200 OK |
| deleteOrder | DELETE | /api/orders/{orderId} | - | 200 OK |

## SseController
| 메서드 | HTTP | 경로 | 입력 | 출력 |
|--------|------|------|------|------|
| subscribe | GET | /api/sse/orders | storeId(query) | SseEmitter |

---

## AuthService
| 메서드 | 입력 | 출력 | 비고 |
|--------|------|------|------|
| authenticate | storeIdentifier, username, password | JwtToken | 로그인 시도 제한 포함 |
| validateToken | token | AdminDetails | JWT 검증 |

## TableService
| 메서드 | 입력 | 출력 | 비고 |
|--------|------|------|------|
| setupTable | storeId, tableNumber, password | SessionToken | 16시간 세션 생성 |
| autoLogin | storeIdentifier, tableNumber, password | SessionToken | 저장된 정보로 인증 |
| completeSession | tableId | void | 주문 이력 이동, 총액 리셋 |
| getHistory | tableId, date | List\<OrderHistory\> | 날짜 필터링 |

## MenuService
| 메서드 | 입력 | 출력 | 비고 |
|--------|------|------|------|
| getMenus | storeId, categoryId | List\<Menu\> | |
| createMenu | storeId, MenuData, imageFile | Menu | 파일 저장 포함 |
| updateMenu | menuId, MenuData, imageFile | Menu | |
| deleteMenu | menuId | void | |
| updateOrder | List\<menuId, sortOrder\> | void | |

## OrderService
| 메서드 | 입력 | 출력 | 비고 |
|--------|------|------|------|
| createOrder | tableId, sessionId, items | Order | SSE 이벤트 발행 |
| getOrdersBySession | tableId, sessionId | List\<Order\> | 현재 세션만 |
| updateStatus | orderId, status | void | |
| deleteOrder | orderId | void | 총액 재계산 |

## SseService
| 메서드 | 입력 | 출력 | 비고 |
|--------|------|------|------|
| subscribe | storeId | SseEmitter | 구독자 등록 |
| publishNewOrder | storeId, OrderEvent | void | 신규 주문 브로드캐스트 |
