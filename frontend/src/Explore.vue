<template>
  <aside class="sidebar">
    <!-- Topo da Sidebar: Logo -->
    <div class="sidebar-top">
      <RouterLink to="/feed" class="sidebar-logo" title="Guildfy">
        <img src="/icon-main.png" alt="Guildfy Logo" />
        <span class="logo-text">Guildfy</span>
      </RouterLink>
    </div>

    <!-- Links de Navegação Principal -->
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

    <!-- Rodapé da Sidebar: Botão de Sair -->
    <div class="sidebar-bottom">
      <button class="nav-item nav-item--logout" @click="handleLogout">
        <img src="/icon-main.png" alt="Deixar a Taverna" class="nav-icon" />
        <span>Deixar a Taverna</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import './js/explore.js'
</script>
<style scoped src="./css/explore.css"></style>