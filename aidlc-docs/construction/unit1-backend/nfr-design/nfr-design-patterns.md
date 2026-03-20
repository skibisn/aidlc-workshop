# NFR Design Patterns - Unit 1: Backend API

## 1. 보안 패턴

### JWT Authentication Filter
- `OncePerRequestFilter` 구현체로 모든 요청에서 JWT 검증
- `/api/auth/login`, `/api/tables/auto-login`, `/api/menus` (GET), `/api/orders` (POST/GET), `/api/sse/orders` 는 인증 불필요
- 나머지 관리자 API는 JWT 필수

### Store Isolation Pattern
- `@PreAuthorize` 또는 Service 레이어에서 JWT의 `storeId`와 요청 리소스의 `storeId` 일치 검증
- 불일치 시 `403 Forbidden` 반환

### Brute Force Protection
- `Admin` 엔티티의 `failedLoginCount`, `lockedUntil` 필드로 상태 관리
- 로그인 시도마다 DB 업데이트 (별도 캐시 불필요 — 중규모 기준)

## 2. 실시간 통신 패턴 (SSE)

### Publisher-Subscriber (In-Memory)
```
SseService {
  Map<Long, List<SseEmitter>> emitters  // storeId → emitter 목록
  
  subscribe(storeId) → SseEmitter
  publishNewOrder(storeId, event) → 해당 storeId emitter 전체 전송
  removeEmitter(storeId, emitter) → 실패/만료 emitter 제거
}
```
- 단일 인스턴스 배포이므로 in-memory Map으로 충분
- `CopyOnWriteArrayList` 사용으로 동시성 안전

### Emitter Lifecycle Management
- emitter 생성 시 `onCompletion`, `onTimeout`, `onError` 콜백으로 자동 제거
- timeout: 30분

## 3. 트랜잭션 패턴

### Transactional Outbox (간소화)
- 주문 생성: `@Transactional` 내에서 DB 저장 완료 후 `TransactionSynchronizationManager`로 커밋 후 SSE 발행
- 이용 완료: `@Transactional`로 OrderHistory 생성 + Table 리셋 원자적 처리

## 4. 파일 업로드 패턴

### UUID Rename + Static Serving
- 업로드 파일명을 UUID로 변경하여 경로 예측 공격 방지
- `spring.web.resources.static-locations`에 업로드 디렉토리 추가하여 정적 서빙
- 파일 크기 제한: `spring.servlet.multipart.max-file-size=5MB`

## 5. 에러 처리 패턴

### Global Exception Handler
- `@RestControllerAdvice`로 전역 예외 처리
- 표준 에러 응답 형식:
```json
{
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "설명"
}
```
- 주요 예외: `EntityNotFoundException(404)`, `AccessDeniedException(403)`, `LockedException(423)`, `ValidationException(400)`

## 6. 로깅 패턴

### Request/Response Logging
- `HandlerInterceptor` 또는 `Filter`로 요청 메서드, URI, 응답 상태 코드 로깅
- 민감 정보(비밀번호, JWT 토큰) 로그 제외
