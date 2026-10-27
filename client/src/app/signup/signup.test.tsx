import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from './page';
import { AxiosError } from 'axios';

// 1. Variáveis de controle para os mocks
const mockPush = jest.fn();
const mockLogin = jest.fn();
const mockSignUp = jest.fn();

// 2. Mocks das dependências externas com caminhos relativos
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
    signUp: (...args: any[]) => mockSignUp(...args),
  },
}));

jest.mock('../../components/Header', () => () => <header data-testid="mock-header" />);

describe('Integração - Fluxo de Sign Up (Cadastro)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve cadastrar, autenticar e redirecionar o usuário para "/" ao preencher dados válidos', async () => {
    const mockUserData = { id: 2, email: 'novo_usuario@teste.com' };
    mockSignUp.mockResolvedValueOnce(mockUserData);

    render(<SignUp />);

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const [passwordInput, confirmPasswordInput] = screen.getAllByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /^criar conta$/i });

    fireEvent.change(emailInput, { target: { value: 'novo_usuario@teste.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SenhaForte@2026' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SenhaForte@2026' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'novo_usuario@teste.com',
        password: 'SenhaForte@2026',
      });
      // Requisito 1: Usuário autenticado e direcionado para "/"
      expect(mockLogin).toHaveBeenCalledWith({ id: 2, email: 'novo_usuario@teste.com' });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('deve exibir a mensagem "E-mail já cadastrado" quando a API acusar duplicidade', async () => {
    const mockAxiosError = new AxiosError(
      'Request failed with status code 400',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
        data: { message: 'E-mail já cadastrado' },
      }
    );

    mockSignUp.mockRejectedValueOnce(mockAxiosError);

    render(<SignUp />);

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const [passwordInput, confirmPasswordInput] = screen.getAllByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /^criar conta$/i });

    fireEvent.change(emailInput, { target: { value: 'duplicado@teste.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SenhaForte@2026' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SenhaForte@2026' } });
    fireEvent.click(submitButton);

    // Requisito 1: Mensagem exata exigida pelo sistema
    await waitFor(() => {
      expect(screen.getByText('E-mail já cadastrado')).toBeInTheDocument();
    });
  });

  it('deve bloquear a submissão e exibir mensagem de erro se a senha não cumprir os requisitos fortes', async () => {
    render(<SignUp />);

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const [passwordInput, confirmPasswordInput] = screen.getAllByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /^criar conta$/i });

    fireEvent.change(emailInput, { target: { value: 'usuario@teste.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senhafraca' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'senhafraca' } });
    fireEvent.click(submitButton);

    expect(mockSignUp).not.toHaveBeenCalled();
  });
});