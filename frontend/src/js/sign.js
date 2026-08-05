import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export function useSignupForm() {
  const router = useRouter();

  const form = reactive({
    name: '',
    username: '',
    contact: '',
    password: '',
    day: '',
    month: '',
    year: ''
  });

  const errorMessage = ref('');
  const isSubmitting = ref(false);

  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const currentYear = new Date().getFullYear();
  const years = computed(() => {
    const list = [];
    for (let y = currentYear; y >= currentYear - 100; y--) list.push(y);
    return list;
  });

  function goToLogin() {
    router.push('/login');
  }

  async function handleSubmit() {
    errorMessage.value = '';

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact);
    if (!isEmail) {
      errorMessage.value = 'Digite um e-mail válido.';
      return;
    }

    if (!form.day || !form.month || !form.year) {
      errorMessage.value = 'Preencha a data de nascimento.';
      return;
    }

    isSubmitting.value = true;

    try {
      console.log('Dados do cadastro:', form);
      // aqui entra a chamada real pra API (register)
    } catch (err) {
      errorMessage.value = 'Não foi possível criar a conta. Tente novamente.';
      console.error(err);
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    form,
    errorMessage,
    isSubmitting,
    months,
    years,
    goToLogin,
    handleSubmit
  };
}