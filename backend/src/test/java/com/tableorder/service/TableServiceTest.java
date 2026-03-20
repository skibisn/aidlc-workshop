package com.tableorder.service;

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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TableServiceTest {

    @Mock StoreRepository storeRepository;
    @Mock TableRepository tableRepository;
    @Mock OrderRepository orderRepository;
    @Mock OrderHistoryRepository orderHistoryRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks TableService tableService;

    Store store;
    TableEntity table;

    @BeforeEach
    void setUp() {
        store = Store.builder().id(1L).identifier("store-001").name("테스트 매장").build();
        table = TableEntity.builder()
                .id(1L).storeId(1L).tableNumber("1")
                .passwordHash("$2a$10$hashed")
                .currentSessionId(UUID.randomUUID().toString())
                .totalAmount(BigDecimal.ZERO).build();
    }

    // TC-B-005: 기존 세션 반환
    @Test
    void autoLogin_existingSession_returnsExistingSessionId() {
        String existingSession = table.getCurrentSessionId();
        when(storeRepository.findByIdentifier("store-001")).thenReturn(Optional.of(store));
        when(tableRepository.findByStoreIdAndTableNumber(1L, "1")).thenReturn(Optional.of(table));
        when(passwordEncoder.matches("password", "$2a$10$hashed")).thenReturn(true);

        TableService.AutoLoginResult result = tableService.autoLogin("store-001", "1", "password");

        assertThat(result.sessionId()).isEqualTo(existingSession);
        assertThat(result.storeId()).isEqualTo(1L);
        assertThat(result.tableId()).isEqualTo(1L);
    }

    // TC-B-006: 새 세션 생성
    @Test
    void autoLogin_noSession_createsNewSession() {
        table.setCurrentSessionId(null);
        when(storeRepository.findByIdentifier("store-001")).thenReturn(Optional.of(store));
        when(tableRepository.findByStoreIdAndTableNumber(1L, "1")).thenReturn(Optional.of(table));
        when(passwordEncoder.matches("password", "$2a$10$hashed")).thenReturn(true);

        TableService.AutoLoginResult result = tableService.autoLogin("store-001", "1", "password");

        assertThat(result.sessionId()).isNotNull();
        verify(tableRepository).save(table);
    }

    // TC-B-007: 잘못된 비밀번호
    @Test
    void autoLogin_wrongPassword_throwsUnauthorizedException() {
        when(storeRepository.findByIdentifier("store-001")).thenReturn(Optional.of(store));
        when(tableRepository.findByStoreIdAndTableNumber(1L, "1")).thenReturn(Optional.of(table));
        when(passwordEncoder.matches("wrong", "$2a$10$hashed")).thenReturn(false);

        assertThatThrownBy(() -> tableService.autoLogin("store-001", "1", "wrong"))
                .isInstanceOf(UnauthorizedException.class);
    }

    // TC-B-008: 이용 완료 처리
    @Test
    void completeSession_success_createsHistoryAndResetsTable() {
        when(tableRepository.findById(1L)).thenReturn(Optional.of(table));

        tableService.completeSession(1L, 1L);

        verify(orderHistoryRepository).save(any(OrderHistory.class));
        assertThat(table.getCurrentSessionId()).isNull();
        assertThat(table.getTotalAmount()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    // TC-B-009: 활성 세션 없음
    @Test
    void completeSession_noActiveSession_throwsNoActiveSessionException() {
        table.setCurrentSessionId(null);
        when(tableRepository.findById(1L)).thenReturn(Optional.of(table));

        assertThatThrownBy(() -> tableService.completeSession(1L, 1L))
                .isInstanceOf(NoActiveSessionException.class);
    }
}
