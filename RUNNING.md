# 실행 가이드

## 1. Docker로 실행 (권장)

### 사전 요구사항
- Docker Desktop 설치 (https://www.docker.com/products/docker-desktop)

### 실행
```bash
# 프로젝트 루트에서
docker compose up --build
```

### 확인
- API 서버: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### 중지
```bash
docker compose down
```

### 데이터 포함 완전 초기화
```bash
docker compose down -v
docker compose up --build
```

---

## 2. 로컬에서 직접 실행

### 사전 요구사항
- Java 17 이상
- MySQL 8.x 설치 및 실행

### DB 초기화
```sql
CREATE DATABASE tableorder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tableorder'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON tableorder.* TO 'tableorder'@'localhost';
FLUSH PRIVILEGES;
```

### 환경 변수 설정 (터미널)
```bash
export DB_URL="jdbc:mysql://localhost:3306/tableorder?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8"
export DB_USERNAME=tableorder
export DB_PASSWORD=password
export JWT_SECRET=change-this-to-a-very-long-secret-key-256bit-minimum
export UPLOAD_DIR=/tmp/tableorder/uploads
export CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 빌드 및 실행
```bash
# Gradle 설치 필요: brew install gradle
cd backend
gradle bootRun
```

### 테스트 실행
```bash
cd backend
gradle test
```

---

## 초기 계정 (Seed 데이터)

| 항목 | 값 |
|------|-----|
| 매장 식별자 | `store-001` |
| 관리자 아이디 | `admin` |
| 관리자 비밀번호 | `admin1234` |
| 테이블 비밀번호 | `admin1234` |
| 테이블 번호 | `1`, `2`, `3` |
