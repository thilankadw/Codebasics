package com.codebasics.codebasics.controller;

import com.codebasics.codebasics.model.User;
import com.codebasics.codebasics.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Set;


@RestController
@RequestMapping("/api/users")
public class Followcontroller {



    @Autowired
    private FollowService FollowService;

    @PostMapping("/{followerId}/follow/{followingId}")
    public ResponseEntity<?> follow(@PathVariable Long followerId, @PathVariable Long followingId) {
        FollowService.followUser(followerId, followingId);
        return ResponseEntity.ok("Followed!");
    }
    @GetMapping("/{followerId}/is-following/{followingId}")
    public ResponseEntity<Boolean> isFollowing(@PathVariable Long followerId, @PathVariable Long followingId) {
        return ResponseEntity.ok(FollowService.isFollowing(followerId, followingId));
    }


    @PostMapping("/{followerId}/unfollow/{followingId}")
    public ResponseEntity<?> unfollow(@PathVariable Long followerId, @PathVariable Long followingId) {
        FollowService.unfollowUser(followerId, followingId);
        return ResponseEntity.ok("Unfollowed!");
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<Set<User>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(FollowService.getFollowers(userId));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<Set<User>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(FollowService.getFollowing(userId));
    }
    // In FollowController.java
    @GetMapping("/{userId}/suggestions")
    public ResponseEntity<Set<User>> getSuggestions(@PathVariable Long userId) {
        return ResponseEntity.ok(FollowService.getSuggestions(userId));
    }

}
