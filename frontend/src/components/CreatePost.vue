<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h3>Criar publicação</h3>
            <button class="close-btn" @click="close">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.6 7.1 4.7a1 1 0 0 0-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9z"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <div class="user-info">
              <img v-if="userAvatar" :src="userAvatar" class="user-avatar" />
              <div v-else class="user-avatar-placeholder">
                {{ userName?.charAt(0).toUpperCase() || '?' }}
              </div>
              <span class="user-name">{{ userName }}</span>
            </div>

            <textarea
              v-model="content"
              placeholder="O que está acontecendo?"
              rows="4"
              maxlength="2000"
            />

            <!-- Preview da imagem -->
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" />
              <button class="remove-image" @click="removeImage">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.6 7.1 4.7a1 1 0 0 0-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9z"/>
                </svg>
              </button>
            </div>

            <!-- Contador de caracteres -->
            <div class="char-count" :class="{ warning: content.length > 1800 }">
              {{ content.length }}/2000
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <div class="actions-left">
              <label class="attach-btn" title="Adicionar foto">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImage"
                  hidden
                />
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14zM7 11l3-3 4 4 3-3 2 2v4H7v-2z"/>
                </svg>
              </label>
            </div>

            <button
              class="publish-btn"
              :disabled="!canPublish || publishing"
              @click="publish"
            >
              <span v-if="publishing">Publicando...</span>
              <span v-else>Publicar</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '@/services/api.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  userName: { type: String, default: '' },
  userAvatar: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'post-created'])

const content = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)
const publishing = ref(false)

const canPublish = computed(() => {
  return content.value.trim().length > 0 || imageFile.value !== null
})

function handleImage(e) {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 5MB')
    return
  }

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function removeImage() {
  imageFile.value = null
  imagePreview.value = null
}

async function publish() {
  if (!canPublish.value) return

  publishing.value = true

  try {
    const formData = new FormData()
    formData.append('caption', content.value)  // ← corrigido: content → caption
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    const { data } = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    content.value = ''
    removeImage()

    emit('post-created', data)
    close()
  } catch (err) {
    console.error('Erro ao publicar:', err)
    alert('Erro ao publicar. Tente novamente.')
  } finally {
    publishing.value = false
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #333;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #f5f5f5;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #f5f5f5;
  background: #333;
}

.modal-body {
  padding: 16px 20px;
  overflow-y: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #c9a84c;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.user-name {
  font-weight: 600;
  color: #f5f5f5;
  font-size: 15px;
}

textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: #f5f5f5;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  outline: none;
  font-family: inherit;
}

textarea::placeholder {
  color: #666;
}

.image-preview {
  position: relative;
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
}

.image-preview img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  display: block;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-image:hover {
  background: rgba(220, 38, 38, 0.8);
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.char-count.warning {
  color: #ef4444;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 16px;
  border-top: 1px solid #333;
}

.actions-left {
  display: flex;
  gap: 8px;
}

.attach-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  color: #c9a84c;
  transition: all 0.2s;
}

.attach-btn:hover {
  background: rgba(201, 168, 76, 0.1);
}

.attach-btn svg {
  pointer-events: none;
}

.publish-btn {
  background: #c9a84c;
  color: #1a1a1a;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.publish-btn:hover:not(:disabled) {
  background: #d4b55a;
  transform: translateY(-1px);
}

.publish-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Animações */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}
</style>