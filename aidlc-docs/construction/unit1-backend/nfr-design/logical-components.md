# Logical Components - Unit 1: Backend API

## 추가 논리 컴포넌트 (NFR 적용으로 도출)

### JwtTokenProvider
- **역할**: JWT 생성, 파싱, 검증
- **위치**: `security/` 패키지
- **주요 메서드**: `generateToken(adminId, storeId)`, `validateToken(token)`, `getAdminId(token)`, `getStoreId(token)`

### JwtAuthenticationFilter
- **역할**: 모든 요청에서 JWT 추출 및 SecurityContext 설정
- **위치**: `security/` 패키지
- **상속**: `OncePerRequestFilter`

### GlobalExceptionHandler
- **역할**: 전역 예외를 표준 에러 응답으로 변환
- **위치**: `exception/` 패키지
- **어노테이션**: `@RestControllerAdvice`

### FileStorageService
- **역할**: 이미지 파일 저장/삭제, UUID 파일명 생성, 확장자 검증
- **위치**: `service/` 패키지
- **주요 메서드**: `store(MultipartFile)` → 저장 경로 반환, `delete(filePath)`

### RequestLoggingFilter
- **역할**: HTTP 요청/응답 로깅 (메서드, URI, 상태 코드, 소요 시간)
- **위치**: `config/` 패키지
- **상속**: `OncePerRequestFilter`

## 패키지 구조

```
backend/src/main/java/com/tableorder/
├── config/
│   ├── SecurityConfig.java
│   ├── WebMvcConfig.java          # static resource 경로 설정
│   └── RequestLoggingFilter.java
├── security/
│   ├── JwtTokenProvider.java
│   └── JwtAuthenticationFilter.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── ErrorResponse.java
├── domain/
│   ├── store/
│   ├── admin/
│   ├── table/
│   ├── menu/
│   └── order/
└── service/
    └── FileStorageService.java
```
