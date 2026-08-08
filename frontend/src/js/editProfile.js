import { ref, reactive, computed } from 'vue'

export const loading = ref(false)
export const saving = ref(false)
export const uploadingAvatar = ref(false)
export const successMessage = ref('')
export const errorMessage = ref('')
export const avatarPreview = ref('')
export const joinedAt = ref('08/2026')

export const fileInput = ref(null)

export const form = reactive({
  name: '',
  username: '',
  email: '',
  bio: '',
  password: ''
})

// 2. Computed Properties
export const initials = computed(() => {
  if (!form.name) return '??'
  const names = form.name.trim().split(' ')
  if (names.length > 1) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
})

// 3. Funções / Métodos
export const handleSave = async () => {
  if (saving.value) return
  
  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    successMessage.value = 'Perfil atualizado com sucesso no reino!'
  } catch (error) {
    errorMessage.value = 'Erro ao salvar as alterações.'
  } finally {
    saving.value = false
  }
}

export const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploadingAvatar.value = true
  
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
    uploadingAvatar.value = false
  }
  reader.readAsDataURL(file)
}