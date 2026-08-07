<template>
  <div class="profile-layout">
    <Sidebar />
    
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
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M15.5 19a1 1 0 0 1-.7-.29l-7-7a1 1 0 0 1 0-1.42l7-7a1 1 0 1 1 1.4 1.42L9.91 11l6.29 6.29A1 1 0 0 1 15.5 19z"/></svg>
        </button>
        <div class="username">
          {{ user.username }}
          <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
        </div>
        <button class="icon-btn">
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>
        </button>
      </header>

      <!-- Info -->
      <section class="profile-info">
        <img class="avatar" :src="user.avatar" :alt="user.username" />

        <div class="stats">
          <div class="stat">
            <strong>{{ user.postsCount }}</strong>
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
        <button
          class="btn"
          :class="{ following: isFollowing }"
          @click="toggleFollow"
        >
          {{ isFollowing ? 'Seguindo' : 'Seguir' }}
        </button>
        <button class="btn secondary">Mensagem</button>
        <button class="btn icon-only">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1z"/></svg>
        </button>
      </div>

      <!-- Destaques -->
      <div class="highlights" v-if="highlights.length">
        <div class="highlight" v-for="h in highlights" :key="h.id">
          <div class="highlight-circle">
            <img :src="h.cover" :alt="h.title" />
          </div>
          <span>{{ h.title }}</span>
        </div>
      </div>

      <!-- Tabs -->
      <nav class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          class="tab"
          :class="{ active: activeTab === tab.name }"
          @click="activeTab = tab.name"
        >
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" :d="tab.icon" /></svg>
        </button>
      </nav>

      <!-- Grid de posts -->
      <div class="posts-grid" v-if="activeTab === 'posts' && posts.length">
        <div class="post-thumb" v-for="post in posts" :key="post.id">
          <img :src="post.image" :alt="`post ${post.id}`" loading="lazy" />
          <div class="post-overlay" v-if="post.isMultiple">
            <svg viewBox="0 0 24 24" width="16" height="16" class="multi-icon">
              <path fill="currentColor" d="M4 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <p>Nada por aqui ainda.</p>
      </div>
    </template>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const loading = ref(true)
const error = ref(false)

const user = reactive({
  username: '',
  fullName: '',
  avatar: '',
  bio: '',
  website: '',
  postsCount: 0,
  followers: 0,
  following: 0,
})

const isFollowing = ref(false)
const activeTab = ref('posts')
const highlights = ref([])
const posts = ref([])

const tabs = [
  { name: 'posts', icon: 'M4 4h16v16H4V4zm2 2v12h12V6H6z' },
  { name: 'reels', icon: 'M4 4h16v16H4V4zm5 3v10l8-5-8-5z' },
  { name: 'tagged', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
]

async function fetchProfile() {
  loading.value = true
  error.value = false

  try {
    // Fallback para o ID 1 se a rota estiver vazia
    const userId = route.params.id || 1

    // 1. Busca dados do usuário
    const userRes = await axios.get(`/api/users/${userId}`)
    const data = userRes.data

    Object.assign(user, {
      username: data.username,
      fullName: data.name,
      avatar: data.avatar_url,
      bio: data.bio,
      website: data.website,
      postsCount: data.posts_count,
      followers: data.followers_count,
      following: data.following_count,
    })

    isFollowing.value = data.is_following

    // 2. Busca os posts de forma segura
    const postsRes = await axios.get(`/api/users/${userId}/posts`)
    const postsData = postsRes.data
    
    // Tratamento para garantir que postsData seja uma lista válida
    let postsList = []
    if (Array.isArray(postsData)) {
      postsList = postsData
    } else if (postsData && Array.isArray(postsData.posts)) {
      postsList = postsData.posts
    }

    posts.value = postsList.map((p) => {
      return {
        id: p.id,
        image: p.image_url,
        isMultiple: p.media_count > 1
      }
    })

    highlights.value = data.highlights ?? []
  } catch (err) {
    console.error("Erro detalhado na requisição:")
    console.dir(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

async function toggleFollow() {
  const previous = isFollowing.value
  isFollowing.value = !isFollowing.value
  user.followers += isFollowing.value ? 1 : -1

  try {
    const userId = route.params.id || 1
    if (isFollowing.value) {
      await axios.post(`/api/users/${userId}/follow`)
    } else {
      await axios.delete(`/api/users/${userId}/follow`)
    }
  } catch (err) {
    isFollowing.value = previous
    user.followers += previous ? 1 : -1
    console.error(err)
  }
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k'
  return n
}

onMounted(fetchProfile)
</script>


<style scoped src="./css/profile.css"></style>