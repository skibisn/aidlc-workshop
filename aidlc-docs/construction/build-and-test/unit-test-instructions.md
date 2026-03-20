# Unit Test Execution

## TDD 결과 (이미 실행 완료)

Unit 1 Backend API — TDD로 생성, 모든 테스트 🟢 통과
- TC-B-001~016: 16개 테스트 (AuthService, TableService, OrderService, MenuService, AuthController)
- 상세: `aidlc-docs/construction/plans/unit1-backend-test-plan.md`

Unit 2 Customer Frontend — TDD로 생성
- useCart, useSession, TableSetupPage, CartPage 테스트

Unit 3 Admin Frontend — TDD로 생성
- useAdminAuth, LoginPage 테스트

---

## 테스트 재실행

### Backend
```bash
cd backend
./gradlew test
# 리포트: backend/build/reports/tests/test/index.html
```

### Frontend
```bash
cd frontend
npm test
# 또는 watch 모드: npm run test:watch
```
