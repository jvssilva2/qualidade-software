import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8080';
const DUMMYJSON_URL = 'https://dummyjson.com';

test.describe('API - GET /posts com reações (likes/dislikes)', () => {
  test('deve retornar reactions.likes e reactions.dislikes numéricos em cada post', async ({ request }) => {
    const response = await request.get(`${API_URL}/posts`, { params: { limit: 5, skip: 0 } });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.posts.length).toBeGreaterThan(0);

    for (const post of body.posts) {
      expect(post).toHaveProperty('reactions');
      expect(typeof post.reactions.likes).toBe('number');
      expect(typeof post.reactions.dislikes).toBe('number');
    }
  });

  test('deve repassar exatamente as reações da DummyJSON', async ({ request }) => {
    const [apiResponse, dummyResponse] = await Promise.all([
      request.get(`${API_URL}/posts`, { params: { limit: 5, skip: 0 } }),
      request.get(`${DUMMYJSON_URL}/posts`, { params: { limit: 5, skip: 0 } }),
    ]);

    expect(apiResponse.ok()).toBeTruthy();
    expect(dummyResponse.ok()).toBeTruthy();

    const apiPosts = (await apiResponse.json()).posts;
    const dummyPosts = (await dummyResponse.json()).posts;

    for (const dummyPost of dummyPosts) {
      const apiPost = apiPosts.find((p: { id: number }) => p.id === dummyPost.id);
      expect(apiPost, `post ${dummyPost.id} deveria existir na API`).toBeDefined();
      expect(apiPost.reactions).toEqual({
        likes: dummyPost.reactions.likes,
        dislikes: dummyPost.reactions.dislikes,
      });
    }
  });
});
