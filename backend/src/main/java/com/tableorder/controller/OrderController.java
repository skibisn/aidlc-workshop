package com.tableorder.controller;

import com.tableorder.security.AdminPrincipal;
import com.tableorder.domain.order.Order;
import com.tableorder.domain.order.OrderStatus;
import com.tableorder.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        Long tableId = Long.parseLong(request.get("tableId").toString());
        String sessionId = request.get("sessionId").toString();
        Long storeId = Long.parseLong(request.get("storeId").toString());
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");

        Order order = orderService.createOrder(tableId, sessionId, storeId, items);
        return ResponseEntity.status(201).body(Map.of("orderId", order.getId()));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) Long tableId,
            @RequestParam(required = false) String sessionId) {
        if (storeId != null) {
            return ResponseEntity.ok(orderService.getOrdersByStore(storeId));
        }
        return ResponseEntity.ok(orderService.getOrdersBySession(tableId, sessionId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long orderId,
            @AuthenticationPrincipal AdminPrincipal principal,
            @RequestBody Map<String, String> request) {
        orderService.updateStatus(orderId, principal.getStoreId(), OrderStatus.valueOf(request.get("status")));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal AdminPrincipal principal) {
        orderService.deleteOrder(orderId, principal.getStoreId());
        return ResponseEntity.ok().build();
    }
}
