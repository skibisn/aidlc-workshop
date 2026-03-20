package com.tableorder.service;

import com.tableorder.domain.menu.Menu;
import com.tableorder.domain.menu.MenuRepository;
import com.tableorder.exception.InvalidFileException;
import com.tableorder.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final FileStorageService fileStorageService;

    public List<Menu> getMenus(Long storeId, Long categoryId) {
        if (categoryId != null) {
            return menuRepository.findByStoreIdAndCategoryIdOrderBySortOrder(storeId, categoryId);
        }
        return menuRepository.findByStoreIdOrderBySortOrder(storeId);
    }

    @Transactional
    public Menu createMenu(Long storeId, String name, java.math.BigDecimal price,
                           String description, Long categoryId, MultipartFile imageFile) {
        String imagePath = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imagePath = fileStorageService.store(imageFile);
        }
        Menu menu = Menu.builder()
                .storeId(storeId).categoryId(categoryId)
                .name(name).price(price).description(description)
                .imagePath(imagePath).build();
        return menuRepository.save(menu);
    }

    @Transactional
    public Menu updateMenu(Long menuId, Long storeId, String name, java.math.BigDecimal price,
                           String description, Long categoryId, MultipartFile imageFile) {
        Menu menu = menuRepository.findById(menuId)
                .filter(m -> m.getStoreId().equals(storeId))
                .orElseThrow(() -> new NotFoundException("Menu not found"));

        menu.setName(name);
        menu.setPrice(price);
        menu.setDescription(description);
        menu.setCategoryId(categoryId);

        if (imageFile != null && !imageFile.isEmpty()) {
            if (menu.getImagePath() != null) fileStorageService.delete(menu.getImagePath());
            menu.setImagePath(fileStorageService.store(imageFile));
        }
        return menuRepository.save(menu);
    }

    @Transactional
    public void deleteMenu(Long menuId, Long storeId) {
        Menu menu = menuRepository.findById(menuId)
                .filter(m -> m.getStoreId().equals(storeId))
                .orElseThrow(() -> new NotFoundException("Menu not found"));
        if (menu.getImagePath() != null) fileStorageService.delete(menu.getImagePath());
        menuRepository.delete(menu);
    }

    @Transactional
    public void updateOrder(Long storeId, List<Map<String, Object>> orderList) {
        for (Map<String, Object> item : orderList) {
            Long menuId = Long.parseLong(item.get("menuId").toString());
            int sortOrder = Integer.parseInt(item.get("sortOrder").toString());
            menuRepository.findById(menuId)
                    .filter(m -> m.getStoreId().equals(storeId))
                    .ifPresent(m -> { m.setSortOrder(sortOrder); menuRepository.save(m); });
        }
    }
}
