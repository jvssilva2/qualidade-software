package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;

/**
 * Testes de caixa-branca da feature de likes/dislikes.
 * A DummyJSON é simulada com um RestTemplate mockado.
 */
@ExtendWith(MockitoExtension.class)
class PostServiceReactionsTest {

    @Mock
    private UserPostReactionRepository reactionRepository;

    @Mock
    private RestTemplate restTemplate;

    private PostService postService;

    @BeforeEach
    void setUp() {
        postService = new PostService(reactionRepository, restTemplate);
    }

    @Test
    @DisplayName("getPosts deve repassar likes e dislikes do objeto reactions da DummyJSON")
    @SuppressWarnings("unchecked")
    void deveRetornarReacoesDosPosts() {
        String json = """
            {
              "posts": [
                { "id": 1, "title": "Post 1", "body": "Corpo 1",
                  "reactions": { "likes": 192, "dislikes": 25 } },
                { "id": 2, "title": "Post 2", "body": "Corpo 2",
                  "reactions": { "likes": 859, "dislikes": 32 } }
              ],
              "total": 2, "skip": 0, "limit": 2
            }
            """;
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenReturn(json);

        Map<String, Object> result = postService.getPosts(2, 0, null);

        List<Map<String, Object>> posts = (List<Map<String, Object>>) result.get("posts");
        Map<String, Integer> reacoes1 = (Map<String, Integer>) posts.get(0).get("reactions");
        Map<String, Integer> reacoes2 = (Map<String, Integer>) posts.get(1).get("reactions");

        assertEquals(192, reacoes1.get("likes"));
        assertEquals(25, reacoes1.get("dislikes"));
        assertEquals(859, reacoes2.get("likes"));
        assertEquals(32, reacoes2.get("dislikes"));
    }

    @Test
    @DisplayName("getPosts deve retornar 0 likes e 0 dislikes quando o post não tiver reactions")
    @SuppressWarnings("unchecked")
    void deveRetornarZeroQuandoNaoHouverReacoes() {
        String json = """
            {
              "posts": [ { "id": 3, "title": "Sem reações", "body": "Corpo" } ],
              "total": 1, "skip": 0, "limit": 1
            }
            """;
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenReturn(json);

        Map<String, Object> result = postService.getPosts(1, 0, null);

        List<Map<String, Object>> posts = (List<Map<String, Object>>) result.get("posts");
        Map<String, Integer> reacoes = (Map<String, Integer>) posts.get(0).get("reactions");

        assertEquals(0, reacoes.get("likes"));
        assertEquals(0, reacoes.get("dislikes"));
    }

    @Test
    @DisplayName("getLikedPosts deve incluir as reações de cada post curtido")
    @SuppressWarnings("unchecked")
    void deveRetornarReacoesDosPostsCurtidos() {
        UserPostReaction curtida = new UserPostReaction();
        curtida.setUserId(10L);
        curtida.setPostId(5L);
        when(reactionRepository.findByUserId(anyLong())).thenReturn(Collections.singletonList(curtida));

        String json = """
            { "id": 5, "title": "Curtido", "body": "Corpo",
              "reactions": { "likes": 7, "dislikes": 3 } }
            """;
        when(restTemplate.getForObject(eq("https://dummyjson.com/posts/5"), eq(String.class))).thenReturn(json);

        Map<String, Object> result = postService.getLikedPosts(10L, 5, 0);

        List<Map<String, Object>> posts = (List<Map<String, Object>>) result.get("posts");
        Map<String, Integer> reacoes = (Map<String, Integer>) posts.get(0).get("reactions");

        assertEquals(7, reacoes.get("likes"));
        assertEquals(3, reacoes.get("dislikes"));
    }
}
