# Unit of Work Story Map

## 스토리 → Unit 매핑

| Story ID | Story 제목 | Unit |
|----------|-----------|------|
| US-C-01 | 테이블 자동 로그인 | Unit 1 (API) + Unit 2 (Customer FE) |
| US-C-02 | 메뉴 탐색 | Unit 1 (API) + Unit 2 (Customer FE) |
| US-C-03 | 장바구니 관리 | Unit 2 (Customer FE) |
| US-C-04 | 주문 생성 | Unit 1 (API) + Unit 2 (Customer FE) |
| US-C-05 | 주문 내역 조회 | Unit 1 (API) + Unit 2 (Customer FE) |
| US-A-01 | 매장 로그인 | Unit 1 (API) + Unit 3 (Admin FE) |
| US-A-02 | 실시간 주문 모니터링 | Unit 1 (API/SSE) + Unit 3 (Admin FE) |
| US-A-03 | 테이블 관리 | Unit 1 (API) + Unit 3 (Admin FE) |
| US-A-04 | 메뉴 관리 | Unit 1 (API) + Unit 3 (Admin FE) |

## Unit별 스토리 요약

### Unit 1: Backend API
- 모든 스토리의 API 레이어 담당 (US-C-01~05, US-A-01~04)
- SSE 실시간 기능: US-A-02

### Unit 2: Customer Frontend
- US-C-01: 자동 로그인 UI + 로컬 스토리지
- US-C-02: 메뉴 카드 그리드, 카테고리 탭
- US-C-03: 장바구니 (로컬 스토리지, 수량 조절)
- US-C-04: 주문 확정 화면, 성공/실패 처리
- US-C-05: 주문 내역 목록, 상태 표시

### Unit 3: Admin Frontend
- US-A-01: 로그인 폼, JWT 저장, 세션 유지
- US-A-02: 테이블별 카드 그리드, SSE 구독, 신규 주문 강조
- US-A-03: 테이블 설정, 주문 삭제, 이용 완료, 과거 내역 조회
- US-A-04: 메뉴 목록, 등록/수정/삭제 폼, 이미지 업로드, 순서 조정
