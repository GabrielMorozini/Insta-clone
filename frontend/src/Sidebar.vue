<template>
  <nav class="sidebar">
    <div class="sidebar-top">
      <!-- Logo -->
      <router-link to="/feed" class="sidebar-logo" title="Guildfy">
        <img src="/icon-main.png" alt="Guildfy" />
        <span class="sidebar-brand">Guildfy</span>
      </router-link>

      <!-- Home -->
      <router-link to="/feed" class="sidebar-icon" active-class="is-active" title="Início">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span class="sidebar-label">Início</span>
      </router-link>

      <!-- Explorar -->
      <router-link to="/explore" class="sidebar-icon" active-class="is-active" title="Explorar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span class="sidebar-label">Explorar</span>
      </router-link>

      <!-- Notificações -->
      <router-link to="/notifications" class="sidebar-icon" active-class="is-active" title="Notificações">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="sidebar-label">Notificações</span>
      </router-link>

      <!-- Criar Post -->
      <button class="sidebar-icon sidebar-btn" title="Criar" @click="showModal = true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span class="sidebar-label">Criar</span>
      </button>

      <!-- Perfil -->
      <router-link :to="profileLink" class="sidebar-icon" active-class="is-active" title="Perfil">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="sidebar-label">Perfil</span>
      </router-link>
    </div>

    <!-- Logout -->
    <button class="sidebar-icon sidebar-logout" title="Sair" @click="handleLogout">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      <span class="sidebar-label">Sair</span>
    </button>
  </nav>

  <!-- Modal de criação -->
  <CreatePost
    v-model="showModal"
    :user-name="currentUser?.name || currentUser?.username || ''"
    :user-avatar="currentUser?.avatar_url || currentUser?.avatar || ''"
    @post-created="onPostCreated"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import CreatePost from 'components/CreatePost.vue';

const router = useRouter();
const showModal = ref(false);

const currentUser = computed(() => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
});

const profileLink = computed(() => {
  return currentUser.value?.username ? `/profile/${currentUser.value.username}` : '/profile';
});

function onPostCreated() {
  window.dispatchEvent(new CustomEvent('refresh-feed'));
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 244px;
  height: 100vh;
  border-right: 1px solid #262626;
  background-color: #0a0a0a;
  display: flex;
  flex-direction: column;
  padding: 8px 12px 20px 12px;
  z-index: 100;
}

.sidebar-top {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 25px 12px 16px 12px;
  margin-bottom: 19px;
  text-decoration: none;
}

.sidebar-logo img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.sidebar-brand {
  color: #f5f5f5;
  font-size: 22px;
  font-weight: 700;
  font-family: 'Cinzel', serif;
  letter-spacing: 1px;
}

.sidebar-icon {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  color: #f5f5f5;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.sidebar-icon:hover {
  background-color: #1a1a1a;
}

.sidebar-icon.is-active {
  font-weight: 600;
}

.sidebar-icon svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.sidebar-label {
  font-size: 16px;
}

.sidebar-logout {
  margin-top: auto;
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    width: 100%;
    height: auto;
    border-right: none;
    border-top: 1px solid #262626;
    flex-direction: row;
    justify-content: space-around;
    padding: 8px 0;
  }

  .sidebar-top {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    gap: 0;
  }

  .sidebar-logo,
  .sidebar-brand,
  .sidebar-label {
    display: none;
  }

  .sidebar-icon {
    padding: 8px;
    width: auto;
  }

  .sidebar-logout {
    display: none;
  }
}
</style>