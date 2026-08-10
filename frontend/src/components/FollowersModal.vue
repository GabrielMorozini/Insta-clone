<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <button class="close-btn" @click="close">✕</button>
            <span class="modal-username">{{ username }}</span>
            <button class="close-btn" @click="close">✕</button>
          </div>

          <!-- Tabs -->
          <div class="tabs">
            <button
              :class="['tab', { active: activeTab === 'followers' }]"
              @click="switchTab('followers')"
            >
              Seguidores
            </button>
            <button
              :class="['tab', { active: activeTab === 'following' }]"
              @click="switchTab('following')"
            >
              Seguindo
            </button>
          </div>

          <!-- Search -->
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar"
              class="search-input"
            />
          </div>

          <!-- List -->
          <div class="user-list" ref="listRef" @scroll="handleScroll">
            <!-- Loading inicial -->
            <div v-if="loading && users.length === 0" class="loading-state">
              <div class="spinner"></div>
            </div>

            <!-- Erro -->
            <div v-else-if="fetchError" class="empty-state" style="color: #ff6b6b;">
              <p>Erro ao carregar.</p>
              <button class="follow-btn" @click="fetchUsers" style="margin-top: 8px;">
                Tentar novamente
              </button>
            </div>

            <!-- Vazio -->
            <div v-else-if="users.length === 0 && !loading" class="empty-state">
              {{ activeTab === 'followers' ? 'Nenhum seguidor ainda' : 'Você não segue ninguém ainda' }}
            </div>

            <!-- Usuários -->
            <div
              v-for="userItem in filteredUsers"
              :key="userItem.id"
              class="user-item"
            >
              <img
                v-if="userItem.avatar"
                :src="userItem.avatar"
                :alt="userItem.username"
                class="user-avatar"
              />
              <div v-else class="user-avatar-placeholder">
                {{ userItem.username?.charAt(0).toUpperCase() || '?' }}
              </div>

              <div class="user-info">
                <div class="user-name">{{ userItem.username }}</div>
                <div class="user-fullname">{{ userItem.full_name || '' }}</div>
              </div>

              <button
                v-if="isOwnProfile && userItem.id !== currentUserId"
                :class="['follow-btn', { following: userItem.is_following }]"
                @click="toggleFollow(userItem)"
                :disabled="userItem._loading"
              >
                {{ userItem.is_following ? 'Seguindo' : 'Seguir' }}
              </button>
            </div>

            <!-- Loading mais -->
            <div v-if="loading && users.length > 0" class="loading-more">
              <div class="spinner small"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({
  modelValue: Boolean,
  userId: { type: Number, default: null },
  username: { type: String, default: '' },
  isOwnProfile: { type: Boolean, default: true },
  initialTab: { type: String, default: 'followers' }
})

const emit = defineEmits(['update:modelValue', 'follow-change'])

const activeTab = ref(props.initialTab)
const searchQuery = ref('')
const users = ref([])
const loading = ref(false)
const fetchError = ref(false)
const page = ref(1)
const hasMore = ref(true)
const listRef = ref(null)
const currentUserId = ref(null)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u =>
    u.username?.toLowerCase().includes(q) ||
    u.full_name?.toLowerCase().includes(q)
  )
})

watch(() => props.modelValue, (open) => {
  if (open) {
    console.log('[FollowersModal] Abrindo modal. userId:', props.userId, 'tab:', props.initialTab)
    activeTab.value = props.initialTab
    users.value = []
    page.value = 1
    hasMore.value = true
    searchQuery.value = ''
    fetchError.value = false
    fetchCurrentUser()
    fetchUsers()
  }
})

watch(activeTab, () => {
  users.value = []
  page.value = 1
  hasMore.value = true
  searchQuery.value = ''
  fetchError.value = false
  fetchUsers()
})

async function fetchCurrentUser() {
  try {
    const { data } = await api.get('/auth/me')
    currentUserId.value = data.id
  } catch (e) {
    console.error('[FollowersModal] Erro ao buscar usuário atual:', e)
  }
}

async function fetchUsers() {
  if (loading.value || !hasMore.value) return
  if (!props.userId) {
    console.warn('[FollowersModal] userId está null, não posso buscar.')
    return
  }

  loading.value = true
  fetchError.value = false

  try {
    const endpoint = activeTab.value === 'followers'
      ? `/users/${props.userId}/followers`
      : `/users/${props.userId}/following`

    console.log('[FollowersModal] Buscando:', endpoint, 'página:', page.value)

    const response = await api.get(endpoint, {
      params: {
        page: page.value,
        per_page: 20,
        search: searchQuery.value || undefined
      }
    })

    console.log('[FollowersModal] Resposta bruta:', response)
    console.log('[FollowersModal] response.data:', response.data)

    // Laravel paginado: { data: [...], current_page, ... }
    // Ou array direto: [...]
    // Ou seu interceptor pode já ter desembrulhado
    let rawUsers = []

    if (Array.isArray(response.data)) {
      rawUsers = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      rawUsers = response.data.data
    } else if (response.data && typeof response.data === 'object') {
      // Tenta encontrar um array em qualquer propriedade
      const arr = Object.values(response.data).find(v => Array.isArray(v))
      if (arr) rawUsers = arr
    }

    console.log('[FollowersModal] Usuários extraídos:', rawUsers.length, rawUsers)

    const newUsers = rawUsers.map(u => ({
      id: u.id,
      username: u.username,
      full_name: u.full_name || u.name || '',
      avatar: u.avatar || u.avatar_url || null,
      is_following: u.is_following ?? false,
      _loading: false
    }))

    users.value.push(...newUsers)
    hasMore.value = rawUsers.length === 20
    page.value++

  } catch (err) {
    console.error('[FollowersModal] Erro na requisição:', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
}

function handleScroll() {
  const el = listRef.value
  if (!el) return
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
  if (nearBottom) fetchUsers()
}

async function toggleFollow(userItem) {
  userItem._loading = true
  const wasFollowing = userItem.is_following

  try {
    if (wasFollowing) {
      await api.delete(`/users/${userItem.id}/follow`)
      userItem.is_following = false
    } else {
      await api.post(`/users/${userItem.id}/follow`)
      userItem.is_following = true
    }
    emit('follow-change', {
      userId: userItem.id,
      following: userItem.is_following
    })
  } catch (err) {
    console.error('[FollowersModal] Erro ao seguir:', err)
    userItem.is_following = wasFollowing
  } finally {
    userItem._loading = false
  }
}

function switchTab(tab) {
  activeTab.value = tab
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  width: 100%;
  max-width: 500px;
  height: 70vh;
  background: #1a1a1a;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(100%);
}

.modal-header {
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}
.modal-username {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #333;
}
.tab {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  color: #888;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.tab.active {
  color: #fff;
  border-bottom-color: #fff;
}

.search-box {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1a1a1a;
}
.search-icon {
  color: #888;
  font-size: 14px;
}
.search-input {
  flex: 1;
  background: #2a2a2a;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  font-size: 14px;
  outline: none;
}
.search-input::placeholder {
  color: #666;
}

.user-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}
.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #222;
}
.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: #2a2a2a;
  flex-shrink: 0;
}
.user-avatar-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}
.user-info {
  flex: 1;
  min-width: 0;
}
.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #fff;
}
.user-fullname {
  color: #888;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  background: #0095f6;
  color: #fff;
  transition: all 0.2s;
  white-space: nowrap;
}
.follow-btn.following {
  background: #333;
  color: #fff;
}
.follow-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state,
.loading-more {
  display: flex;
  justify-content: center;
  padding: 40px;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #333;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #888;
  font-size: 14px;
}

.user-list::-webkit-scrollbar {
  width: 6px;
}
.user-list::-webkit-scrollbar-track {
  background: transparent;
}
.user-list::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}
</style>