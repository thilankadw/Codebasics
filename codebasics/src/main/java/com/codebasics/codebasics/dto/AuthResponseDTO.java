package com.codebasics.codebasics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;



public class AuthResponseDTO {
    private String token;

    public void setToken(String token) {
        this.token = token;
    }

    public AuthResponseDTO(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}