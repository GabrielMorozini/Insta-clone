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
import { ref, watch } from 'vue';
import { postService } from '../services/postService.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  postId: { type: [String, Number], default: null },
  isOwner: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'updated', 'deleted']);

const apiBaseUrl = import.meta.env.VITE_API_URL;

const post = ref(null);
const loading = ref(false);
const editing = ref(false);
const editCaption = ref('');
const saving = ref(false);
const editError = ref('');

const fetchPost = async () => {
  if (!props.postId) return;
  loading.value = true;
  post.value = null;
  try {
    const response = await postService.getPost(props.postId);
    post.value = response.data ?? response;
  } catch (err) {
    console.error('Erro ao carregar post:', err);
  } finally {
    loading.value = false;
  }
};

watch(
  () => [props.modelValue, props.postId],
  ([open]) => {
    editing.value = false;
    editError.value = '';
    if (open) fetchPost();
  }
);

const close = () => emit('update:modelValue', false);

const startEdit = () => {
  editCaption.value = post.value.caption;
  editing.value = true;
  editError.value = '';
};

const cancelEdit = () => {
  editing.value = false;
};

const saveEdit = async () => {
  saving.value = true;
  editError.value = '';
  try {
    const response = await postService.updatePost(props.postId, {
      caption: editCaption.value,
    });
    const updated = response.data ?? response;
    post.value = updated;
    editing.value = false;
    emit('updated', updated);
  } catch (err) {
    console.error('Erro ao editar post:', err);
    editError.value = 'Não foi possível salvar. Tente novamente.';
  } finally {
    saving.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('Tem certeza que deseja apagar este post?')) return;
  try {
    await postService.deletePost(props.postId);
    emit('deleted', props.postId);
    close();
  } catch (err) {
    console.error('Erro ao apagar post:', err);
    alert('Não foi possível apagar o post.');
  }
};
</script>

<style scoped>
.post-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.post-modal {
  background: #1a1a1a;
  color: #f0f0f0;
  border-radius: 12px;
  max-width: 900px;
  width: 90%;
  max-height: 85vh;
  display: flex;
  overflow: hidden;
  position: relative;
  border: 1px solid #2f2f2f;
}

.post-modal-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  z-index: 2;
}

.post-modal-close:hover {
  background: rgba(255, 255, 255, 0.25);
}

.post-modal-body {
  display: flex;
  width: 100%;
}

.post-modal-image-wrap {
  flex: 1.2;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.post-modal-image-wrap img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
}

.post-modal-details {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 280px;
  background: #1a1a1a;
}

.post-modal-header strong {
  color: #f0f0f0;
}

.post-modal-caption p {
  color: #d0d0d0;
}

.post-modal-owner-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
  background: #2a2a2a;
  color: #f0f0f0;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn:hover {
  background: #333;
}

.btn-danger {
  color: #f2597f;
  border-color: #f2597f;
  background: transparent;
}

.btn-danger:hover {
  background: rgba(242, 89, 127, 0.1);
}

.post-modal-textarea {
  width: 100%;
  background: #262626;
  color: #f0f0f0;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  padding: 8px;
  font-size: 0.9rem;
}

.post-modal-meta {
  color: #9a9a9a;
  font-size: 0.85rem;
}

.post-modal-error {
  color: #f2597f;
  font-size: 0.8rem;
}

.post-modal-loading,
.post-modal-error-state {
  padding: 60px;
  text-align: center;
  color: #d0d0d0;
}
</style>