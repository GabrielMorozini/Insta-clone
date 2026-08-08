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

        <RouterLink to="/explore" class="nav-item" active-class="is-active">
          <img src="/icon-search.png" alt="Explorar" class="nav-icon" />
          <span>Explorar</span>
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
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useFeed } from '../js/feed.js';
const defaultAvatar ='/icon-profile.png';
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
</script>
<style scoped src="../css/sidebar.css"></style>