package com.demoapp.demo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.demoapp.demo.service.UserService;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class UserServiceUnitTest {

    private UserService userService;

    @BeforeEach
    void setUp() {
        // Instanciação manual direta sem Spring e sem recurso a Mockito
        userService = new UserService(null);
    }

    @Test
    @DisplayName("Deve validar com sucesso uma palavra-passe forte que cumpre todos os critérios")
    void deveValidarSenhaForteComSucesso() {
        // Regra: >= 8 carateres, maiúscula, minúscula, número e símbolo
        boolean valida = userService.isPasswordValid("Senha@123");
        assertTrue(valida, "A palavra-passe deveria ser aceite.");
    }

    @Test
    @DisplayName("BUG: Deve rejeitar um e-mail com formato incompleto (apenas com @)")
    void deveRejeitarEmailComFormatoInvalido() {
        boolean valida = userService.isEmailValid("usuario@");
        assertFalse(valida, "Um endereço incompleto como 'usuario@' não deve ser considerado válido.");
    }
}