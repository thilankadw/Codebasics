package com.codebasics.codebasics.dto;

public class RegisterDTO {
    private String username;
    private String email;
    private String password;
    private String name;
    private String city = null;      // Optional, defaults to null
    private String website = null;   // Optional, defaults to null
    private String coverPic = null;  // Optional, defaults to null
    private String profilePic = null;

    // Getter methods
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    public String getCity() {
        return city;
    }

    public String getWebsite() {
        return website;
    }

    public String getCoverPic() {
        return coverPic;
    }

    public String getProfilePic() {
        return profilePic;
    }

    // Setter methods
    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
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
}
