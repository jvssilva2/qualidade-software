import { isPasswordValid, getPasswordValidationMessage } from './password';

describe('Validação de Senha (Funções Simples)', () => {

  describe('isPasswordValid', () => {
    it('deve retornar true para uma senha forte com EXATAMENTE 8 caracteres (Captura de Bug)', () => {
      expect(isPasswordValid('Abc@1234')).toBe(true);
    });

    it('deve retornar true para senhas válidas com mais de 8 caracteres', () => {
      expect(isPasswordValid('SenhaForte@2026')).toBe(true);
    });

    it('deve retornar false para senhas sem letra maiúscula', () => {
      expect(isPasswordValid('senhafraca@1234')).toBe(false);
    });

    it('deve retornar false para senhas sem letra minúscula', () => {
      expect(isPasswordValid('SENHAFRACA@1234')).toBe(false);
    });

    it('deve retornar false para senhas sem número', () => {
      expect(isPasswordValid('SenhaFraca@abcde')).toBe(false);
    });

    it('deve retornar false para senhas sem caractere especial', () => {
      expect(isPasswordValid('SenhaFraca12345')).toBe(false);
    });
  });

  describe('getPasswordValidationMessage', () => {
    it('não deve incluir erro de tamanho para senhas com exatamente 8 caracteres', () => {
      const senhaOitoCaracteres = 'Abc@1234';
      const mensagem = getPasswordValidationMessage(senhaOitoCaracteres);
      
      
      expect(mensagem).toBe(""); 
    });

    
    it('deve retornar mensagem completa de erro para senha muito fraca', () => {
      const mensagem = getPasswordValidationMessage('fraca');
      expect(mensagem).toContain('mínimo de 8 caracteres');
      expect(mensagem).toContain('uma letra maiúscula');
      expect(mensagem).toContain('um número');
      expect(mensagem).toContain('um caractere especial');
    });

    it('deve retornar "Senha é obrigatória" se a senha for vazia', () => {
      expect(getPasswordValidationMessage('')).toBe('Senha é obrigatória');
    });
  });
});