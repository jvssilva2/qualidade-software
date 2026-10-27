import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe.configure({ mode: 'serial' });

test.describe('Testes E2E - Fluxos de Usuário', () => {
  const idUnico = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const usuario = {
    email: `teste_${idUnico}@exemplo.com`,
    senha: 'Senha@Forte123#',
  };

  // Teste 1: Registo completo com validação de hidratação
  test('E2E 01 - Deve cadastrar um novo usuário com sucesso', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    const inputEmail = page.getByPlaceholder('seu@email.com');
    const inputsSenha = page.locator('input[type="password"]');

    await inputEmail.click();
    await inputEmail.fill(usuario.email);
    await expect(inputEmail).toHaveValue(usuario.email);

    await inputsSenha.nth(0).fill(usuario.senha);
    await inputsSenha.nth(1).fill(usuario.senha);

    await page.locator('main').getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page).toHaveURL(/.*signin|.*login|\/$/, { timeout: 10000 });
  });

  // Teste 2: Início de sessão seguro e curtida
  test('E2E 02 - Deve fazer login e curtir uma publicação no feed', async ({ page }) => {
    await page.goto(`${BASE_URL}/signin`);

    const inputEmail = page.getByPlaceholder('seu@email.com');
    const inputSenha = page.locator('input[type="password"]');

    // Garante que o campo de login reteve o valor preenchido no WebKit
    await inputEmail.click();
    await inputEmail.fill(usuario.email);
    await expect(inputEmail).toHaveValue(usuario.email);

    await inputSenha.fill(usuario.senha);
    await page.locator('main').getByRole('button', { name: 'Entrar' }).click();

    // Aguarda o redirecionamento e a renderização do feed
    await expect(page.getByRole('heading', { name: 'Feed de Posts' })).toBeVisible({ timeout: 10000 });

    // Localiza e clica no primeiro botão de curtir
    const primeiroBotaoCurtir = page.getByRole('button', { name: /curtir/i }).first();
    await expect(primeiroBotaoCurtir).toBeVisible({ timeout: 10000 });
    await primeiroBotaoCurtir.click();

    // Valida a alteração visual do botão para o estado curtido
    await expect(
      page.locator('button:has-text("❤️"), button:has-text("Descurtir"), button:has-text("Curtido")').first()
    ).toBeVisible({ timeout: 10000 });
  });

  // Teste 3: Logout completo pelo cabeçalho
  test('E2E 03 - Deve realizar logout com sucesso pelo cabeçalho', async ({ page }) => {
    await page.goto(`${BASE_URL}/signin`);

    const inputEmail = page.getByPlaceholder('seu@email.com');
    await inputEmail.click();
    await inputEmail.fill(usuario.email);
    await expect(inputEmail).toHaveValue(usuario.email);

    await page.locator('input[type="password"]').fill(usuario.senha);
    await page.locator('main').getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByRole('heading', { name: 'Feed de Posts' })).toBeVisible({ timeout: 10000 });

    // Clica no botão "Sair"
    await page.getByRole('button', { name: 'Sair' }).click();

    // Valida retorno ao estado deslogado
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Criar Conta' })).toBeVisible({ timeout: 10000 });
  });
});