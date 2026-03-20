package com.tableorder.service;

import com.tableorder.domain.menu.Menu;
import com.tableorder.domain.menu.MenuRepository;
import com.tableorder.exception.InvalidFileException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock MenuRepository menuRepository;
    @Mock FileStorageService fileStorageService;
    @InjectMocks MenuService menuService;

    // TC-B-013: 메뉴 등록 성공
    @Test
    void createMenu_success_savesMenu() {
        MockMultipartFile imageFile = new MockMultipartFile(
                "image", "menu.jpg", "image/jpeg", "image-data".getBytes());
        when(fileStorageService.store(imageFile)).thenReturn("/uploads/menus/uuid.jpg");
        Menu saved = Menu.builder().id(1L).storeId(1L).name("아메리카노")
                .price(new BigDecimal("4500")).imagePath("/uploads/menus/uuid.jpg").build();
        when(menuRepository.save(any())).thenReturn(saved);

        Menu result = menuService.createMenu(1L, "아메리카노", new BigDecimal("4500"),
                "에스프레소", 1L, imageFile);

        assertThat(result.getName()).isEqualTo("아메리카노");
        assertThat(result.getImagePath()).isEqualTo("/uploads/menus/uuid.jpg");
    }

    // TC-B-014: 허용되지 않는 파일 확장자
    @Test
    void createMenu_invalidFileExtension_throwsInvalidFileException() {
        MockMultipartFile imageFile = new MockMultipartFile(
                "image", "menu.exe", "application/octet-stream", "data".getBytes());
        when(fileStorageService.store(imageFile)).thenThrow(new InvalidFileException("File type not allowed"));

        assertThatThrownBy(() -> menuService.createMenu(1L, "메뉴", new BigDecimal("1000"),
                null, 1L, imageFile))
                .isInstanceOf(InvalidFileException.class);
    }
}
