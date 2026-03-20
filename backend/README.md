# Backend API - Table Order System

Spring Boot 3.x REST API + SSE 서버

## 실행 방법

### 1. 환경 변수 설정
```bash
export DB_URL=jdbc:mysql://localhost:3306/tableorder?useSSL=false&serverTimezone=Asia/Seoul
export DB_USERNAME=tableorder
export DB_PASSWORD=your_password
export JWT_SECRET=your-256bit-secret-key-here-must-be-long-enough
export UPLOAD_DIR=/uploads/menus
export CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 2. DB 초기화
```sql
CREATE DATABASE tableorder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tableorder'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON tableorder.* TO 'tableorder'@'localhost';
```

### 3. 빌드 및 실행
```bash
cd backend
./gradlew bootRun
```

### 4. API 문서
- Swagger UI: http://localhost:8080/swagger-ui.html

## 테스트 실행
```bash
./gradlew test
```

## 초기 계정 (Seed 데이터)
- 매장 식별자: `store-001`
- 관리자 계정: `admin` / `admin1234`
- 테이블 비밀번호: `admin1234` (테이블 1, 2, 3)
