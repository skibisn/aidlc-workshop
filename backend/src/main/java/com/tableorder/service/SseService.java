package com.tableorder.service;

import com.tableorder.domain.order.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
public class SseService {

    private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long storeId) {
        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L); // 30분
        emitters.computeIfAbsent(storeId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(storeId, emitter));
        emitter.onTimeout(() -> removeEmitter(storeId, emitter));
        emitter.onError(e -> removeEmitter(storeId, emitter));

        try {
            emitter.send(SseEmitter.event().name("connected").data("SSE connected"));
        } catch (IOException e) {
            removeEmitter(storeId, emitter);
        }
        return emitter;
    }

    public void publishNewOrder(Long storeId, Order order) {
        List<SseEmitter> storeEmitters = emitters.getOrDefault(storeId, List.of());
        for (SseEmitter emitter : storeEmitters) {
            try {
                emitter.send(SseEmitter.event().name("new-order").data(Map.of(
                        "orderId", order.getId(),
                        "tableId", order.getTableId(),
                        "totalAmount", order.getTotalAmount(),
                        "status", order.getStatus()
                )));
            } catch (IOException e) {
                removeEmitter(storeId, emitter);
            }
        }
    }

    private void removeEmitter(Long storeId, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(storeId);
        if (list != null) list.remove(emitter);
    }
}
