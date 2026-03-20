package com.tableorder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tableorder.exception.AccountLockedException;
import com.tableorder.exception.UnauthorizedException;
import com.tableorder.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean AuthService authService;
    @MockBean com.tableorder.security.JwtTokenProvider jwtTokenProvider;
    @MockBean com.tableorder.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    // TC-B-015: 로그인 성공 → 200 + JWT
    @Test
    void login_success_returns200WithToken() throws Exception {
        when(authService.authenticate("store-001", "admin", "password")).thenReturn("jwt-token");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "storeIdentifier", "store-001",
                        "username", "admin",
                        "password", "password"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    // TC-B-016: 로그인 실패 → 401
    @Test
    void login_failure_returns401() throws Exception {
        when(authService.authenticate(any(), any(), any()))
                .thenThrow(new UnauthorizedException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "storeIdentifier", "store-001",
                        "username", "admin",
                        "password", "wrong"))))
                .andExpect(status().isUnauthorized());
    }
}
