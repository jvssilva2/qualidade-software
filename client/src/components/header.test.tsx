import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header'; // ou o caminho relativo exato do seu componente
import { useAuth } from '../contexts/AuthContext'; // caminho relativo sem usar @/

// 1. Mock do Next.js App Router (elimina o erro de "app router to be mounted")
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}));

// 2. Mock do AuthContext usando caminho relativo (elimina o erro de "Cannot find module")
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with the correct title', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, user: null });
    render(<Header />);
    expect(screen.getByText(/SQA Social Media/i)).toBeInTheDocument();
  });

  it('renders the "Posts Curtidos" button when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { name: 'Teste' } });
    render(<Header />);
    expect(screen.getByText(/Posts Curtidos/i)).toBeInTheDocument();
  });

  it('does not render the "Posts Curtidos" button when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, user: null });
    render(<Header />);
    expect(screen.queryByText(/Posts Curtidos/i)).not.toBeInTheDocument();
  });
});