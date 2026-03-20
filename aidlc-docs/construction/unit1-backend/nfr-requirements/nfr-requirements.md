# NFR Requirements - Unit 1: Backend API

## 규모 기준
- **대상**: 중규모 (테이블 50개 이하, 동시 접속 100명 이하)

---

## 성능 (Performance)
- **API 응답 시간**: 일반 REST API 1초 이내
- **SSE 주문 반영**: 신규 주문 발생 후 2초 이내 관리자 화면 반영
- **DB 쿼리**: 모든 쿼리에 storeId 인덱스 활용

## 보안 (Security)
- **인증**: JWT Bearer 토큰 (16시간 만료), 관리자 API 전체 적용
- **비밀번호**: bcrypt 해싱 (strength 10 이상)
- **로그인 제한**: 5회 실패 시 30분 잠금
- **데이터 격리**: 모든 쿼리에 storeId 조건 강제 (다른 매장 데이터 접근 차단)
- **파일 업로드**: 허용 확장자 검증 (jpg/jpeg/png/webp), 파일 크기 제한 (5MB)
- **CORS**: 프론트엔드 origin만 허용

## 가용성 (Availability)
- **배포 환경**: 로컬 서버 단일 인스턴스
- **SSE 연결 유지**: emitter timeout 30분, 연결 끊김 시 클라이언트 재연결

## 신뢰성 (Reliability)
- **트랜잭션**: 이용 완료 처리, 주문 생성 등 복합 연산은 DB 트랜잭션 보장
- **SSE 장애 격리**: emitter 전송 실패 시 해당 emitter만 제거, 다른 구독자 영향 없음
- **에러 응답**: 표준 HTTP 상태 코드 + 에러 메시지 JSON 반환

## 유지보수성 (Maintainability)
- **API 문서**: Springdoc OpenAPI (Swagger UI) 제공
- **로깅**: SLF4J + Logback, 요청/응답 로깅
