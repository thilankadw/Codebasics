package com.codebasics.codebasics.dto;

public class AuthResponseDTO {
    private String token;
    private Long id;
    private String username;
    private String name;
    private String email;


    // Default constructor
    public AuthResponseDTO() {
    }

    // Constructor with token only (optional)
    public AuthResponseDTO(String token) {
        this.token = token;
    }

    // Getters and Setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }




}
