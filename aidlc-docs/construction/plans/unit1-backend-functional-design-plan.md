# Unit 1 Backend API - Functional Design Plan

## Execution Checklist
- [x] Step 1: Unit 컨텍스트 분석 완료
- [x] Step 2: 질문 생성
- [x] Step 3: 사용자 답변 수집
- [x] Step 4: 답변 분석 완료 (Q1=A UUID세션, Q2=B 양방향상태, Q3=A 5회/30분잠금, Q4=A static서빙, Q5=A 앱레벨격리)
- [x] Step 5: domain-entities.md 생성
- [x] Step 6: business-rules.md 생성
- [x] Step 7: business-logic-model.md 생성
- [ ] Step 8: 완료 및 승인

---

## 질문

### Question 1
테이블 세션(Table Session) 식별 방식을 어떻게 하시겠습니까?

A) UUID 기반 sessionId를 서버에서 생성하여 테이블 설정 시 발급
B) tableId + 타임스탬프 조합으로 sessionId 생성
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2
주문 상태(Order Status) 전이 규칙을 어떻게 하시겠습니까?

A) 단방향 전이만 허용: 대기중 → 준비중 → 완료 (역방향 불가)
B) 양방향 전이 허용: 관리자가 임의로 상태 변경 가능
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 3
관리자 로그인 시도 제한 정책을 어떻게 하시겠습니까?

A) N회 실패 시 M분 잠금 (예: 5회 실패 → 30분 잠금)
B) N회 실패 시 계정 비활성화 (관리자 직접 해제 필요)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4
이미지 파일 저장 경로 및 서빙 방식을 어떻게 하시겠습니까?

A) 서버 로컬 디렉토리 저장 + Spring Boot static resource 서빙
B) 서버 로컬 디렉토리 저장 + 별도 파일 다운로드 API 서빙
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5
다중 매장 데이터 격리 방식을 어떻게 하시겠습니까?

A) 모든 쿼리에 storeId 조건 포함 (애플리케이션 레벨 격리)
B) 매장별 별도 스키마/DB (DB 레벨 격리)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

모든 질문에 답변 후 "완료"라고 알려주세요.
