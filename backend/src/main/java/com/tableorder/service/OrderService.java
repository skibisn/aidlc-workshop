package com.tableorder.service;

import com.tableorder.domain.menu.Menu;
import com.tableorder.domain.menu.MenuRepository;
import com.tableorder.domain.order.*;
import com.tableorder.domain.table.TableEntity;
import com.tableorder.domain.table.TableRepository;
import com.tableorder.exception.InvalidSessionException;
import com.tableorder.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;
    private final MenuRepository menuRepository;
    private final SseService sseService;

    @Transactional
    public Order createOrder(Long tableId, String sessionId, Long storeId,
                             List<Map<String, Object>> items) {
        TableEntity table = tableRepository.findById(tableId)
                .filter(t -> t.getStoreId().equals(storeId))
                .orElseThrow(() -> new NotFoundException("Table not found"));

        if (!sessionId.equals(table.getCurrentSessionId())) {
            throw new InvalidSessionException("Session ID does not match");
        }

        Order order = Order.builder().storeId(storeId).tableId(tableId).sessionId(sessionId).build();

        BigDecimal total = BigDecimal.ZERO;
        for (Map<String, Object> item : items) {
            Long menuId = Long.parseLong(item.get("menuId").toString());
            int quantity = Integer.parseInt(item.get("quantity").toString());

            Menu menu = menuRepository.findById(menuId)
                    .filter(m -> m.getStoreId().equals(storeId))
                    .orElseThrow(() -> new NotFoundException("Menu not found: " + menuId));

            OrderItem orderItem = OrderItem.builder()
                    .order(order).menuId(menuId)
                    .menuName(menu.getName()).quantity(quantity)
                    .unitPrice(menu.getPrice()).build();
            order.getItems().add(orderItem);
            total = total.add(menu.getPrice().multiply(BigDecimal.valueOf(quantity)));
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        table.setTotalAmount(table.getTotalAmount().add(total));
        tableRepository.save(table);

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                sseService.publishNewOrder(storeId, saved);
            }
        });

        return saved;
    }

    public List<Order> getOrdersBySession(Long tableId, String sessionId) {
        return orderRepository.findByTableIdAndSessionIdOrderByCreatedAtAsc(tableId, sessionId);
    }

    public List<Order> getOrdersByStore(Long storeId) {
        return orderRepository.findByStoreIdAndStatusNotInOrderByCreatedAtDesc(
            storeId, List.of(OrderStatus.COMPLETED, OrderStatus.CANCELLED));
    }

    @Transactional
    public void updateStatus(Long orderId, Long storeId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .filter(o -> o.getStoreId().equals(storeId))
                .orElseThrow(() -> new NotFoundException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long orderId, Long storeId) {
        Order order = orderRepository.findById(orderId)
                .filter(o -> o.getStoreId().equals(storeId))
                .orElseThrow(() -> new NotFoundException("Order not found"));

        TableEntity table = tableRepository.findById(order.getTableId())
                .orElseThrow(() -> new NotFoundException("Table not found"));
        table.setTotalAmount(table.getTotalAmount().subtract(order.getTotalAmount()));
        tableRepository.save(table);

        orderRepository.delete(order);
    }
}
