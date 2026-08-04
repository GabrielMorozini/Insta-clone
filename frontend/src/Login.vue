<template>
  <div class="guild-card">
    <section class="guild-hero">
      <div class="guild-emblem">
        <img src="/public/icon-main.png" alt=""  />
      </div>

      <h1 class="guild-headline">
        Una-se ao maior Clã da internet<br />
        encontre e <span class="accent">forje amizades!</span>
      </h1>
      <p class="guild-subline">As aventuras são mais legais com seus amigos</p>

      <div class="tavern-scene">
        <img :src="tavernWallpaper" alt="Taverna do Javali Dourado" />
      </div>
    </section>

    <div class="guild-divider">
      <img src="../assets/wallpaper/border.png" alt="" />
    </div>

    <section class="guild-form-panel">
      <h2 class="guild-form-title">Entrar no Guildfy</h2>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="guild-field">
          <label class="sr-only" for="username">Nome de usuário ou email</label>
          <input
            id="username"
            type="text"
            autocomplete="username"
            placeholder="Nome de usuário ou email"
            v-model="username"
          />
        </div>

        <div class="guild-field">
          <label class="sr-only" for="password">Senha</label>
          <input
            id="password"
            type="password"
            autocomplete="current-password"
            placeholder="Senha"
            v-model="password"
          />
        </div>

        <p class="guild-error" v-if="error">{{ error }}</p>

        <button class="guild-submit" type="submit" :disabled="!canSubmit">
          {{ isSubmitting ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <a class="guild-forgot" href="#" @click.prevent="handleForgotPassword">Esqueceu a senha?</a>

      <button class="guild-create" type="button" @click="handleCreateAccount">Criar nova conta</button>

      <p class="guild-toast" aria-live="polite">{{ toastMessage }}</p>
    </section>
  </div>
</template>

<script setup>
import { useLoginForm } from './js/login.js';
import tavernWallpaper from '../assets/wallpaper/login-2.png';

const {
  username,
  password,
  error,
  isSubmitting,
  canSubmit,
  toastMessage,
  handleSubmit,
  handleForgotPassword,
  handleCreateAccount,
} = useLoginForm();
</script>

<style scoped src="./css/login.css"></style>