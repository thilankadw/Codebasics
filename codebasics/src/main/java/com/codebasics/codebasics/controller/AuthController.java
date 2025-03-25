package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.dto.AuthResponseDTO;
import com.codebasics.codebasics.dto.LoginDTO;
import com.codebasics.codebasics.dto.RegisterDTO;
import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterDTO registerDTO) {
        return authService.register(registerDTO);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginDTO loginDTO) {
        return authService.login(loginDTO);
    }

    // ✅ Fetch all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }

    // ✅ Fetch user by ID
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return authService.getUserById(id);
    }
    // Update User
    @PutMapping("/userupdate/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody RegisterDTO registerDTO) {
        return authService.updateUser(id, registerDTO);
    }

    // Delete User
    @DeleteMapping("/usersdelete/{id}")
    public void deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
    }
}
