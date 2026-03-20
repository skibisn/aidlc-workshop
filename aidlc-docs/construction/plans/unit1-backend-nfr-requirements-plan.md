# Unit 1 Backend API - NFR Requirements Plan

## Execution Checklist
- [x] Step 1: Functional Design 분석 완료
- [x] Step 2: 질문 생성
- [x] Step 3: 사용자 답변 수집
- [x] Step 4: 답변 분석 완료 (Q1=B 중규모, Q2=B Gradle, Q3=A Swagger)
- [x] Step 5: nfr-requirements.md 생성
- [x] Step 6: tech-stack-decisions.md 생성
- [ ] Step 7: 완료 및 승인

---

## 질문

### Question 1
예상 동시 접속자 규모는 어느 정도입니까?

A) 소규모 (테이블 10개 이하, 동시 접속 20명 이하)
B) 중규모 (테이블 50개 이하, 동시 접속 100명 이하)
C) 대규모 (테이블 100개 이상, 동시 접속 500명 이상)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 2
Spring Boot 버전 및 빌드 도구를 어떻게 하시겠습니까?

A) Spring Boot 3.x + Maven
B) Spring Boot 3.x + Gradle
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 3
API 문서화 도구를 포함하시겠습니까?

A) Springdoc OpenAPI (Swagger UI) 포함
B) 문서화 도구 없이 진행
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

모든 질문에 답변 후 "완료"라고 알려주세요.
