-- 초기 매장
INSERT IGNORE INTO stores (identifier, name, created_at) VALUES
('store-001', '테스트 매장', NOW());

-- 초기 관리자 (비밀번호: password)
INSERT IGNORE INTO admins (store_id, username, password_hash, failed_login_count, created_at) VALUES
(1, 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, NOW());

-- 초기 카테고리
INSERT IGNORE INTO categories (id, store_id, name, sort_order) VALUES
(1, 1, '커피', 1),
(2, 1, '음료', 2),
(3, 1, '디저트', 3);

-- 초기 메뉴
INSERT IGNORE INTO menus (store_id, category_id, name, price, description, sort_order) VALUES
(1, 1, '아메리카노', 4500, '진한 에스프레소와 물의 조화', 1),
(1, 1, '카페라떼', 5000, '에스프레소와 스팀 밀크', 2),
(1, 1, '카푸치노', 5000, '에스프레소와 우유 거품', 3),
(1, 2, '녹차라떼', 5500, '말차 파우더와 스팀 밀크', 1),
(1, 2, '자몽에이드', 5500, '상큼한 자몽 에이드', 2),
(1, 3, '치즈케이크', 6500, '부드러운 뉴욕 치즈케이크', 1),
(1, 3, '티라미수', 6500, '이탈리안 정통 티라미수', 2);

-- 초기 테이블 (비밀번호: password)
INSERT IGNORE INTO tables (store_id, table_number, password_hash, total_amount) VALUES
(1, '1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0),
(1, '2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0),
(1, '3', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0),
(1, '4', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0),
(1, '5', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0);
