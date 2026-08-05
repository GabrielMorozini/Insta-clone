import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../services/auth.js';

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
    if (!form.name || !form.username || !form.password) {
      errorMessage.value = 'Preencha todos os campos.';
      return;
    }

    isSubmitting.value = true;

    // monta birthdate no formato YYYY-MM-DD
    const day = String(form.day).padStart(2, '0');
    const month = String(form.month).padStart(2, '0');
    const birthdate = `${form.year}-${month}-${day}`;

    try {
      await register({
        name: form.name,
        username: form.username,
        email: form.contact,
        password: form.password,
        birthdate,
      });
      router.push('/profile');
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        errorMessage.value = firstError;
      } else {
        errorMessage.value = 'Não foi possível criar a conta. Tente novamente.';
      }
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