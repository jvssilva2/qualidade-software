import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Post from './PostCard';
import { useAuth } from '../contexts/AuthContext';

// Mock do AuthContext via caminho relativo (caso o Post consuma o estado de login)
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Post Component', () => {
  const mockPost = {
    id: 1,
    title: 'Post de Teste SQA',
    body: 'Este é o conteúdo do post para validação de software.',
    liked: false,
  };

  const mockOnLike = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título e o corpo do post corretamente', () => {
    render(
      <Post
        post={mockPost}
        isAuthenticated={false}
        onLike={mockOnLike}
      />
    );

    expect(screen.getByText('Post de Teste SQA')).toBeInTheDocument();
    expect(
      screen.getByText('Este é o conteúdo do post para validação de software.')
    ).toBeInTheDocument();
  });

  it('deve renderizar o botão de curtir', () => {
    render(
      <Post
        post={mockPost}
        isAuthenticated={false}
        onLike={mockOnLike}
      />
    );

    const likeButton = screen.getByRole('button', { name: /curtir/i });
    expect(likeButton).toBeInTheDocument();
  });

  it('deve chamar onLike ou alert ao clicar no botão', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Post
        post={mockPost}
        isAuthenticated={false}
        onLike={mockOnLike}
      />
    );

    const likeButton = screen.getByRole('button', { name: /curtir/i });
    fireEvent.click(likeButton);

    expect(alertMock).toHaveBeenCalledWith(
      'Você precisa estar autenticado para curtir posts!'
    );

    alertMock.mockRestore();
  });
});
describe('PostCard - Likes e Dislikes (feature)', () => {
  const mockOnLike = jest.fn();

  it('deve exibir o número de likes e dislikes vindo de reactions', () => {
    render(
      <Post
        post={{
          id: 10,
          title: 'Post com reações',
          body: 'Corpo',
          liked: false,
          reactions: { likes: 192, dislikes: 25 },
        }}
        isAuthenticated={false}
        onLike={mockOnLike}
      />
    );

    expect(screen.getByTestId('post-likes')).toHaveTextContent('192 likes');
    expect(screen.getByTestId('post-dislikes')).toHaveTextContent('25 dislikes');
  });

  it('deve exibir 0 likes e 0 dislikes quando o post não possui reactions', () => {
    render(
      <Post
        post={{ id: 11, title: 'Sem reações', body: 'Corpo', liked: false }}
        isAuthenticated={false}
        onLike={mockOnLike}
      />
    );

    expect(screen.getByTestId('post-likes')).toHaveTextContent('0 likes');
    expect(screen.getByTestId('post-dislikes')).toHaveTextContent('0 dislikes');
  });

  it('não deve alterar likes/dislikes da DummyJSON ao clicar em curtir', async () => {
    const onLike = jest.fn().mockResolvedValue(undefined);

    render(
      <Post
        post={{
          id: 12,
          title: 'Post',
          body: 'Corpo',
          liked: false,
          reactions: { likes: 5, dislikes: 1 },
        }}
        isAuthenticated={true}
        onLike={onLike}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /curtir/i }));

    expect(onLike).toHaveBeenCalledWith(12);
    expect(await screen.findByText('Curtido')).toBeInTheDocument();
    expect(screen.getByTestId('post-likes')).toHaveTextContent('5 likes');
    expect(screen.getByTestId('post-dislikes')).toHaveTextContent('1 dislikes');
  });
});
