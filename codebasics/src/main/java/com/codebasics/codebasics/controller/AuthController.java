package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.dto.AuthResponseDTO;
import com.codebasics.codebasics.dto.LoginDTO;
import com.codebasics.codebasics.dto.RegisterDTO;
import com.codebasics.codebasics.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public void register(@RequestBody RegisterDTO registerDTO) {
        authService.register(registerDTO);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginDTO loginDTO) {
        return authService.login(loginDTO);
    }
}