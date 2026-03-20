# 테이블오더 시스템 요구사항 문서

## Intent Analysis

- **User Request**: 테이블오더 서비스 시스템 구축 (requirements/table-order-requirements.md 기반)
- **Request Type**: New Project (Greenfield)
- **Scope**: System-wide (고객 UI + 관리자 UI + 서버 + DB)
- **Complexity**: Complex

---

## 기술 스택 결정사항

| 항목 | 선택 |
|------|------|
| 서버 | Java + Spring Boot |
| 프론트엔드 | React (TypeScript) |
| 데이터베이스 | MySQL |
| 배포 환경 | 로컬 서버 / On-premises |
| 이미지 관리 | 서버에 직접 파일 업로드 |
| 초기 데이터 | Seed 데이터 스크립트 |
| 매장 지원 | 다중 매장 (매장별 독립 운영) |
| 메뉴 관리 MVP | 포함 (관리자 CRUD) |

---

## 1. 기능 요구사항 (Functional Requirements)

### 1.1 고객용 기능

#### FR-C-01: 테이블 자동 로그인
- 관리자가 1회 매장 식별자, 테이블 번호, 테이블 비밀번호 설정
- 설정 정보 로컬 저장 후 자동 로그인
- 이후 페이지 접근 시 저장된 정보로 자동 인증

#### FR-C-02: 메뉴 조회 및 탐색
- 카테고리별 메뉴 분류 표시
- 메뉴 상세 정보: 메뉴명, 가격, 설명, 이미지
- 카드 형태 레이아웃, 터치 친화적 UI (최소 44x44px 버튼)
- 메뉴 화면이 기본(홈) 화면

#### FR-C-03: 장바구니 관리
- 메뉴 추가/삭제, 수량 조절
- 총 금액 실시간 계산
- 로컬 저장 (페이지 새로고침 시 유지)
- 서버 전송은 주문 확정 시에만

#### FR-C-04: 주문 생성
- 주문 내역 최종 확인 후 확정
- 주문 성공 시: 주문 번호 표시 → 장바구니 비우기 → 메뉴 화면 리다이렉트
- 주문 실패 시: 에러 메시지 표시, 장바구니 유지
- 주문 정보: 매장 ID, 테이블 ID, 메뉴 목록(메뉴명/수량/단가), 총 금액, 세션 ID

#### FR-C-05: 주문 내역 조회
- 현재 테이블 세션의 주문만 표시
- 주문 시간 순 정렬
- 주문별: 주문 번호, 시각, 메뉴 및 수량, 금액, 상태(대기중/준비중/완료)
- 완료 처리된 세션 주문 제외

### 1.2 관리자용 기능

#### FR-A-01: 매장 인증
- 매장 식별자 + 사용자명 + 비밀번호 로그인
- JWT 토큰 기반 인증, 16시간 세션 유지
- 비밀번호 bcrypt 해싱
- 로그인 시도 제한

#### FR-A-02: 실시간 주문 모니터링
- Server-Sent Events (SSE) 기반 실시간 업데이트 (2초 이내)
- 테이블별 카드 그리드 레이아웃
- 각 카드: 테이블 번호, 총 주문액, 최신 주문 미리보기
- 카드 클릭 시 전체 메뉴 목록 상세 보기
- 주문 상태 변경 (대기중/준비중/완료)
- 신규 주문 시각적 강조 (색상 변경, 애니메이션)

#### FR-A-03: 테이블 관리
- 테이블 초기 설정 (번호, 비밀번호, 16시간 세션 생성)
- 주문 삭제 (확인 팝업 → 즉시 삭제 → 총액 재계산)
- 테이블 이용 완료 처리:
  - 현재 세션 주문 → 과거 이력으로 이동
  - 테이블 주문 목록 및 총액 0으로 리셋
- 과거 주문 내역 조회 (시간 역순, 날짜 필터링)

#### FR-A-04: 메뉴 관리 (MVP 포함)
- 메뉴 조회 (카테고리별)
- 메뉴 등록: 메뉴명, 가격, 설명, 카테고리, 이미지 파일 업로드
- 메뉴 수정, 삭제
- 메뉴 노출 순서 조정
- 필수 필드 및 가격 범위 검증

### 1.3 다중 매장 지원

#### FR-S-01: 매장 독립 운영
- 각 매장은 독립적인 메뉴, 테이블, 주문 데이터 보유
- 매장 식별자로 데이터 격리

---

## 2. 비기능 요구사항 (Non-Functional Requirements)

### 2.1 성능
- SSE 기반 실시간 주문 업데이트: 2초 이내 반영
- 메뉴 조회 응답: 1초 이내

### 2.2 보안
- JWT 토큰 기반 관리자 인증 (16시간 만료)
- 비밀번호 bcrypt 해싱
- 로그인 시도 횟수 제한 (Brute-force 방지)
- 테이블 세션 기반 고객 인증

### 2.3 사용성
- 터치 친화적 UI (최소 44x44px 버튼)
- 카드 형태 메뉴 레이아웃
- 명확한 시각적 계층 구조

### 2.4 데이터 무결성
- 테이블 세션 기반 주문 그룹화
- 이용 완료 처리 시 주문 이력 보존 (OrderHistory)
- 장바구니 로컬 저장 (새로고침 유지)

---

## 3. 제외 범위 (constraints.md 기반)

- 실제 결제 처리 및 PG사 연동
- 복잡한 사용자 인증 (OAuth, 2FA)
- 이미지 리사이징/최적화
- 푸시/SMS/이메일 알림
- 주방 기능 (주방 전달, 재고 관리)
- 데이터 분석, 매출 리포트
- 외부 시스템 연동 (배달 플랫폼, POS)

---

## 4. 데이터 모델 개요

| 엔티티 | 주요 속성 |
|--------|-----------|
| Store | id, identifier, name |
| Admin | id, store_id, username, password_hash |
| Table | id, store_id, table_number, password, session_token |
| Category | id, store_id, name, sort_order |
| Menu | id, store_id, category_id, name, price, description, image_path, sort_order |
| Order | id, store_id, table_id, session_id, status, total_amount, created_at |
| OrderItem | id, order_id, menu_id, menu_name, quantity, unit_price |
| OrderHistory | id, store_id, table_id, session_id, completed_at (세션 종료 이력) |

---

## 5. MVP 범위 요약

**고객용**: 자동 로그인, 메뉴 조회, 장바구니, 주문 생성, 주문 내역 조회  
**관리자용**: 매장 인증, 실시간 주문 모니터링(SSE), 테이블 관리, 메뉴 관리(CRUD)  
**인프라**: Spring Boot API 서버, React SPA, MySQL, 로컬 파일 업로드
