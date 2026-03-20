# Build and Test Summary

## 빌드 상태
- **빌드 도구**: Gradle (Backend) + Vite (Frontend) + Docker Compose
- **빌드 방법**: `./start.sh` (Docker) 또는 각 디렉토리에서 개별 빌드
- **빌드 산출물**: `backend/build/libs/*.jar`, `frontend/dist/`

---

## 테스트 실행 요약

### Unit Tests (TDD — 코드 생성 시 실행 완료)

| Unit | 테스트 수 | 상태 |
|------|-----------|------|
| Unit 1: Backend API | 16개 (TC-B-001~016) | 🟢 통과 |
| Unit 2: Customer Frontend | 8개 (useCart, useSession, TableSetupPage, CartPage) | 🟢 통과 |
| Unit 3: Admin Frontend | 3개 (useAdminAuth, LoginPage) | 🟢 통과 |
| **합계** | **27개** | **🟢 전체 통과** |

### Integration Tests
- 시나리오 3개 정의 (고객 주문 플로우, 관리자 플로우, SSE 실시간)
- 실행 방법: `aidlc-docs/construction/build-and-test/integration-test-instructions.md`

### Performance Tests
- 목표: REST API 1초 이내, SSE 2초 이내
- 실행 방법: `aidlc-docs/construction/build-and-test/performance-test-instructions.md`

---

## 전체 상태
- **빌드**: ✅ 준비 완료
- **Unit Tests**: ✅ 27개 통과
- **Integration Tests**: 📋 수동 실행 필요
- **운영 준비**: ✅ Docker Compose로 즉시 실행 가능

---

## 실행 방법 요약
```bash
./start.sh   # 전체 시스템 시작 (MySQL + Backend + Frontend)
./stop.sh    # 전체 시스템 종료
```

접속 URL:
- 고객 화면: http://localhost:3000
- 관리자 화면: http://localhost:3000/admin/login
- API 문서: http://localhost:8080/swagger-ui.html
