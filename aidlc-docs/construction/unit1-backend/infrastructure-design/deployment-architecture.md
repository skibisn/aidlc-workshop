# Deployment Architecture - Unit 1: Backend API

## 배포 구성도

```
[Client Browser]
      |
      | HTTP (REST API / SSE)
      v
[Spring Boot API Server :8080]
  ├── JwtAuthenticationFilter
  ├── Controllers (Auth/Table/Menu/Order/Sse)
  ├── Services
  ├── Repositories
  └── FileStorageService
      |              |
      v              v
[MySQL :3306]   [Local Filesystem]
                /uploads/menus/
```

## 실행 순서

1. MySQL 서버 시작
2. 데이터베이스 및 사용자 생성
3. Seed 데이터 실행 (초기 매장/메뉴 데이터)
4. 환경 변수 설정
5. `java -jar backend.jar` 실행
6. `http://localhost:8080/swagger-ui.html` 에서 API 확인

## application.yml 주요 설정

```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate        # 운영: validate, 개발: update
    show-sql: false
  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 10MB
  web:
    resources:
      static-locations: classpath:/static/, file:${UPLOAD_DIR}/

server:
  port: 8080

jwt:
  secret: ${JWT_SECRET}
  expiration: 57600000          # 16시간 (ms)

upload:
  dir: ${UPLOAD_DIR}
```

## DB 초기화

```sql
CREATE DATABASE tableorder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tableorder'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON tableorder.* TO 'tableorder'@'localhost';
```

- DDL: Spring Boot JPA `ddl-auto: create` (최초 실행) → 이후 `validate`
- Seed 데이터: `data.sql` 또는 별도 스크립트
