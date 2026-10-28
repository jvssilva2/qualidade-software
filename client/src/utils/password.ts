export function isPasswordValid(password: string): boolean {
  if (!password || password.length < 8) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return hasUpperCase && hasNumber && hasSpecialChar;
}
export function getPasswordValidationMessage(password: string): string {
  const errors: string[] = [];

  // CORREÇÃO: adicionar erro se tiver MENOS de 8 caracteres
  if (!password || password.length < 8) {
    errors.push('mínimo de 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('uma letra maiúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('um número');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('um caractere especial');
  }

  if (errors.length === 0) {
    return '';
  }

  return `A senha deve conter: ${errors.join(', ')}`;
}