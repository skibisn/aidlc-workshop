# Performance Test Instructions

## 요구사항
- SSE 주문 반영: 2초 이내
- REST API 응답: 1초 이내
- 대상 규모: 동시 접속 100명 이하

## 간단한 부하 테스트 (curl 기반)

```bash
# 메뉴 조회 응답 시간 측정
time curl -s "http://localhost:8080/api/menus?storeId=1" > /dev/null

# 10회 반복 평균
for i in {1..10}; do
  time curl -s "http://localhost:8080/api/menus?storeId=1" > /dev/null
done
```

## Apache Bench (ab) 사용 시

```bash
# 설치: brew install httpd
ab -n 100 -c 10 "http://localhost:8080/api/menus?storeId=1"
# 기대: 평균 응답 1000ms 이하, 에러율 0%
```

## 합격 기준
- 메뉴 조회 평균 응답: < 1000ms
- 주문 생성 평균 응답: < 1000ms
- 에러율: 0%
