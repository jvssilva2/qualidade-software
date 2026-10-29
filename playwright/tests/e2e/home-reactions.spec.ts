import { test, expect } from '@playwright/test';

test.describe('E2E - Home exibe likes e dislikes dos posts', () => {
  test('cada post do feed deve exibir likes e dislikes', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Feed de Posts' })).toBeVisible();

    const likes = page.getByTestId('post-likes');
    const dislikes = page.getByTestId('post-dislikes');

    await expect(likes.first()).toBeVisible({ timeout: 15000 });

    const totalPosts = await page.getByRole('listitem').count();
    await expect(likes).toHaveCount(totalPosts);
    await expect(dislikes).toHaveCount(totalPosts);

    await expect(likes.first()).toHaveText(/^👍 \d+ likes$/);
    await expect(dislikes.first()).toHaveText(/^👎 \d+ dislikes$/);
  });

  test('valores exibidos devem ser os mesmos retornados pela API', async ({ page }) => {
    // Captura a resposta real de GET /posts consumida pela Home
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/posts') && res.request().method() === 'GET' && res.ok()
    );

    await page.goto('/');
    const body = await (await responsePromise).json();
    const primeiro = body.posts[0];

    const primeiroCard = page.getByRole('listitem').filter({ hasText: primeiro.title }).first();
    await expect(primeiroCard.getByTestId('post-likes')).toHaveText(`👍 ${primeiro.reactions.likes} likes`);
    await expect(primeiroCard.getByTestId('post-dislikes')).toHaveText(`👎 ${primeiro.reactions.dislikes} dislikes`);
  });
});
