import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/services/api'

export const loading = ref(true)
export const saving = ref(false)
export const uploadingAvatar = ref(false)
export const successMessage = ref('')
export const errorMessage = ref('')
export const avatarPreview = ref('')
export const joinedAt = ref('')
export const fileInput = ref(null)

export const form = reactive({
  name: '',
  username: '',
  email: '',
  bio: '',
  password: ''
})

export const initials = computed(() => {
  if (!form.name) return '??'
  const names = form.name.trim().split(' ')
  if (names.length > 1) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
})

// Busca os dados do usuário logado ao montar o componente
async function fetchUserData() {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await api.get('/auth/me')
    form.name = data.name || ''
    form.username = data.username || ''
    form.email = data.email || ''
    form.bio = data.bio || ''
    form.password = ''
    avatarPreview.value = data.avatar_url || ''
    joinedAt.value = data.joined_at || ''
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Não foi possível carregar seus dados do reino.'
  } finally {
    loading.value = false
  }
}

// Salva as alterações no perfil
export const handleSave = async () => {
  if (saving.value) return

  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const payload = {
      name: form.name,
      username: form.username,
      email: form.email,
      bio: form.bio
    }
    if (form.password) payload.password = form.password

    await api.put('/users/me', payload)
    successMessage.value = 'Perfil atualizado com sucesso no reino!'
  } catch (err) {
    console.error(err)
    errorMessage.value = err.response?.data?.message || 'Erro ao salvar as alterações.'
  } finally {
    saving.value = false
  }
}

// Envia o avatar para o servidor
export const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploadingAvatar.value = true
  errorMessage.value = ''

  // Preview local imediato
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Envia para o backend
  try {
    const fd = new FormData()
    fd.append('avatar', file)

    const { data } = await api.post('/users/me/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    avatarPreview.value = data.avatar_url
    successMessage.value = 'Brasão atualizado no reino!'
  } catch (err) {
    console.error(err)
    errorMessage.value = err.response?.data?.message || 'Erro ao enviar brasão.'
  } finally {
    uploadingAvatar.value = false
  }
}

export { fetchUserData }