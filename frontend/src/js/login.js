import { ref, computed } from 'vue';

export function useLoginForm() {
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const isSubmitting = ref(false);
  const toastMessage = ref('');

  const canSubmit = computed(
    () => username.value.trim().length > 0 && password.value.length > 0 && !isSubmitting.value
  );

  function handleSubmit() {
    error.value = '';
    toastMessage.value = '';

    if (!username.value.trim() || !password.value) {
      error.value = 'Preencha usuário/e-mail e senha para entrar.';
      return;
    }

    isSubmitting.value = true;
    // Simula uma chamada de autenticação. Troque pela chamada real ao backend.
    setTimeout(() => {
      isSubmitting.value = false;
      toastMessage.value = `Bem-vindo(a) de volta, ${username.value.trim()}!`;
    }, 700);
  }

  function handleForgotPassword() {
    toastMessage.value = 'Um corvo foi enviado com instruções de recuperação.';
  }

  function handleCreateAccount() {
    toastMessage.value = 'Vamos criar sua conta no Clã em breve!';
  }

  return {
    username,
    password,
    error,
    isSubmitting,
    canSubmit,
    toastMessage,
    handleSubmit,
    handleForgotPassword,
    handleCreateAccount,
  };
}