package com.tableorder.service;

import com.tableorder.domain.admin.Admin;
import com.tableorder.domain.admin.AdminRepository;
import com.tableorder.domain.store.Store;
import com.tableorder.domain.store.StoreRepository;
import com.tableorder.exception.AccountLockedException;
import com.tableorder.exception.UnauthorizedException;
import com.tableorder.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock StoreRepository storeRepository;
    @Mock AdminRepository adminRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtTokenProvider jwtTokenProvider;
    @InjectMocks AuthService authService;

    Store store;
    Admin admin;

    @BeforeEach
    void setUp() {
        store = Store.builder().id(1L).identifier("store-001").name("테스트 매장").build();
        admin = Admin.builder()
                .id(1L).storeId(1L).username("admin")
                .passwordHash("$2a$10$hashed").failedLoginCount(0).build();
    }

    // TC-B-001: 로그인 성공
    @Test
    void authenticate_success_returnsJwt() {
        when(storeRepository.findByIdentifier("store-001")).thenReturn(Optional.of(store));
        when(adminRepository.findByStoreIdAndUsername(1L, "admin")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("password", "$2a$10$hashed")).thenReturn(true);
        when(jwtTokenProvider.generateToken(1L, 1L)).thenReturn("jwt-token");

        String token = authService.authenticate("store-001", "admin", "password");

        assertThat(token).isEqualTo("jwt-token");
        assertThat(admin.getFailedLoginCount()).isEqualTo(0);
    }

    // TC-B-002: 비밀번호 실패 → failedLoginCount 증가
    @Test
    void authenticate_wrongPassword_incrementsFailedCount() {
        when(storeRepository.findByIdentifier("store-001")).thenReturn(Optional.of(store));
        when(adminRepository.findByStoreIdAndUsername(1L, "admin")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrong", "$2a$10$hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.authenticate("store-001", "admin", "wrong"))
                .isInstanceOf(UnauthorizedException.class);
        assertThat(admin.getFailedLoginCount()).isEqualTo(1);
    }

    // TC-B-003: 5회 실패 → 계정 잠금
    @Test
    void authenticate_fiveFailures_locksAccount() {
        admin.setFailedLoginCount(4);
        when(storeRepository.findByIdentifier("store-001")).thenReturn(Optional.of(store));
        when(adminRepository.findByStoreIdAndUsername(1L, "admin")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrong", "$2a$10$hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.authenticate("store-001", "admin", "wrong"))
                .isInstanceOf(UnauthorizedException.class);
        assertThat(admin.getLockedUntil()).isNotNull();
        assertThat(admin.getLockedUntil()).isAfter(LocalDateTime.now());
    }

    // TC-B-004: 잠긴 계정 → AccountLockedException
    @Test
    void authenticate_lockedAccount_throwsAccountLockedException() {
        admin.setLockedUntil(LocalDateTime.now().plusMinutes(20));
        when(storeRepository.findByIdentifier("store-001")).thenReturn(Optional.of(store));
        when(adminRepository.findByStoreIdAndUsername(1L, "admin")).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> authService.authenticate("store-001", "admin", "password"))
                .isInstanceOf(AccountLockedException.class);
    }
}
