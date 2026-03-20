package com.tableorder.service;

import com.tableorder.domain.menu.Menu;
import com.tableorder.domain.menu.MenuRepository;
import com.tableorder.domain.order.*;
import com.tableorder.domain.table.TableEntity;
import com.tableorder.domain.table.TableRepository;
import com.tableorder.exception.InvalidSessionException;
import com.tableorder.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository orderRepository;
    @Mock TableRepository tableRepository;
    @Mock MenuRepository menuRepository;
    @Mock SseService sseService;
    @InjectMocks OrderService orderService;

    TableEntity table;
    Menu menu;

    @BeforeEach
    void setUp() {
        table = TableEntity.builder()
                .id(1L).storeId(1L).tableNumber("1")
                .currentSessionId("session-uuid")
                .totalAmount(BigDecimal.ZERO).build();
        menu = Menu.builder()
                .id(1L).storeId(1L).name("아메리카노")
                .price(new BigDecimal("4500")).build();
    }

    // TC-B-010: 주문 생성 성공
    @Test
    void createOrder_success_savesOrderAndUpdatesTotalAmount() {
        when(tableRepository.findById(1L)).thenReturn(Optional.of(table));
        when(menuRepository.findById(1L)).thenReturn(Optional.of(menu));
        Order savedOrder = Order.builder().id(1L).storeId(1L).tableId(1L)
                .sessionId("session-uuid").totalAmount(new BigDecimal("9000")).build();
        when(orderRepository.save(any())).thenReturn(savedOrder);

        Order result = orderService.createOrder(1L, "session-uuid", 1L,
                List.of(Map.of("menuId", "1", "quantity", "2")));

        assertThat(result.getTotalAmount()).isEqualByComparingTo("9000");
        assertThat(table.getTotalAmount()).isEqualByComparingTo("9000");
    }

    // TC-B-011: 잘못된 sessionId
    @Test
    void createOrder_invalidSession_throwsInvalidSessionException() {
        when(tableRepository.findById(1L)).thenReturn(Optional.of(table));

        assertThatThrownBy(() -> orderService.createOrder(1L, "wrong-session", 1L,
                List.of(Map.of("menuId", "1", "quantity", "1"))))
                .isInstanceOf(InvalidSessionException.class);
    }

    // TC-B-012: 주문 삭제 및 총액 재계산
    @Test
    void deleteOrder_success_recalculatesTotalAmount() {
        Order order = Order.builder().id(1L).storeId(1L).tableId(1L)
                .sessionId("session-uuid").totalAmount(new BigDecimal("4500")).build();
        table.setTotalAmount(new BigDecimal("4500"));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(tableRepository.findById(1L)).thenReturn(Optional.of(table));

        orderService.deleteOrder(1L, 1L);

        assertThat(table.getTotalAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        verify(orderRepository).delete(order);
    }
}
