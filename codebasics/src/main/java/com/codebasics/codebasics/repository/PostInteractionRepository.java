package com.codebasics.codebasics.repository;

import com.codebasics.codebasics.model.InteractionType;
import com.codebasics.codebasics.model.PostInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostInteractionRepository extends JpaRepository<PostInteraction, Long> {
    boolean existsByUserIdAndPostIdAndType(Long userId, Long postId, InteractionType type);

    long countByPostIdAndType(Long postId, InteractionType type);
    List<PostInteraction> findByPostIdAndType(Long postId, InteractionType type);


}
