package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.dto.AuthResponseDTO;
import com.codebasics.codebasics.dto.LoginDTO;
import com.codebasics.codebasics.dto.RegisterDTO;
import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.service.AuthService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

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
    @PutMapping(value = "/userupdate/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public User updateUser(
            @PathVariable Long id,
            @RequestPart("registerDTO") String registerDTOStr,  // receive it as String first
            @RequestPart(value = "profilePic", required = false) MultipartFile profilePic,
            @RequestPart(value = "coverPic", required = false) MultipartFile coverPic
    ) throws JsonProcessingException {

        // Convert JSON String to RegisterDTO manually
        ObjectMapper objectMapper = new ObjectMapper();
        RegisterDTO registerDTO = objectMapper.readValue(registerDTOStr, RegisterDTO.class);

        System.out.println("Incoming update request:");
        System.out.println("ID: " + id);
        System.out.println("Username: " + registerDTO.getUsername());
        System.out.println("Email: " + registerDTO.getEmail());
      //  System.out.println("Password: " + registerDTO.getPassword());
        System.out.println("Name: " + registerDTO.getName());
        System.out.println("City: " + registerDTO.getCity());
        System.out.println("Website: " + registerDTO.getWebsite());
        System.out.println("ProfilePic present: " + (profilePic != null));
        System.out.println("CoverPic present: " + (coverPic != null));

        return authService.updateUser(id, registerDTO, profilePic, coverPic);
    }

    // Delete User
    @DeleteMapping("/usersdelete/{id}")
    public void deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
    }


}
