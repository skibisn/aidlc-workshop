package com.tableorder.controller;

import com.tableorder.domain.order.OrderHistory;
import com.tableorder.security.AdminPrincipal;
import com.tableorder.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getTables(
            @AuthenticationPrincipal AdminPrincipal principal) {
        List<Map<String, Object>> result = tableService.getTablesByStore(principal.getStoreId())
                .stream()
                .map(t -> Map.<String, Object>of(
                        "id", t.getId(),
                        "tableNumber", t.getTableNumber()
                ))
                .toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/auto-login")
    public ResponseEntity<Map<String, Object>> autoLogin(@RequestBody Map<String, String> request) {
        String storeIdentifier = request.get("storeIdentifier");
        String tableNumber = request.get("tableNumber");
        String password = request.get("password");

        TableService.AutoLoginResult result = tableService.autoLogin(storeIdentifier, tableNumber, password);
        return ResponseEntity.ok(Map.of(
                "sessionId", result.sessionId(),
                "storeId", result.storeId(),
                "tableId", result.tableId()
        ));
    }

    @PostMapping("/setup")
    public ResponseEntity<Map<String, String>> setup(
            @AuthenticationPrincipal AdminPrincipal principal,
            @RequestBody Map<String, String> request) {
        String sessionId = tableService.setupTable(
                principal.getStoreId(),
                request.get("tableNumber"),
                request.get("password")
        );
        return ResponseEntity.ok(Map.of("sessionId", sessionId));
    }

    @PostMapping("/{tableId}/complete")
    public ResponseEntity<Void> complete(
            @PathVariable Long tableId,
            @AuthenticationPrincipal AdminPrincipal principal) {
        tableService.completeSession(tableId, principal.getStoreId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{tableId}/history")
    public ResponseEntity<List<OrderHistory>> getHistory(
            @PathVariable Long tableId,
            @AuthenticationPrincipal AdminPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(tableService.getHistory(tableId, principal.getStoreId(), date));
    }
}
