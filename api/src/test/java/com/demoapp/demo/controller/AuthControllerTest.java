package com.demoapp.demo.controller;

import com.demoapp.demo.model.User; // Ajuste o pacote do User conforme sua estrutura (ex: entity ou model)
import com.demoapp.demo.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

// Imports estáticos essenciais para Mockito e MockMvc
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class) // Corrigido: deve referenciar o Controller sob teste, não a classe de teste
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Test
    @DisplayName("Deve retornar status 200 OK e os dados do usuário ao realizar signup com sucesso")
    void deveCadastrarUsuarioComSucesso() throws Exception {
        User usuarioCriado = new User();
        usuarioCriado.setEmail("novo@teste.com");
        usuarioCriado.setPassword("SenhaForte@123");

        when(userService.isEmailValid("novo@teste.com")).thenReturn(true);
        when(userService.isPasswordValid("SenhaForte@123")).thenReturn(true);
        when(userService.findByEmail("novo@teste.com")).thenReturn(null);
        when(userService.createUser("novo@teste.com", "SenhaForte@123")).thenReturn(usuarioCriado);

        String payloadJson = """
            {
                "email": "novo@teste.com",
                "password": "SenhaForte@123"
            }
        """;

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payloadJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("novo@teste.com"));
    }

    @Test
    @DisplayName("Deve retornar status 401 e mensagem de erro ao errar credenciais no signin")
    void deveRetornar401QuandoCredenciaisForemInvalidas() throws Exception {
        User usuarioCadastrado = new User();
        usuarioCadastrado.setEmail("usuario@teste.com");
        usuarioCadastrado.setPassword("SenhaCorreta@123");

        when(userService.isEmailValid("usuario@teste.com")).thenReturn(true);
        when(userService.isPasswordValid("SenhaErrada@123")).thenReturn(true);
        when(userService.findByEmail("usuario@teste.com")).thenReturn(usuarioCadastrado);

        String payloadJson = """
            {
                "email": "usuario@teste.com",
                "password": "SenhaErrada@123"
            }
        """;

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payloadJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Credenciais inválidas"))
                .andExpect(jsonPath("$.status").value(401));
    }
}