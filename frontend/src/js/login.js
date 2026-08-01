import { reactive, ref } from 'vue'
//import api from '@/services/api' // ajusta pro caminho real do teu cliente HTTP

export default {
  name: 'Login',
  setup() {
    const form = reactive({
      identifier: '',
      password: ''
    })

    const errors = reactive({
      identifier: false,
      password: false
    })

    const showPassword = ref(false)
    const loading = ref(false)
    const serverError = ref('')

    function validate() {
      errors.identifier = !form.identifier.trim()
      errors.password = !form.password.trim()
      return !errors.identifier && !errors.password
    }

    async function handleLogin() {
      serverError.value = ''
      if (!validate()) return

      loading.value = true
      try {
        const res = await api.post('/login', {
          identifier: form.identifier,
          password: form.password
        })

        localStorage.setItem('token', res.data.token)
        this.$router.push('/profile')
      } catch (err) {
        serverError.value =
          err.response?.data?.message || 'Usuário ou senha inválidos.'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      showPassword,
      loading,
      serverError,
      handleLogin
    }
  }
}