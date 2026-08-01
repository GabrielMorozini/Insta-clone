<template>
  <div class="signup-container">
    <form class="signup-form" @submit.prevent="handleSubmit">
      <h2 class="form-title">Criar conta</h2>

      <div class="mb-3">
        <label for="name" class="form-label">Nome completo</label>
        <input
          type="text"
          id="name"
          class="form-control"
          v-model="form.name"
          required
        >
      </div>

      <div class="mb-3">
        <label for="username" class="form-label">Nome de usuário</label>
        <input
          type="text"
          id="username"
          class="form-control"
          v-model="form.username"
          required
        >
      </div>

      <div class="mb-3">
        <label for="contact" class="form-label">Celular ou e-mail</label>
        <input
          type="text"
          id="contact"
          class="form-control"
          v-model="form.contact"
          placeholder="exemplo@email.com ou (42) 99999-9999"
          required
        >
      </div>

      <div class="mb-3">
        <label for="birthdate" class="form-label">Data de nascimento</label>
        <input
          type="date"
          id="birthdate"
          class="form-control"
          v-model="form.birthdate"
          required
        >
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Senha</label>
        <input
          type="password"
          id="password"
          class="form-control"
          v-model="form.password"
          minlength="6"
          required
        >
      </div>

      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

      <button type="submit" class="btn btn-primary w-100">Cadastrar</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  username: '',
  contact: '',
  birthdate: '',
  password: ''
})

const errorMessage = ref('')

function handleSubmit() {
  errorMessage.value = ''

  // validação simples do contato: email ou celular
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact)
  const isPhone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(form.contact)

  if (!isEmail && !isPhone) {
    errorMessage.value = 'Digite um e-mail ou celular válido.'
    return
  }

  console.log('Dados do cadastro:', form)
  // aqui depois entra a chamada pra sua API (fetch/axios)
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.signup-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.form-title {
  text-align: center;
  margin-bottom: 1.5rem;
}
</style>