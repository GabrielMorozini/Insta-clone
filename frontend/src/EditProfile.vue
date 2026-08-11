<template>
  <div class="edit-layout">
    <Navbar />

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

          <section class="danger-zone">
            <h2 class="danger-title">Zona Sombria</h2>
            <p class="danger-text">
              Deletar sua conta é permanente. Todos os seus posts, curtidas, comentários
              e conexões no reino serão apagados para sempre.
            </p>
            <button class="danger-btn" @click="openDeleteModal">
              Deletar Minha Conta
            </button>
          </section>
        </div>
      </template>
    </div>

    <!-- Modal de confirmação de deletar conta -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-box">
        <h2 class="modal-title">⚔️ Deixar a Guilda para sempre?</h2>
        <p class="modal-text">
          Esta ação é <strong>irreversível</strong>. Todos os seus posts, curtidas,
          comentários e conexões serão apagados permanentemente do reino.
        </p>

        <label class="modal-label" for="confirm-password">Digite sua senha para confirmar</label>
        <input
          id="confirm-password"
          v-model="deletePassword"
          type="password"
          class="modal-input"
          placeholder="Sua senha"
          :disabled="isDeletingAccount"
          @keyup.enter="confirmDeleteAccount"
        />

        <p v-if="deleteError" class="modal-error">{{ deleteError }}</p>

        <div class="modal-actions">
          <button class="btn-cancel" :disabled="isDeletingAccount" @click="closeDeleteModal">
            Cancelar
          </button>
          <button class="btn-danger" :disabled="isDeletingAccount" @click="confirmDeleteAccount">
            {{ isDeletingAccount ? 'Deletando...' : 'Deletar minha conta' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from '@/components/Sidebar.vue'
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
  handleAvatarChange,
  fetchUserData
} from '@/js/editProfile.js'
import {
  showDeleteModal,
  deletePassword,
  isDeletingAccount,
  deleteError,
  openDeleteModal,
  closeDeleteModal,
  confirmDeleteAccount
} from '@/js/deleteAccount.js'

onMounted(fetchUserData)
</script>

<style scoped src="@/css/editProfile.css"></style>
<style scoped src="@/css/deleteAccount.css"></style>