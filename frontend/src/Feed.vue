<template>
  <div class="feed-layout">
    <Sidebar />

    <main class="feed-main">
      <div v-if="isLoading" class="feed-state">Carregando…</div>

      <div v-else-if="errorMessage" class="feed-state">{{ errorMessage }}</div>

      <div v-else-if="posts.length === 0" class="feed-empty">
        <span class="feed-empty-icon">📸</span>
        <p>Ainda não há posts para exibir.</p>
        <router-link to="/posts/new" class="btn-primary">Criar o primeiro post</router-link>
      </div>

      <div v-else class="feed-posts">
        <article v-for="post in posts" :key="post.id" class="post-card">
          <header class="post-header">
            <span class="post-avatar" />
            <span class="post-username">{{ post.user?.username }}</span>
          </header>
          <img v-if="post.image_url" :src="post.image_url" :alt="post.caption" class="post-image" />
          <p class="post-caption">{{ post.caption }}</p>
        </article>
      </div>
    </main>

    <aside class="feed-aside">
      <div v-if="currentUser" class="aside-profile">
        <span class="aside-avatar" />
        <div>
          <strong>{{ currentUser.username }}</strong>
          <p>{{ currentUser.name }}</p>
        </div>
      </div>

      <div class="aside-suggestions">
        <div class="aside-suggestions-header">
          <span>Sugestões para você</span>
          <router-link to="/users/search">Ver tudo</router-link>
        </div>

        <div v-for="user in suggestions" :key="user.id" class="suggestion-row">
          <span class="aside-avatar small" />
          <div class="suggestion-info">
            <strong>{{ user.username }}</strong>
            <p>Sugerido para você</p>
          </div>
          <button class="suggestion-follow" @click="follow(user.id)">Seguir</button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router'
import { logout } from './services/auth.js'

const router = useRouter()

async function handleLogout() {
  try {
    await logout()
  } finally {
    router.push('/login')
  }
}
</script>

<style scoped src="./css/style.css"></style>
<style scoped src="./css/feed.css"></style>