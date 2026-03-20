package com.tableorder.service;

import com.tableorder.domain.admin.Admin;
import com.tableorder.domain.admin.AdminRepository;
import com.tableorder.domain.store.Store;
import com.tableorder.domain.store.StoreRepository;
import com.tableorder.exception.AccountLockedException;
import com.tableorder.exception.UnauthorizedException;
import com.tableorder.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    private final StoreRepository storeRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public Map<String, Object> authenticate(String storeIdentifier, String username, String password) {
        Store store = storeRepository.findByIdentifier(storeIdentifier)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        Admin admin = adminRepository.findByStoreIdAndUsername(store.getId(), username)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (admin.getLockedUntil() != null && admin.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new AccountLockedException("Account is locked. Try again later.");
        }

        if (!passwordEncoder.matches(password, admin.getPasswordHash())) {
            admin.setFailedLoginCount(admin.getFailedLoginCount() + 1);
            if (admin.getFailedLoginCount() >= MAX_FAILED_ATTEMPTS) {
                admin.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
            }
            adminRepository.save(admin);
            throw new UnauthorizedException("Invalid credentials");
        }

        admin.setFailedLoginCount(0);
        admin.setLockedUntil(null);
        adminRepository.save(admin);

        String token = jwtTokenProvider.generateToken(admin.getId(), store.getId());
        return Map.of("token", token, "storeId", store.getId());
    }
}
