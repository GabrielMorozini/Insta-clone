<template>
  <nav class="sidebar">
    <div class="sidebar-top">
      <router-link to="/feed" class="sidebar-icon" title="Início">
        <svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>
      </router-link>
      <router-link to="/search" class="sidebar-icon" title="Buscar">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      </router-link>
      <router-link to="/posts/new" class="sidebar-icon" title="Criar">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>
      </router-link>
      <router-link to="/profile" class="sidebar-icon" title="Perfil">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"/></svg>
      </router-link>
    </div>
    <button class="sidebar-icon sidebar-logout" title="Sair" @click="handleLogout">
      <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
    </button>
  </nav>