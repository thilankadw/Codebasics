package com.codebasics.codebasics.dto;

import lombok.Getter;
import lombok.Setter;


public class LoginDTO {
    private String username;
    private String password;


    private String email;

    private String name;
    private String city;
    private String website;
    private String coverPic;
    private String profilePic;

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public void setCoverPic(String coverPic) {
        this.coverPic = coverPic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}