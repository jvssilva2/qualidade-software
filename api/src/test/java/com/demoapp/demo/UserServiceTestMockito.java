package com.demoapp.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;
import com.demoapp.demo.service.UserService;

@ExtendWith(MockitoExtension.class)
class UserServiceMockitoTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Deve salvar e retornar um novo usuário mockando a persistência do repositório")
    void deveCriarUsuarioComSucesso() {
        User usuarioSalvo = new User();
        usuarioSalvo.setEmail("dev@teste.com");
        usuarioSalvo.setPassword("SenhaForte@123");

        when(userRepository.save(any(User.class))).thenReturn(usuarioSalvo);

        User resultado = userService.createUser("dev@teste.com", "SenhaForte@123");

        assertNotNull(resultado, "O usuário retornado não deve ser nulo.");
        assertEquals("dev@teste.com", resultado.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Deve buscar e retornar usuário existente por e-mail com sucesso")
    void deveBuscarUsuarioPorEmailComSucesso() {
        User usuarioMock = new User();
        usuarioMock.setEmail("cadastrado@teste.com");

        when(userRepository.findByEmail("cadastrado@teste.com")).thenReturn(Optional.of(usuarioMock));

        User resultado = userService.findByEmail("cadastrado@teste.com");

        assertNotNull(resultado, "O usuário encontrado não deve ser nulo.");
        assertEquals("cadastrado@teste.com", resultado.getEmail());
        verify(userRepository, times(1)).findByEmail("cadastrado@teste.com");
    }
}
