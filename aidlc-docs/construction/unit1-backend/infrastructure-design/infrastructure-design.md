# Infrastructure Design - Unit 1: Backend API

## 배포 환경
- **환경**: 로컬 서버 / On-premises
- **배포 모델**: 단일 인스턴스 (JAR 실행)

## 컴포넌트 → 인프라 매핑

| 논리 컴포넌트 | 인프라 | 설정 |
|--------------|--------|------|
| Spring Boot 애플리케이션 | JVM 프로세스 (JAR) | `java -jar backend.jar` |
| MySQL DB | MySQL 8.x 로컬 설치 | 포트 3306 |
| 이미지 파일 저장소 | 로컬 파일 시스템 | `/uploads/menus/` |
| SSE emitter 관리 | JVM 메모리 (in-process) | 별도 인프라 불필요 |
| JWT 서명 키 | 환경 변수 | `JWT_SECRET` |

## 포트 및 네트워크

| 서비스 | 포트 | 비고 |
|--------|------|------|
| Spring Boot API | 8080 | HTTP |
| MySQL | 3306 | 로컬 접속만 허용 |

## 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DB_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/tableorder` |
| `DB_USERNAME` | DB 사용자명 | `tableorder` |
| `DB_PASSWORD` | DB 비밀번호 | (비밀번호) |
| `JWT_SECRET` | JWT 서명 키 (256bit 이상) | (랜덤 문자열) |
| `UPLOAD_DIR` | 이미지 업로드 경로 | `/uploads/menus` |
| `CORS_ALLOWED_ORIGINS` | 허용 CORS origin | `http://localhost:3000` |

## 정적 리소스 서빙

- `spring.web.resources.static-locations` 에 `file:${UPLOAD_DIR}/` 추가
- 이미지 접근 URL: `http://localhost:8080/uploads/menus/{filename}`
