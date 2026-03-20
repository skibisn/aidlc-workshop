# Business Rules - Unit 1: Backend API

## BR-AUTH-01: 관리자 로그인 시도 제한
- 로그인 실패 시 `Admin.failedLoginCount` 1 증가
- `failedLoginCount >= 5` 이면 `lockedUntil = now() + 30분` 설정
- 로그인 요청 시 `lockedUntil > now()` 이면 잠금 오류 반환
- 로그인 성공 시 `failedLoginCount = 0`, `lockedUntil = null` 초기화

## BR-AUTH-02: JWT 세션
- 로그인 성공 시 JWT 발급, 만료 시간 16시간
- JWT payload: `adminId`, `storeId`, `exp`
- 모든 관리자 API는 Authorization 헤더의 JWT 검증 필수

## BR-TABLE-01: 테이블 세션 생성
- 테이블 설정(setup) 또는 자동 로그인(auto-login) 성공 시 `currentSessionId = UUID.randomUUID()`
- `sessionCreatedAt = now()` 기록
- 기존 세션이 있어도 새 세션으로 덮어쓰기 (이용 완료 없이 재설정 허용)

## BR-TABLE-02: 이용 완료 처리 (completeSession)
트랜잭션 내 순서:
1. 현재 `sessionId`로 Order 목록 조회
2. OrderHistory 레코드 생성 (`sessionId`, `completedAt = now()`, `totalAmount`)
3. 해당 세션의 모든 Order를 OrderHistory에 연결 (sessionId로 식별)
4. `Table.totalAmount = 0`, `Table.currentSessionId = null`, `Table.sessionCreatedAt = null`

## BR-ORDER-01: 주문 생성
- 요청의 `sessionId`가 `Table.currentSessionId`와 일치해야 함 (불일치 시 오류)
- `storeId` 검증: 테이블이 해당 매장 소속인지 확인
- OrderItem 생성 시 메뉴명/단가를 Menu에서 스냅샷으로 복사
- 주문 생성 후 `Table.totalAmount += order.totalAmount`
- 주문 생성 후 SSE 이벤트 발행 (트랜잭션 커밋 후)

## BR-ORDER-02: 주문 상태 변경
- 관리자는 PENDING / PREPARING / COMPLETED 간 임의 변경 가능 (양방향)
- 상태 변경 권한: 해당 매장 관리자만 가능 (JWT의 storeId 검증)

## BR-ORDER-03: 주문 삭제
- 관리자만 삭제 가능
- 삭제 시 `Table.totalAmount -= order.totalAmount` 재계산
- 삭제된 주문의 OrderItem도 함께 삭제 (cascade)

## BR-ORDER-04: 주문 내역 조회 (고객)
- `tableId` + `sessionId` 조건으로 현재 세션 주문만 반환
- OrderHistory로 이동된 세션의 주문은 반환하지 않음

## BR-MENU-01: 메뉴 데이터 격리
- 모든 메뉴 조회/수정/삭제 시 `storeId` 조건 필수
- 다른 매장의 메뉴 접근 시 404 반환

## BR-MENU-02: 이미지 파일 저장
- 업로드된 이미지는 서버 로컬 디렉토리(`/uploads/menus/`)에 저장
- 파일명: `{UUID}.{확장자}` (원본 파일명 사용 안 함)
- 허용 확장자: jpg, jpeg, png, webp
- `Menu.imagePath`에 상대 경로 저장, Spring Boot static resource로 서빙

## BR-STORE-01: 데이터 격리
- 모든 도메인 쿼리(테이블, 메뉴, 주문)에 `storeId` 조건 포함
- JWT의 `storeId`와 요청 대상 리소스의 `storeId` 불일치 시 403 반환
