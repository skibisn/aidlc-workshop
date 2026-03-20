# Tech Stack Decisions - Unit 1: Backend API

| 항목 | 선택 | 근거 |
|------|------|------|
| Language | Java 17 | Spring Boot 3.x 최소 요구사항, LTS |
| Framework | Spring Boot 3.x | 요구사항 정의, 생태계 풍부 |
| Build Tool | Gradle | 요청사항 |
| ORM | Spring Data JPA + Hibernate | 관계형 DB 매핑, 트랜잭션 관리 |
| Database | MySQL 8.x | 요구사항 정의 |
| Security | Spring Security + JWT (jjwt) | JWT 인증, bcrypt 지원 |
| SSE | Spring SseEmitter | Spring 내장, 별도 라이브러리 불필요 |
| API 문서 | Springdoc OpenAPI 2.x (Swagger UI) | 요청사항 |
| 파일 업로드 | Spring MultipartFile | Spring 내장 |
| 로깅 | SLF4J + Logback | Spring Boot 기본 포함 |
| 테스트 | JUnit 5 + Mockito | Spring Boot Test 기본 포함 |

## 주요 의존성 (build.gradle)

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'io.jsonwebtoken:jjwt-api:0.12.x'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.x'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.x'
    runtimeOnly 'com.mysql:mysql-connector-j'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.x'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}
```
