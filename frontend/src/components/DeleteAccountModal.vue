<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-box">
      <h2 class="modal-title">⚔️ Deixar a Guilda para sempre?</h2>
      <p class="modal-text">
        Esta ação é <strong>irreversível</strong>. Todos os seus posts, curtidas,
        comentários e conexões serão apagados permanentemente do reino.
      </p>

      <label class="modal-label" for="confirm-password">Digite sua senha para confirmar</label>
      <input
        id="confirm-password"
        v-model="password"
        type="password"
        class="modal-input"
        placeholder="Sua senha"
        :disabled="isDeleting"
        @keyup.enter="confirmDelete"
      />

      <p v-if="error" class="modal-error">{{ error }}</p>

      <div class="modal-actions">
        <button class="btn-cancel" :disabled="isDeleting" @click="closeModal">
          Cancelar
        </button>
        <button class="btn-danger" :disabled="isDeleting" @click="confirmDelete">
          {{ isDeleting ? 'Deletando...' : 'Deletar minha conta' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDeleteAccount } from '../js/useDeleteAccount' // ajuste o caminho

const {
  password,
  isDeleting,
  error,
  showModal,
  closeModal,
  confirmDelete,
} = useDeleteAccount()

defineExpose({ showModal })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #2b1d14;
  border: 1px solid #7a5c3e;
  border-radius: 8px;
  padding: 2rem;
  max-width: 420px;
  width: 90%;
  color: #e8d9b5;
  font-family: 'Cinzel', serif;
}

.modal-title {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: #d4af37;
}

.modal-text {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  color: #cbb98f;
}

.modal-label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
}

.modal-input {
  width: 100%;
  padding: 0.6rem;
  background: #1a120b;
  border: 1px solid #7a5c3e;
  border-radius: 4px;
  color: #e8d9b5;
  margin-bottom: 0.75rem;
}

.modal-error {
  color: #c0392b;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel,
.btn-danger {
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-family: 'Cinzel', serif;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #7a5c3e;
  color: #e8d9b5;
}

.btn-danger {
  background: #7a1f1f;
  color: #f5e6d3;
}

.btn-danger:disabled,
.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>