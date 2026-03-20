package com.tableorder.domain.table;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tables", uniqueConstraints = @UniqueConstraint(columnNames = {"store_id", "table_number"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TableEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private String tableNumber;

    @Column(nullable = false)
    private String passwordHash;

    private String currentSessionId;
    private LocalDateTime sessionCreatedAt;

    @Builder.Default
    @Column(nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;
}
