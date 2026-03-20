package com.tableorder.service;

import com.tableorder.domain.order.Order;
import com.tableorder.domain.order.OrderHistory;
import com.tableorder.domain.order.OrderHistoryRepository;
import com.tableorder.domain.order.OrderRepository;
import com.tableorder.domain.store.Store;
import com.tableorder.domain.store.StoreRepository;
import com.tableorder.domain.table.TableEntity;
import com.tableorder.domain.table.TableRepository;
import com.tableorder.exception.NoActiveSessionException;
import com.tableorder.exception.NotFoundException;
import com.tableorder.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TableService {

    public record AutoLoginResult(String sessionId, Long storeId, Long tableId) {}

    private final StoreRepository storeRepository;
    private final TableRepository tableRepository;
    private final OrderRepository orderRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AutoLoginResult autoLogin(String storeIdentifier, String tableNumber, String password) {
        Store store = storeRepository.findByIdentifier(storeIdentifier)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        TableEntity table = tableRepository.findByStoreIdAndTableNumber(store.getId(), tableNumber)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(password, table.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (table.getCurrentSessionId() == null) {
            table.setCurrentSessionId(UUID.randomUUID().toString());
            table.setSessionCreatedAt(LocalDateTime.now());
            tableRepository.save(table);
        }

        return new AutoLoginResult(table.getCurrentSessionId(), store.getId(), table.getId());
    }

    @Transactional
    public String setupTable(Long storeId, String tableNumber, String password) {
        TableEntity table = tableRepository.findByStoreIdAndTableNumber(storeId, tableNumber)
                .orElseGet(() -> TableEntity.builder().storeId(storeId).tableNumber(tableNumber).build());

        table.setPasswordHash(passwordEncoder.encode(password));
        table.setCurrentSessionId(UUID.randomUUID().toString());
        table.setSessionCreatedAt(LocalDateTime.now());
        table.setTotalAmount(BigDecimal.ZERO);
        tableRepository.save(table);

        return table.getCurrentSessionId();
    }

    @Transactional
    public void completeSession(Long tableId, Long storeId) {
        TableEntity table = tableRepository.findById(tableId)
                .filter(t -> t.getStoreId().equals(storeId))
                .orElseThrow(() -> new NotFoundException("Table not found"));

        if (table.getCurrentSessionId() == null) {
            throw new NoActiveSessionException("No active session for this table");
        }

        OrderHistory history = OrderHistory.builder()
                .storeId(storeId)
                .tableId(tableId)
                .sessionId(table.getCurrentSessionId())
                .completedAt(LocalDateTime.now())
                .totalAmount(table.getTotalAmount())
                .build();
        orderHistoryRepository.save(history);

        table.setCurrentSessionId(null);
        table.setSessionCreatedAt(null);
        table.setTotalAmount(BigDecimal.ZERO);
        tableRepository.save(table);
    }

    public List<TableEntity> getTablesByStore(Long storeId) {
        return tableRepository.findByStoreIdOrderByTableNumber(storeId);
    }

    public List<OrderHistory> getHistory(Long tableId, Long storeId, LocalDate date) {
        tableRepository.findById(tableId)
                .filter(t -> t.getStoreId().equals(storeId))
                .orElseThrow(() -> new NotFoundException("Table not found"));

        if (date != null) {
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.plusDays(1).atStartOfDay();
            return orderHistoryRepository
                    .findByTableIdAndCompletedAtBetweenOrderByCompletedAtDesc(tableId, start, end);
        }
        return orderHistoryRepository.findByTableIdOrderByCompletedAtDesc(tableId);
    }
}
