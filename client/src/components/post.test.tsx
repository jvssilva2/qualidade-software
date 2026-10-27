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