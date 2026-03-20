package com.tableorder.domain.order;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByTableIdAndSessionIdOrderByCreatedAtAsc(Long tableId, String sessionId);
    List<Order> findByStoreIdOrderByCreatedAtDesc(Long storeId);
    List<Order> findByStoreIdAndStatusNotOrderByCreatedAtDesc(Long storeId, OrderStatus status);
    List<Order> findByStoreIdAndStatusNotInOrderByCreatedAtDesc(Long storeId, List<OrderStatus> statuses);
}
