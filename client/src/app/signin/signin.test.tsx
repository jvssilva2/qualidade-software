import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from './page';
import '@testing-library/jest-dom';
import { AxiosError } from 'axios';


// 1. Variáveis de controle para os mocks
const mockPush = jest.fn();
const mockLogin = jest.fn();
const mockSignIn = jest.fn();

// 2. Mocks utilizando caminhos relativos para garantir resolução no disco
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock('../../service/auth/auth', () => ({
  authService: {
    signIn: (...args: any[]) => mockSignIn(...args),
  },
}));

jest.mock('../../components/Header', () => () => <header data-testid="mock-header" />);

describe('Integração - Fluxo de Sign In', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir mensagens de validação quando os campos forem submetidos vazios', async () => {
    render(<SignIn />);

    const submitButton = screen.getByRole('button', { name: /^entrar$/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Email é obrigatório')).toBeInTheDocument();
    expect(await screen.findByText('Senha é obrigatória')).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('deve autenticar o utilizador e redirecionar para "/" em caso de sucesso', async () => {
    const mockUserData = { id: 1, email: 'dev@teste.com' };
    mockSignIn.mockResolvedValueOnce(mockUserData);

    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: 'dev@teste.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SenhaForte@123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ id: 1, email: 'dev@teste.com' });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('deve exibir a mensagem "Credenciais inválidas" quando a API recusar o login', async () => {
    const mockAxiosError = new AxiosError(
      'Request failed with status code 401',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
        data: { message: 'Credenciais inválidas' },
      }
    );

    mockSignIn.mockRejectedValueOnce(mockAxiosError);

    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: 'usuario@teste.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SenhaIncorreta@123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });
  });
});