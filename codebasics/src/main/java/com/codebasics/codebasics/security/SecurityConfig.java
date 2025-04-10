package com.codebasics.codebasics.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler) {
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF if using JWT
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/auth/register", "/api/auth/login", "/login/oauth2/**", "/oauth2/**","/api/auth/users","/api/auth/users/{id}","/api/auth/userupdate/{id}","/api/auth/usersdelete/{id}","/api/posts/create","/api/posts/update/{postId}","/api/posts/{id}","/api/posts","/api/posts/user/{userId}","/api/posts/{id}","/admin/**","api/user-learning-plans/**","api/learning-plan/**").permitAll()
                                .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2SuccessHandler)
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)); //allowing sessions for oauth

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ Fix: Define AuthenticationManager Bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
