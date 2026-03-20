# Build Instructions

## 사전 요구사항
- Docker Desktop (권장) 또는 Java 17 + Node.js 20 + MySQL 8.x

---

## Docker 빌드 (권장)

```bash
# 전체 빌드 및 실행
./start.sh

# 종료
./stop.sh
```

---

## 로컬 빌드

### Backend
```bash
cd backend
./gradlew clean bootJar
# 결과물: backend/build/libs/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm install
npm run build
# 결과물: frontend/dist/
```

---

## 환경 변수 (로컬 실행 시)
```bash
export DB_URL="jdbc:mysql://localhost:3306/tableorder?useSSL=false&serverTimezone=Asia/Seoul"
export DB_USERNAME=tableorder
export DB_PASSWORD=password
export JWT_SECRET=change-this-to-a-very-long-secret-key-256bit-minimum
export UPLOAD_DIR=/tmp/tableorder/uploads
export CORS_ALLOWED_ORIGINS=http://localhost:3000
```
