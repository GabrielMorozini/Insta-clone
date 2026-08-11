<template>
  <aside class="guild-nav">
    <div class="guild-nav-logo">
      <img src="/icon-main.png" alt="Guildfy Logo" />
      <span>Guildfy</span>
    </div>

    <nav class="guild-nav-links">
      <RouterLink to="/feed" class="nav-item" active-class="is-active">
        <img src="/icon-home.png" alt="Home" class="nav-icon" />
        <span>Home</span>
      </RouterLink>

      <button class="nav-item nav-item--btn" @click="handleCreatePost">
        <img src="/icon-add.png" alt="Nova Postagem" class="nav-icon" />
        <span>Nova Postagem</span>
      </button>

      <RouterLink
        :to="`/profile/${currentUser?.username}`"
        class="nav-item"
        active-class="is-active"
      >
        <img src="/icon-profile.png" alt="Meu Perfil" class="nav-icon" />
        <span>Meu Perfil</span>
      </RouterLink>
    </nav>

    <button class="nav-item nav-item--logout" @click="handleLogout">
      <img src="/icon-main.png" alt="Deixar a Taverna" class="nav-icon" />
      <span>Deixar a Taverna</span>
    </button>
  </aside>

  <!-- Modal de criação de post -->
  <CreatePostModal
    v-model="showModal"
    :user-name="currentUser?.name || currentUser?.username || ''"
    :user-avatar="currentUser?.avatar_url || currentUser?.avatar || ''"
    @post-created="onPostCreated"
  />
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useFeed } from '../js/feed.js';
import CreatePostModal from './CreatePost.vue';

const router = useRouter();
const showModal = ref(false);

const {
  currentUser,
  posts,
  crests,
  suggestions,
  isLoading,
  commentDrafts,
  setCommentRef,
  toggleLike,
  toggleFollow,
  submitComment,
  focusComment,
  handleAddCrest,
  handleOpenCrest,
  refreshSuggestions,
} = useFeed();

function handleCreatePost() {
  showModal.value = true;
}

function onPostCreated(newPost) {
  // Dispara evento global para o Feed/Profile atualizarem
  window.dispatchEvent(new CustomEvent('new-post-created', { detail: newPost }));
  
  // Se estiver na página de feed, pode inserir direto
  if (Array.isArray(posts.value)) {
    posts.value.unshift(newPost);
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  router.push('/login');
}
</script>

<style scoped src="../css/sidebar.css"></style>