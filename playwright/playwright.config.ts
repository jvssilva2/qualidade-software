import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Falha no CI se algum test.only for esquecido */
  forbidOnly: !!process.env.CI,
  /* Retry apenas no CI */
  retries: process.env.CI ? 2 : 0,
  /* Testes usam dados compartilhados (signup -> signin): 1 worker no CI */
  workers: process.env.CI ? 1 : undefined,
  /* No CI: saída no terminal + relatório HTML como artefato */
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /*
   * Sobe o client (build de produção) caso ainda não esteja rodando.
   * No CI o workflow já inicia o client antes, então ele é reaproveitado.
   */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    cwd: '../client',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
