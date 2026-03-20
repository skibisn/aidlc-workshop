package com.tableorder.domain.order;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_histories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private Long tableId;

    @Column(nullable = false)
    private String sessionId;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    @Column(nullable = false)
    private BigDecimal totalAmount;
}
