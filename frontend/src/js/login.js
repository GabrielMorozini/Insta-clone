import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/auth';

export function useLoginForm() {
  const router = useRouter();

  const username = ref('');
  const password = ref('');
  const error = ref('');
  const isSubmitting = ref(false);
  const toastMessage = ref('');

  const canSubmit = computed(
    () => username.value.trim().length > 0 && password.value.length > 0 && !isSubmitting.value
  );

  async function handleSubmit() {
    error.value = '';
    toastMessage.value = '';

    if (!username.value.trim() || !password.value) {
      error.value = 'Preencha usuário/e-mail e senha para entrar.';
      return;
    }

    isSubmitting.value = true;

    try {
      const data = await login(username.value.trim(), password.value);
      toastMessage.value = `Bem-vindo(a) de volta, ${data.user.name ?? username.value.trim()}!`;

      setTimeout(() => {
        router.push('/feed');
      }, 600);
    } catch (err) {
      if (err.response?.status === 401) {
        error.value = 'Usuário ou senha incorretos.';
      } else {
        error.value = 'Não foi possível entrar. Tente novamente.';
      }
      console.error(err);
    } finally {
      isSubmitting.value = false;
    }
  }

  function handleForgotPassword() {
    toastMessage.value = 'Um corvo foi enviado com instruções de recuperação.';
  }

  function handleCreateAccount() {
    router.push('/signup'); // ajuste pro path exato configurado no seu router
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