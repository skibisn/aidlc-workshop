# Unit of Work

## 프로젝트 구조
- **배포 모델**: Monorepo (단일 저장소)
- **개발 순서**: Unit 1 → Unit 2 → Unit 3 (순차)

```
aidlc-workshop/          # Workspace root (Monorepo)
├── backend/             # Unit 1: Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/            # Unit 2 & 3: React SPA
│   ├── src/
│   │   ├── customer/    # Unit 2: 고객용 UI
│   │   └── admin/       # Unit 3: 관리자용 UI
│   ├── package.json
│   └── ...
└── aidlc-docs/
```

---

## Unit 1: Backend API

- **기술 스택**: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, MySQL, SSE
- **책임**:
  - REST API 제공 (인증, 테이블, 메뉴, 주문)
  - SSE 실시간 주문 알림
  - JWT 기반 관리자 인증
  - 이미지 파일 업로드/서빙
  - MySQL 데이터 관리
- **포함 컴포넌트**: AuthController, TableController, MenuController, OrderController, SseController, 모든 Service, 모든 Repository
- **산출물**: `backend/` 디렉토리

---

## Unit 2: Customer Frontend

- **기술 스택**: React 18, TypeScript, React Router
- **책임**:
  - 테이블 자동 로그인 (로컬 스토리지)
  - 메뉴 탐색 및 카테고리 필터
  - 장바구니 관리 (로컬 스토리지)
  - 주문 생성 및 주문 내역 조회
- **포함 컴포넌트**: CustomerApp, MenuPage, CartPage, OrderHistoryPage, TableSetupPage
- **산출물**: `frontend/src/customer/` 디렉토리

---

## Unit 3: Admin Frontend

- **기술 스택**: React 18, TypeScript, React Router
- **책임**:
  - 관리자 로그인 (JWT)
  - 실시간 주문 모니터링 대시보드 (SSE)
  - 테이블 관리 (초기 설정, 이용 완료, 과거 내역)
  - 메뉴 CRUD 및 이미지 업로드
- **포함 컴포넌트**: AdminApp, LoginPage, DashboardPage, TableManagePage, MenuManagePage
- **산출물**: `frontend/src/admin/` 디렉토리
