package com.codebasics.codebasics.security;

import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${app.oauth2.redirectUri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    public OAuth2AuthenticationSuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oAuth2User = ((OAuth2AuthenticationToken) authentication).getPrincipal();

            Map<String, Object> attributes = oAuth2User.getAttributes();
            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String picture = (String) attributes.get("picture");

            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> createNewUser(email, name, picture));

            String token = jwtUtil.generateToken(user.getUsername());

            String targetUrl = redirectUri + "?token=" + token +
                    "&id=" + user.getId() +
                    "&username=" + user.getUsername() +
                    "&name=" + user.getName() +
                    "&email=" + user.getEmail();

            if (user.getProfilePic() != null) {
                targetUrl += "&profilePic=" + user.getProfilePic();
            }

            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        }
    }

    private User createNewUser(String email, String name, String picture) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setUsername(generateUsername(email));
        newUser.setPassword(UUID.randomUUID().toString());
        newUser.setProfilePic(picture);

        return userRepository.save(newUser);
    }

    private String generateUsername(String email) {
        String baseUsername = email.split("@")[0];

        String username = baseUsername;
        int attempt = 1;

        while (userRepository.findByUsername(username).isPresent()) {
            username = baseUsername + attempt++;
        }

        return username;
    }
}