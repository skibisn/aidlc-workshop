package com.tableorder.controller;

import com.tableorder.domain.menu.Menu;
import com.tableorder.security.AdminPrincipal;
import com.tableorder.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<Menu>> getMenus(
            @RequestParam Long storeId,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(menuService.getMenus(storeId, categoryId));
    }

    @PostMapping
    public ResponseEntity<Menu> createMenu(
            @AuthenticationPrincipal AdminPrincipal principal,
            @RequestParam String name,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String description,
            @RequestParam Long categoryId,
            @RequestParam(required = false) MultipartFile image) {
        return ResponseEntity.status(201).body(
                menuService.createMenu(principal.getStoreId(), name, price, description, categoryId, image));
    }

    @PutMapping("/{menuId}")
    public ResponseEntity<Menu> updateMenu(
            @PathVariable Long menuId,
            @AuthenticationPrincipal AdminPrincipal principal,
            @RequestParam String name,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String description,
            @RequestParam Long categoryId,
            @RequestParam(required = false) MultipartFile image) {
        return ResponseEntity.ok(
                menuService.updateMenu(menuId, principal.getStoreId(), name, price, description, categoryId, image));
    }

    @DeleteMapping("/{menuId}")
    public ResponseEntity<Void> deleteMenu(
            @PathVariable Long menuId,
            @AuthenticationPrincipal AdminPrincipal principal) {
        menuService.deleteMenu(menuId, principal.getStoreId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/order")
    public ResponseEntity<Void> updateOrder(
            @AuthenticationPrincipal AdminPrincipal principal,
            @RequestBody List<Map<String, Object>> orderList) {
        menuService.updateOrder(principal.getStoreId(), orderList);
        return ResponseEntity.ok().build();
    }
}
