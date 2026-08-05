<template>
  <div class="right-panel">
    <div class="signup-card">
      <h2>Inicie sua jornada com Guildfy</h2>
      <p class="form-subtitle">Cadastre-se para ver fotos, vídeos dos seus amigos.</p>

      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="contact">Email</label>
          <input
            type="text"
            id="contact"
            v-model="form.contact"
            placeholder="email"
            :class="{ invalid: errorMessage }"
          >
        </div>

        <div class="input-group">
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="senha"
            minlength="6"
            :class="{ invalid: errorMessage }"
          >
        </div>

        <div class="date-group">
          <label class="date-label">Data de aniversário:</label>
          <div class="date-selects">
            <select v-model="form.day" class="date-select">
              <option value="" disabled>Dia</option>
              <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
            </select>

            <select v-model="form.month" class="date-select">
              <option value="" disabled>Mês</option>
              <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
            </select>

            <select v-model="form.year" class="date-select">
              <option value="" disabled>Ano</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <label for="name">Nome</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            placeholder="Nome completo"
          >
        </div>

        <div class="input-group">
          <label for="username">Nome de usuário</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            placeholder="Nome de usuário"
          >
        </div>

        <p v-if="errorMessage" class="server-error">{{ errorMessage }}</p>

        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Cadastrando…' : 'Cadastrar' }}
        </button>
      </form>

      <button type="button" class="btn-outline" @click="goToLogin">
        Já tenho uma conta
      </button>
    </div>
  </div>
</template>

<script setup>
import { useSignupForm } from './js/sign.js';

const {
  form,
  errorMessage,
  isSubmitting,
  months,
  years,
  goToLogin,
  handleSubmit
} = useSignupForm();
</script>

<style scoped src="./css/sign.css"></style>