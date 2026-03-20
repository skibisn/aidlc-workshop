# Services

## 서비스 레이어 설계 원칙
- Controller는 HTTP 요청/응답만 처리, 비즈니스 로직은 Service에 위임
- Service는 트랜잭션 경계를 담당
- Repository는 DB 접근만 담당

---

## AuthService
- **역할**: 관리자 인증 오케스트레이션
- **상호작용**: AdminRepository → JWT 생성 → 로그인 시도 카운터 관리
- **트랜잭션**: 로그인 시도 기록 시 트랜잭션 필요

## TableService
- **역할**: 테이블 세션 라이프사이클 오케스트레이션
- **상호작용**: TableRepository, OrderRepository, OrderHistoryRepository
- **트랜잭션**: completeSession 시 주문 이력 이동 + 총액 리셋 원자적 처리 필요

## MenuService
- **역할**: 메뉴 CRUD 및 이미지 파일 저장 오케스트레이션
- **상호작용**: MenuRepository, CategoryRepository, 파일 시스템
- **트랜잭션**: 메뉴 저장 + 이미지 파일 저장 순서 관리

## OrderService
- **역할**: 주문 생성 및 상태 관리 오케스트레이션
- **상호작용**: OrderRepository, TableRepository, SseService
- **트랜잭션**: 주문 생성 후 SSE 이벤트 발행 (트랜잭션 커밋 후 발행)

## SseService
- **역할**: SSE 구독자 관리 및 이벤트 브로드캐스트
- **상호작용**: 메모리 내 SseEmitter Map 관리
- **특이사항**: 상태 비저장(stateless) 불가 — 서버 메모리에 emitter 보관
