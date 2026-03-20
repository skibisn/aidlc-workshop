package com.tableorder.domain.menu;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByStoreIdOrderBySortOrder(Long storeId);
    List<Menu> findByStoreIdAndCategoryIdOrderBySortOrder(Long storeId, Long categoryId);
}
