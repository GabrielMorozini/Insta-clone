<template>
  <div class="login-page">
    <!-- Painel esquerdo -->
    <div class="left-panel">
      <div class="logo">
        <img src="../public/icone 5.png" alt="Logo" />
      </div>
      <h1>
        Veja momentos do dia a dia dos seus
        <span class="highlight">amigos próximos</span>.
      </h1>

      <div class="hero-frame">
        <img src="../assets/wallpaper/Copilot_20260718_101652.png" alt="Membros do clã reunidos em um banquete à luz de tochas" />
      </div>
    </div>

    <!-- Painel direito -->
    <div class="right-panel">
      <form class="login-card" @submit.prevent="handleLogin">
        <h2>Entrar</h2>

        <div class="input-group">
          <input
            type="text"
            v-model="form.identifier"
            placeholder="Nome de usuário ou email"
            :class="{ invalid: errors.identifier }"
          />
          <span v-if="errors.identifier" class="error-icon" title="Campo obrigatório">⚠️</span>
        </div>

        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            placeholder="Senha"
            :class="{ invalid: errors.password }"
          />
          <span v-if="errors.password" class="error-icon" title="Campo obrigatório">⚠️</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <router-link to="/forgot-password" class="forgot-link">
          Esqueceu a senha?
        </router-link>

        <router-link to="/signup" class="btn-outline">
          Criar nova conta
        </router-link>

        <p v-if="serverError" class="server-error">{{ serverError }}</p>
      </form>
    </div>
  </div>
</template>
<script src="./js/login.js"></script>

<style scoped src="./css/verif.css"></style>