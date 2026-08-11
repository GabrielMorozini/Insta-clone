<template>
  <div v-if="modelValue" class="post-modal-overlay" @click.self="close">
    <div class="post-modal">
      <button class="post-modal-close" @click="close">✕</button>

      <div v-if="loading" class="post-modal-loading">Carregando...</div>

      <div v-else-if="post" class="post-modal-body">
        <div class="post-modal-image-wrap">
          <img v-if="post.image_url" :src="`${apiBaseUrl}${post.image_url}`" alt="post" />
        </div>

        <div class="post-modal-details">
          <header class="post-modal-header">
            <strong>{{ post.user?.username || post.user?.name }}</strong>
          </header>

          <div class="post-modal-caption">
            <template v-if="!editing">
              <p>{{ post.caption }}</p>
              <div v-if="isOwner" class="post-modal-owner-actions">
                <button class="btn" @click="startEdit">Editar</button>
                <button class="btn btn-danger" @click="handleDelete">Apagar</button>
              </div>
            </template>

            <template v-else>
              <textarea v-model="editCaption" rows="4" class="post-modal-textarea"></textarea>
              <div class="post-modal-owner-actions">
                <button class="btn" :disabled="saving" @click="saveEdit">
                  {{ saving ? 'Salvando...' : 'Salvar' }}
                </button>
                <button class="btn" @click="cancelEdit">Cancelar</button>
              </div>
              <p v-if="editError" class="post-modal-error">{{ editError }}</p>
            </template>
          </div>

          <p class="post-modal-meta">
            {{ post.likes_count ?? 0 }} curtidas · {{ post.comments_count ?? 0 }} comentários
          </p>
        </div>
      </div>

      <div v-else class="post-modal-error-state">
        Não foi possível carregar o post.
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePostModal } from '../js/postModal.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  postId: { type: [String, Number], default: null },
  isOwner: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'updated', 'deleted']);

const {
  apiBaseUrl,
  post,
  loading,
  editing,
  editCaption,
  saving,
  editError,
  close,
  startEdit,
  cancelEdit,
  saveEdit,
  handleDelete,
} = usePostModal(props, emit);
</script>

<style scoped src="./css/postModal.css"></style>