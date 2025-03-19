package com.codebasics.codebasics.service;



import com.codebasics.codebasics.dto.AuthResponseDTO;
import com.codebasics.codebasics.dto.LoginDTO;
import com.codebasics.codebasics.dto.RegisterDTO;
import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.repository.UserRepository;
import com.codebasics.codebasics.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public void register(RegisterDTO registerDTO) {
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setName(registerDTO.getName());
        userRepository.save(user);
    }

    public AuthResponseDTO login(LoginDTO loginDTO) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));
        UserDetails user = userRepository.findByUsername(loginDTO.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponseDTO(token);
    }
}