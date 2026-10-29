import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './page';
import { useAuth } from '../contexts/AuthContext';
import { postsService } from '../service/posts/posts';

// 1. Mock do Next Navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}));

// 2. Mock do AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// 3. Mock do postsService
jest.mock('../service/posts/posts', () => ({
  postsService: {
    getPosts: jest.fn(),
    getLikedPosts: jest.fn(),
    toggleLikePost: jest.fn(),
  },
}));

describe('Página Principal (Feed - Integração)', () => {
  const mockPosts = [
    {
      id: 1,
      title: 'Primeiro Post do Feed',
      body: 'Conteúdo de teste do primeiro post.',
      liked: false,
      reactions: { likes: 192, dislikes: 25 },
    },
    {
      id: 2,
      title: 'Segundo Post do Feed',
      body: 'Conteúdo de teste do segundo post.',
      liked: true,
      reactions: { likes: 859, dislikes: 32 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Retorna o objeto { posts: [...] } que o page.tsx consome
    (postsService.getPosts as jest.Mock).mockResolvedValue({
      posts: mockPosts,
    });
  });

  it('deve carregar e renderizar as postagens vindas da API', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    render(<Home />);

    expect(await screen.findByText('Primeiro Post do Feed')).toBeInTheDocument();
    expect(await screen.findByText('Segundo Post do Feed')).toBeInTheDocument();
  });

  it('deve exibir alert nativo ao tentar curtir um post deslogado', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Home />);

    // findBy espera o carregamento dos posts e a renderização dos botões
    const likeButtons = await screen.findAllByRole('button', { name: /curtir/i });
    fireEvent.click(likeButtons[0]);

    expect(alertMock).toHaveBeenCalledWith(
      'Você precisa estar autenticado para curtir posts!'
    );

    alertMock.mockRestore();
  });

  it('deve exibir likes e dislikes de cada post no feed', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    render(<Home />);

    const likes = await screen.findAllByTestId('post-likes');
    const dislikes = screen.getAllByTestId('post-dislikes');

    expect(likes).toHaveLength(2);
    expect(likes[0]).toHaveTextContent('192 likes');
    expect(dislikes[0]).toHaveTextContent('25 dislikes');
    expect(likes[1]).toHaveTextContent('859 likes');
    expect(dislikes[1]).toHaveTextContent('32 dislikes');
  });
});
