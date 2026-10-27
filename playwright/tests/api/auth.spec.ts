import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('Testes de Caixa-Preta da API - Autenticação', () => {
  // Garante que o teste 1 rode antes do teste 2
  test.describe.configure({ mode: 'serial' });

  const emailValido = `qa${Date.now()}@teste.com`;
  const senhaValida = 'Senha@1234'; // Com letra maiúscula, minúscula, número e símbolo

  test('1. POST /auth/signup - Cadastro com sucesso (Status 200)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/signup`, {
      data: {
        email: emailValido,
        password: senhaValida,
      },
    });

    const body = await response.json();
    if (response.status() === 422) {
      console.log('Motivo da falha 422 no signup:', body);
    }

    expect(response.status()).toBe(200);
    expect(body.email).toBe(emailValido);
  });

  test('2. POST /auth/signup - Erro ao cadastrar e-mail duplicado (Status 409)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/signup`, {
      data: {
        email: emailValido,
        password: senhaValida,
      },
    });
    //Tentativa de cadastro com o mesmo email, resultando em conflito

    const body = await response.json();
    expect(response.status()).toBe(409);
    expect(body.message).toBe('E-mail já está em uso');
    expect(body.status).toBe(409);
  });

  test('3. POST /auth/signin - Login realizado com sucesso (Status 200)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/signin`, {
      data: {
        email: emailValido,
        password: senhaValida,
      },
    }); // Tentativa de login com e-mail e senha válidos, esperando sucesso

    const body = await response.json();
    if (response.status() === 422) {
      console.log('Motivo da falha 422 no signin:', body);
    } 

    expect(response.status()).toBe(200);
    expect(body.email).toBe(emailValido);
  });

  test('4. POST /auth/signin - Erro de credenciais inválidas / senha incorreta (Status 401)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/signin`, {
      data: {
        email: emailValido,
        password: 'SenhaErrada@999',
      },
    }); // Tentativa de login com senha incorreta, esperando falha de autenticação

    const body = await response.json();
    expect(response.status()).toBe(401);
    expect(body.message).toBe('Credenciais inválidas');
    expect(body.status).toBe(401);
  });

  test('5. POST /auth/reset-password - Erro ao redefinir senha de usuário inexistente (Status 404)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/reset-password`, {
      data: {
        email: 'usuario_inexistente_999@teste.com',
      },
    });

    const body = await response.json();
    expect(response.status()).toBe(404);
    expect(body.message).toBe('Usuário não encontrado');
    expect(body.status).toBe(404);
  }); // Tenta redefinir a senha de um usuário que não existe, espera um erro 404
});