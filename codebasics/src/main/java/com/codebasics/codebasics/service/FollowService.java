package com.codebasics.codebasics.service;

import com.codebasics.codebasics.dto.NotificationDTO;
import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FollowService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public void followUser(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User following = userRepository.findById(followingId).orElseThrow();

        follower.getFollowing().add(following);
        userRepository.save(follower);

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setRecipientUserId(followingId);
        notificationDTO.setType("USER_FOLLOWED");
        notificationDTO.setMessage(follower.getUsername() + " started following you.");
        notificationService.createNotification(notificationDTO);
    }

    public void unfollowUser(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User following = userRepository.findById(followingId).orElseThrow();

        follower.getFollowing().remove(following);
        userRepository.save(follower);

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setRecipientUserId(followingId);
        notificationDTO.setType("USER_UNFOLLOWED");
        notificationDTO.setMessage(follower.getUsername() + " has unfollowed you.");
        notificationService.createNotification(notificationDTO);
    }

    public Set<User> getFollowers(Long userId) {
        return userRepository.findById(userId).orElseThrow().getFollowers();
    }

    public Set<User> getFollowing(Long userId) {
        return userRepository.findById(userId).orElseThrow().getFollowing();
    }
    // In FollowService.java
    public Set<User> getSuggestions(Long userId) {
        User currentUser = userRepository.findById(userId).orElseThrow();
        Set<User> following = currentUser.getFollowing();
        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(userId)) // exclude self
                .filter(user -> !following.contains(user))     // exclude already followed
                .collect(Collectors.toSet());
    }
    public boolean isFollowing(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("Following user not found"));

        return follower.getFollowing().contains(following);
    }

}
