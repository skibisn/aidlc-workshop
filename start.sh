#!/bin/bash
# 테이블오더 시스템 시작
set -e

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "🚀 테이블오더 시스템을 시작합니다..."
docker compose up --build -d

echo ""
echo "✅ 시작 완료!"
echo "   고객 화면:   http://localhost:3000"
echo "   관리자 화면: http://localhost:3000/admin/login"
echo "   API 문서:    http://localhost:8080/swagger-ui.html"
echo ""
echo "종료하려면: ./stop.sh"
