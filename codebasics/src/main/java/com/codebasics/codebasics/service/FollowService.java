package com.codebasics.codebasics.service;

import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class FollowService {

    @Autowired
    private UserRepository userRepository;

    public void followUser(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User following = userRepository.findById(followingId).orElseThrow();

        follower.getFollowing().add(following);
        userRepository.save(follower);
    }

    public void unfollowUser(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User following = userRepository.findById(followingId).orElseThrow();

        follower.getFollowing().remove(following);
        userRepository.save(follower);
    }

    public Set<User> getFollowers(Long userId) {
        return userRepository.findById(userId).orElseThrow().getFollowers();
    }

    public Set<User> getFollowing(Long userId) {
        return userRepository.findById(userId).orElseThrow().getFollowing();
    }

}
