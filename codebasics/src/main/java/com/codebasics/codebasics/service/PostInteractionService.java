package com.codebasics.codebasics.service;

import com.codebasics.codebasics.dto.PostInteractionDTO;
import com.codebasics.codebasics.model.InteractionType;
import com.codebasics.codebasics.model.Post;
import com.codebasics.codebasics.model.PostInteraction;
import com.codebasics.codebasics.repository.PostInteractionRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostInteractionService {

    @Autowired
    private PostInteractionRepository postInteractionRepository;

    @Autowired
    private PostService postService;

    @Autowired
    private ModelMapper modelMapper;

    public PostInteractionDTO createPostInteraction(PostInteractionDTO postInteractionDTO) {
        Optional<Post> postOpt = Optional.ofNullable(postService.getPostById(postInteractionDTO.getPostId()));
        if (!postOpt.isPresent()) {
            throw new RuntimeException("Post not found");
        }

        Post post = postOpt.get();

        if (postInteractionDTO.getType() == InteractionType.COMMENT && (postInteractionDTO.getContent() == null || postInteractionDTO.getContent().isEmpty())) {
            throw new RuntimeException("Content is required for comment type");
        }

        PostInteraction postInteraction = new PostInteraction(
                postInteractionDTO.getUserId(),
                postInteractionDTO.getType(),
                postInteractionDTO.getContent(),
                post
        );
        postInteraction.setTimestamp(LocalDateTime.now());

        PostInteraction savedPostInteraction = postInteractionRepository.save(postInteraction);

        return modelMapper.map(savedPostInteraction, PostInteractionDTO.class);
    }

    public PostInteractionDTO updatePostInteraction(Long id, PostInteractionDTO postInteractionDTO) {
        Optional<PostInteraction> postInteractionOpt = postInteractionRepository.findById(id);
        if (!postInteractionOpt.isPresent()) {
            throw new RuntimeException("Post Interaction not found");
        }

        PostInteraction postInteraction = postInteractionOpt.get();

        if (postInteractionDTO.getType() == InteractionType.COMMENT && (postInteractionDTO.getContent() == null || postInteractionDTO.getContent().isEmpty())) {
            throw new RuntimeException("Content is required for comment type");
        }

        postInteraction.setUserId(postInteractionDTO.getUserId());
        postInteraction.setType(postInteractionDTO.getType());
        postInteraction.setContent(postInteractionDTO.getContent());
        postInteraction.setTimestamp(LocalDateTime.now());

        PostInteraction updatedPostInteraction = postInteractionRepository.save(postInteraction);

        return modelMapper.map(updatedPostInteraction, PostInteractionDTO.class);
    }

    public void deletePostInteraction(Long id) {
        postInteractionRepository.deleteById(id);
    }

    public Optional<PostInteractionDTO> getPostInteractionById(Long id) {
        Optional<PostInteraction> postInteractionOpt = postInteractionRepository.findById(id);
        return postInteractionOpt.map(postInteraction -> modelMapper.map(postInteraction, PostInteractionDTO.class));
    }

    public List<PostInteractionDTO> getAllPostInteractions() {
        List<PostInteraction> postInteractions = postInteractionRepository.findAll();
        return modelMapper.map(postInteractions, new TypeToken<List<PostInteractionDTO>>() {}.getType());
    }
}
