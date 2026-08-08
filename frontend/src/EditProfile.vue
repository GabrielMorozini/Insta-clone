<template>
  <div class="edit-layout">
    <SideBar />

    <div class="edit-page">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <template v-else>
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
          <p v-if="successMessage" class="feedback success">{{ successMessage }}</p>
          <p v-if="errorMessage" class="feedback error">{{ errorMessage }}</p>

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
import SideBar from './Sidebar.vue'

import {
  loading,
  saving,
  uploadingAvatar,
  successMessage,
  errorMessage,
  avatarPreview,
  joinedAt,
  fileInput,
  form,
  initials,
  handleSave,
  handleAvatarChange
} from './js/editProfile.js'
</script>

<style scoped src="./css/editProfile.css"></style>