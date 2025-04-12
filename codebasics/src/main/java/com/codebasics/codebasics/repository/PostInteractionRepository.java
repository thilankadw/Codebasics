package com.codebasics.codebasics.repository;

import com.codebasics.codebasics.model.PostInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostInteractionRepository extends JpaRepository<PostInteraction, Long> {
}
