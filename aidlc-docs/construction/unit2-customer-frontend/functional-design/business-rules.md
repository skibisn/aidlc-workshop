# Business Rules - Unit 2: Customer Frontend

## BR-CF-01: 자동 로그인 체크
- 앱 시작 시 localStorage에 `tableorder_session_id` 존재 여부 확인
- 존재하면 → /menu 이동
- 없으면 → /setup 이동

## BR-CF-02: 장바구니 localStorage 동기화
- 메뉴 추가/삭제/수량 변경 즉시 localStorage 업데이트
- 페이지 새로고침 시 localStorage에서 복원

## BR-CF-03: 수량 최소값
- 수량 감소 시 1 미만이 되면 해당 항목 삭제

## BR-CF-04: 주문 성공 처리
- 주문 성공 시 orderId 표시
- localStorage `tableorder_cart` 비우기
- /menu로 이동

## BR-CF-05: 주문 실패 처리
- 에러 메시지 표시
- 장바구니 유지 (localStorage 그대로)

## BR-CF-06: 빈 장바구니 주문 방지
- cartItems가 비어있으면 주문 버튼 비활성화
