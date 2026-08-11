import { ref } from 'vue'
import api from '@/services/api'
import router from '@/router' // ajuste o caminho se seu router estiver em outro lugar

export const showDeleteModal = ref(false)
export const deletePassword = ref('')
export const isDeletingAccount = ref(false)
export const deleteError = ref('')

export function openDeleteModal() {
  deleteError.value = ''
  deletePassword.value = ''
  showDeleteModal.value = true
}

export function closeDeleteModal() {
  if (isDeletingAccount.value) return // não fecha durante a requisição
  showDeleteModal.value = false
}

export async function confirmDeleteAccount() {
  if (!deletePassword.value) {
    deleteError.value = 'Digite sua senha para confirmar.'
    return
  }

  isDeletingAccount.value = true
  deleteError.value = ''

  try {
    await api.delete('/users/me', {
      data: { password: deletePassword.value }
    })

    // Ajuste a chave conforme onde vocês guardam o token (localStorage/sessionStorage)
    localStorage.removeItem('token')

    router.push('/login')
  } catch (err) {
    console.error(err)
    const response = err.response?.data
    deleteError.value =
      response?.errors?.password?.[0] ||
      response?.message ||
      'Não foi possível deletar a conta. Tente novamente.'
  } finally {
    isDeletingAccount.value = false
  }
}