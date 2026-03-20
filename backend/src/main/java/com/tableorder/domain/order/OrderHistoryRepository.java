package com.tableorder.domain.order;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {
    List<OrderHistory> findByTableIdOrderByCompletedAtDesc(Long tableId);
    List<OrderHistory> findByTableIdAndCompletedAtBetweenOrderByCompletedAtDesc(
        Long tableId, LocalDateTime start, LocalDateTime end);
}
