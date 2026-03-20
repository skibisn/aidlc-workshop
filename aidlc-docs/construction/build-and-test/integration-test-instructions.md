# Integration Test Instructions

## 환경 시작
```bash
./start.sh
```

---

## 시나리오 1: 고객 주문 플로우 (US-C-01 ~ US-C-05)

```bash
BASE=http://localhost:8080/api

# 1. 테이블 자동 로그인
curl -s -X POST $BASE/tables/auto-login \
  -H "Content-Type: application/json" \
  -d '{"storeIdentifier":"store-001","tableNumber":"1","password":"admin1234"}'
# 기대: {"sessionId": "uuid-..."}

# 2. 메뉴 조회
curl -s "$BASE/menus?storeId=1"
# 기대: 메뉴 목록 JSON

# 3. 주문 생성 (sessionId는 위에서 받은 값으로 교체)
curl -s -X POST $BASE/orders \
  -H "Content-Type: application/json" \
  -d '{"tableId":1,"sessionId":"<SESSION_ID>","storeId":1,"items":[{"menuId":1,"quantity":2}]}'
# 기대: {"orderId": 1}

# 4. 주문 내역 조회
curl -s "$BASE/orders?tableId=1&sessionId=<SESSION_ID>"
# 기대: 주문 목록 (status: PENDING)
```

---

## 시나리오 2: 관리자 플로우 (US-A-01 ~ US-A-04)

```bash
# 1. 관리자 로그인
TOKEN=$(curl -s -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"storeIdentifier":"store-001","username":"admin","password":"admin1234"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# 2. 주문 상태 변경
curl -s -X PATCH "$BASE/orders/1/status?storeId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"PREPARING"}'
# 기대: 200 OK

# 3. 테이블 이용 완료
curl -s -X POST "$BASE/tables/1/complete" \
  -H "Authorization: Bearer $TOKEN"
# 기대: 200 OK

# 4. 과거 내역 조회
curl -s "$BASE/tables/1/history" \
  -H "Authorization: Bearer $TOKEN"
# 기대: 이용 완료된 세션 목록
```

---

## 시나리오 3: SSE 실시간 알림

```bash
# 터미널 1: SSE 구독
curl -s -N -H "Authorization: Bearer $TOKEN" \
  "$BASE/sse/orders?storeId=1"

# 터미널 2: 주문 생성 (위 시나리오 1의 주문 생성 명령 실행)
# 터미널 1에서 new-order 이벤트 수신 확인
```

---

## 환경 종료
```bash
./stop.sh
```
