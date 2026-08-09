<template>
  <div class="profile-layout">
    <Navbar />

    <div class="profile-page">
      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <!-- Erro -->
      <div v-else-if="error" class="error-state">
        <p>Não foi possível carregar o perfil.</p>
        <button class="btn" @click="fetchProfile">Tentar novamente</button>
      </div>

      <template v-else>
        <!-- Header -->
        <header class="profile-header">
          <button class="icon-btn" @click="$router.back()">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path fill="currentColor" d="M15.5 19a1 1 0 0 1-.7-.29l-7-7a1 1 0 0 1 0-1.42l7-7a1 1 0 1 1 1.4 1.42L9.91 11l6.29 6.29A1 1 0 0 1 15.5 19z"/>
            </svg>
          </button>
          <div class="username">
            {{ user.username }}
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
        </header>

        <!-- Info -->
        <section class="profile-info">
          <img v-if="user.avatar" class="avatar" :src="user.avatar" :alt="user.username" />
          <div v-else class="avatar-placeholder">
            {{ user.username?.charAt(0).toUpperCase() || '?' }}
          </div>

          <div class="stats">
            <div class="stat">
              <strong>{{ formatNumber(user.postsCount) }}</strong>
              <span>posts</span>
            </div>
            <div class="stat">
              <strong>{{ formatNumber(user.followers) }}</strong>
              <span>seguidores</span>
            </div>
            <div class="stat">
              <strong>{{ formatNumber(user.following) }}</strong>
              <span>seguindo</span>
            </div>
          </div>
        </section>

        <div class="bio-block">
          <strong class="fullname">{{ user.fullName }}</strong>
          <p class="bio">{{ user.bio }}</p>
          <a v-if="user.website" class="website" :href="user.website" target="_blank">
            {{ user.website.replace(/^https?:\/\//, '') }}
          </a>
        </div>

        <!-- Ações -->
        <div class="action-buttons">
          <button v-if="isOwnProfile" class="btn" @click="$router.push('/settings/profile')">
            Editar perfil
          </button>
          <button
            v-else
            class="btn"
            :class="{ following: isFollowing }"
            @click="toggleFollow"
          >
            {{ isFollowing ? 'Seguindo' : 'Seguir' }}
          </button>
          <button class="btn icon-only">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1z"/>
            </svg>
          </button>
        </div>

        

        <!-- Criar Post (só no próprio perfil, aba posts) -->
        <CreatePost
          v-if="isOwnProfile && activeTab === 'posts'"
          @post-created="onPostCreated"
        />

        <!-- CONTEÚDO DAS TABS -->

        <!-- Tab: Posts -->
        <template v-if="activeTab === 'posts'">
          <!-- Grid de posts (estilo Instagram) -->
          <div class="posts-grid" v-if="posts.length">
            <div
              class="post-thumb"
              v-for="post in posts"
              :key="post.id"
              @click="openPost(post)"
            >
              <!-- Post com imagem -->
              <img
                v-if="post.image"
                :src="post.image"
                :alt="`post ${post.id}`"
                loading="lazy"
              />
              <!-- Post só texto (quando não tem imagem) -->
              <div v-else class="text-only-post">
                <p>{{ post.content }}</p>
              </div>

              <div class="post-overlay">
                <div class="overlay-stats">
                  <span v-if="post.likesCount">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {{ formatNumber(post.likesCount) }}
                  </span>
                  <span v-if="post.commentsCount">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
                    </svg>
                    {{ formatNumber(post.commentsCount) }}
                  </span>
                </div>
                <svg
                  v-if="post.isMultiple"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  class="multi-icon"
                >
                  <path fill="currentColor" d="M4 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Load more -->
          <div v-if="pagination.next_page_url" class="load-more-wrapper">
            <button
              class="btn load-more-btn"
              @click="loadMorePosts"
              :disabled="loadingPosts"
            >
              {{ loadingPosts ? 'Carregando...' : 'Carregar mais' }}
            </button>
          </div>

          <div class="empty-state" v-if="!posts.length && !loadingPosts">
            <p>Nada por aqui ainda.</p>
            <span v-if="isOwnProfile">Compartilhe sua primeira foto!</span>
          </div>
        </template>

        <!-- Tab: Reels -->
        <div class="empty-state" v-else-if="activeTab === 'reels'">
          <p>Em breve.</p>
        </div>

        <!-- Tab: Tagged -->
        <div class="empty-state" v-else-if="activeTab === 'tagged'">
          <p>Fotos em que aparece.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import Navbar from '@/components/Sidebar.vue'
import CreatePost from '@/components/CreatePost.vue'

const route = useRoute()
const apiBaseUrl = import.meta.env.VITE_API_URL

const loading = ref(true)
const error = ref(false)
const loadingPosts = ref(false)

const user = reactive({
  id: null,
  username: '',
  fullName: '',
  avatar: '',
  bio: '',
  website: '',
  postsCount: 0,
  followers: 0,
  following: 0,
})

const currentUserId = ref(null)
const isFollowing = ref(false)
const activeTab = ref('posts')
const highlights = ref([])
const posts = ref([])

// Paginação dos posts
const pagination = ref({
  current_page: 1,
  next_page_url: null,
})

const isOwnProfile = computed(() => {
  return currentUserId.value !== null && currentUserId.value === user.id
})

const tabs = [
  { name: 'posts', icon: 'M4 4h16v16H4V4zm2 2v12h12V6H6z' },
  { name: 'reels', icon: 'M4 4h16v16H4V4zm5 3v10l8-5-8-5z' },
  { name: 'tagged', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
]

async function fetchProfile() {
  loading.value = true
  error.value = false

  try {
    const usernameParam = route.params.username

    const meRes = await api.get('/auth/me')
    currentUserId.value = meRes.data.id

    let data
    if (usernameParam) {
      const userRes = await api.get(`/users/${usernameParam}`)
      data = userRes.data
    } else {
      data = meRes.data
    }

    Object.assign(user, {
      id: data.id,
      username: data.username,
      fullName: data.name,
      avatar: data.avatar_url,
      bio: data.bio,
      website: data.website ?? '',
      postsCount: data.posts_count ?? 0,
      followers: data.followers_count ?? 0,
      following: data.following_count ?? 0,
    })

    isFollowing.value = data.is_following ?? false
    highlights.value = data.highlights ?? []

    // Busca posts do usuário (primeira página)
    await fetchPosts(1, true)

  } catch (err) {
    console.error('Erro ao carregar perfil:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Busca posts paginados
async function fetchPosts(page = 1, reset = false) {
  if (!user.id) return

  loadingPosts.value = true

  try {
    const { data } = await api.get(`/users/${user.id}/posts`, {
      params: { page }
    })

    // 'data' já é o array de posts (o interceptor desembrulha response.data.data)
    const postsData = Array.isArray(data) ? data : (data.data ?? [])
    const mapped = postsData.map((p) => ({
      id: p.id,
      content: p.caption,
      image: p.image_url ? `${apiBaseUrl}${p.image_url}` : null,
      isMultiple: p.media_count > 1 || false,
      likesCount: p.likes_count ?? 0,
      commentsCount: p.comments_count ?? 0,
      createdAt: p.created_at,
    }))

    if (reset) {
      posts.value = mapped
    } else {
      posts.value.push(...mapped)
    }

    pagination.value = {
      current_page: page,
      next_page_url: null,
    }

  } catch (err) {
    console.error('Erro ao carregar posts:', err)
  } finally {
    loadingPosts.value = false
  }
}

function loadMorePosts() {
  if (!pagination.value.next_page_url) return
  fetchPosts(pagination.value.current_page + 1, false)
}

// Quando cria um post novo, recarrega do início
function onPostCreated() {
  fetchPosts(1, true)
  user.postsCount++
}

function openPost(post) {
  console.log('Abrir post:', post.id)
}

async function toggleFollow() {
  const previous = isFollowing.value
  isFollowing.value = !isFollowing.value
  user.followers += isFollowing.value ? 1 : -1

  try {
    if (isFollowing.value) {
      await api.post(`/users/${user.id}/follow`)
    } else {
      await api.delete(`/users/${user.id}/follow`)
    }
  } catch (err) {
    isFollowing.value = previous
    user.followers += previous ? 1 : -1
    console.error(err)
  }
}

function formatNumber(n) {
  if (!n) return '0'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k'
  return n.toString()
}

onMounted(fetchProfile)
</script>

<style scoped src="./css/profile.css"></style>