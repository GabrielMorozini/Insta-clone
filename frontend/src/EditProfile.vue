<template>
  <div class="edit-layout">
    <SideBar />

    <div class="edit-page">
      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <template v-else>
        <!-- Header -->
        <header class="edit-header">
          <button class="icon-btn" @click="$router.back()" title="Voltar">
            <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M15.5 19a1 1 0 0 1-.7-.29l-7-7a1 1 0 0 1 0-1.42l7-7a1 1 0 1 1 1.4 1.42L9.91 11l6.29 6.29A1 1 0 0 1 15.5 19z"/></svg>
          </button>
          <h1 class="edit-title">Editar Perfil</h1>
          <button class="save-btn" :disabled="saving" @click="handleSave">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </header>

        <div class="edit-content">
          <!-- Mensagens -->
          <p v-if="successMessage" class="feedback success">{{ successMessage }}</p>
          <p v-if="errorMessage" class="feedback error">{{ errorMessage }}</p>

          <!-- Avatar -->
          <section class="avatar-section">
            <div class="avatar-frame">
              <img
                v-if="avatarPreview"
                :src="avatarPreview"
                alt="Foto de perfil"
                class="avatar-img"
              />
              <div v-else class="avatar-placeholder">
                {{ initials }}
              </div>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/gif"
              class="hidden-input"
              @change="handleAvatarChange"
            />

            <button class="change-photo-btn" :disabled="uploadingAvatar" @click="fileInput.click()">
              {{ uploadingAvatar ? 'Enviando o brasão...' : 'Alterar Brasão' }}
            </button>
          </section>

          <!-- Formulário -->
          <section class="form-section">
            <div class="field">
              <label for="name">Nome Completo</label>
              <input id="name" v-model="form.name" type="text" placeholder="Seu nome" />
            </div>

            <div class="field">
              <label for="username">Nome de Usuário</label>
              <input id="username" v-model="form.username" type="text" placeholder="seu_usuario" />
            </div>

            <div class="field">
              <label for="email">Email</label>
              <input id="email" v-model="form.email" type="email" placeholder="seu@email.com" />
            </div>

            <div class="field">
              <label for="bio">Sobre Você</label>
              <textarea
                id="bio"
                v-model="form.bio"
                maxlength="500"
                rows="4"
                placeholder="Conte sua história..."
              ></textarea>
              <span class="char-count">{{ (form.bio || '').length }}/500</span>
            </div>

            <div class="field">
              <label for="password">Nova Senha</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Deixe em branco para manter a atual"
                minlength="8"
              />
            </div>
          </section>

          <!-- Info somente leitura -->
          <section class="readonly-section">
            <div class="readonly-row">
              <span class="readonly-label">Membro do reino desde</span>
              <span class="readonly-value">{{ joinedAt || '—' }}</span>
            </div>
          </section>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import SideBar from '@/Sidebar.vue'

const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const uploadingAvatar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const fileInput = ref(null)
const avatarPreview = ref('')
const joinedAt = ref('')

const form = reactive({
  name: '',
  username: '',
  email: '',
  bio: '',
  password: '',
})

const initials = computed(() => {
  return (form.name || form.username || '?').trim().charAt(0).toUpperCase()
})

async function fetchMe() {
  loading.value = true
  try {
    const res = await api.get('/auth/me')
    const data = res.data

    form.name = data.name ?? ''
    form.username = data.username ?? ''
    form.email = data.email ?? ''
    form.bio = data.bio ?? ''

    avatarPreview.value = data.avatar_url || ''
    joinedAt.value = data.joined_at || ''
  } catch (err) {
    console.error('Erro ao carregar perfil:', err)
    errorMessage.value = 'Não foi possível carregar seus dados.'
  } finally {
    loading.value = false
  }
}

async function handleAvatarChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  // Preview imediato antes de subir pro servidor
  avatarPreview.value = URL.createObjectURL(file)

  const formData = new FormData()
  formData.append('avatar', file)

  uploadingAvatar.value = true
  errorMessage.value = ''

  try {
    const res = await api.post('/users/me/avatar', formData)
    avatarPreview.value = res.data.avatar_url
    successMessage.value = 'Brasão atualizado!'
    setTimeout(() => (successMessage.value = ''), 2500)
  } catch (err) {
    console.error('Erro ao enviar avatar:', err)
    errorMessage.value = 'Não foi possível enviar a imagem. Tente um arquivo menor.'
  } finally {
    uploadingAvatar.value = false
  }
}

async function handleSave() {
  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  const payload = {
    name: form.name,
    username: form.username,
    email: form.email,
    bio: form.bio,
  }

  // Só manda senha se o usuário preencheu algo
  if (form.password && form.password.length > 0) {
    payload.password = form.password
  }

  try {
    await api.put('/users/me', payload)
    form.password = ''
    successMessage.value = 'Perfil atualizado com sucesso!'
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (err) {
    console.error('Erro ao salvar perfil:', err)
    if (err.response?.status === 422) {
      const errors = err.response.data?.errors
      const firstError = errors ? Object.values(errors)[0]?.[0] : null
      errorMessage.value = firstError || 'Confira os dados informados.'
    } else {
      errorMessage.value = 'Não foi possível salvar as alterações.'
    }
  } finally {
    saving.value = false
  }
}

onMounted(fetchMe)
</script>

<style scoped src="./css/editProfile.css"></style>