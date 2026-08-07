
vue_content = '''<template>
  <div class="tavern-layout">
    <!-- ═══════════════════════════════════════
         SIDEBAR ESQUERDO — Navegação Principal
         ═══════════════════════════════════════ -->
    <aside class="guild-nav">
      <div class="guild-nav-logo">
        <img src="/icon-main.png" alt="Guildfy Logo" />
        <span>Guildfy</span>
      </div>

      <nav class="guild-nav-links">
        <RouterLink to="/feed" class="nav-item" active-class="is-active">
          <img src="/icon-home.png" alt="Mural" class="nav-icon" />
          <span>Mural</span>
        </RouterLink>

        <RouterLink to="/explore" class="nav-item" active-class="is-active">
          <img src="/icon-search.png" alt="Explorar" class="nav-icon" />
          <span>Explorar</span>
        </RouterLink>

        <RouterLink to="/notifications" class="nav-item" active-class="is-active">
          <img src="/icon-reel.png" alt="Notificações" class="nav-icon" />
          <span>Notificações</span>
        </RouterLink>

        <button class="nav-item nav-item--btn" @click="handleCreatePost">
          <img src="/icon-add.png" alt="Nova Postagem" class="nav-icon" />
          <span>Nova Postagem</span>
        </button>

        <RouterLink
          :to="`/profile/${currentUser?.username}`"
          class="nav-item"
          active-class="is-active"
        >
          <img src="/icon-profile.png" alt="Meu Perfil" class="nav-icon" />
          <span>Meu Perfil</span>
        </RouterLink>
      </nav>

      <button class="nav-item nav-item--logout" @click="handleLogout">
        <img src="/icon-main.png" alt="Deixar a Taverna" class="nav-icon" />
        <span>Deixar a Taverna</span>
      </button>
    </aside>

    <!-- ═══════════════════════════════════════
         FEED CENTRAL — Posts & Brasões
         ═══════════════════════════════════════ -->
    <main class="guild-feed">
      <!-- Brasões (Stories) -->
      <section class="crest-rail" aria-label="Brasões da guilda">
        <button class="crest-item crest-item--self" @click="handleAddCrest">
          <span class="crest-ring crest-ring--empty">
            <img :src="currentUser?.profile_photo || defaultAvatar" alt="" />
            <span class="crest-plus">+</span>
          </span>
          <span class="crest-name">Seu brasão</span>
        </button>

        <button
          v-for="crest in crests"
          :key="crest.id"
          class="crest-item"
          :class="{ 'crest-item--seen': crest.seen }"
          @click="handleOpenCrest(crest)"
        >
          <span class="crest-ring">
            <img :src="crest.avatar" :alt="crest.username" />
          </span>
          <span class="crest-name">{{ crest.username }}</span>
        </button>
      </section>

      <!-- Estado vazio -->
      <div v-if="!isLoading && posts.length === 0" class="feed-empty">
        <img src="/icon-reel.png" class="feed-empty-icon" alt="Vazio" />
        <h3>O mural ainda está em branco</h3>
        <p>Siga outros aventureiros ou publique algo pra começar sua saga.</p>
      </div>

      <!-- Posts -->
      <article v-for="post in posts" :key="post.id" class="post-card">
        <header class="post-header">
          <img
            class="post-avatar"
            :src="post.user.profile_photo || defaultAvatar"
            alt=""
          />
          <div class="post-header-info">
            <RouterLink
              :to="`/profile/${post.user.username}`"
              class="post-username"
            >
              {{ post.user.username }}
            </RouterLink>
            <span class="post-time">{{ post.relativeTime }}</span>
          </div>
          <button class="post-more" aria-label="Mais opções">⋯</button>
        </header>

        <div class="post-image-wrap">
          <img :src="post.image" :alt="post.caption" class="post-image" />
        </div>

        <div class="post-actions">
          <button
            class="action-btn"
            :class="{ 'action-btn--liked': post.likedByMe }"
            @click="toggleLike(post)"
          >
            <img src="/icon-save.png" alt="Apoiar" class="action-icon" />
          </button>
          <button class="action-btn" @click="focusComment(post)">
            <span>💬</span>
          </button>
        </div>

        <p class="post-likes">{{ post.likesCount }} apoios de armas</p>

        <p class="post-caption">
          <RouterLink
            :to="`/profile/${post.user.username}`"
            class="post-username"
          >
            {{ post.user.username }}
          </RouterLink>
          {{ post.caption }}
        </p>

        <button
          v-if="post.commentsCount > 0"
          class="post-comments-link"
          @click="focusComment(post)"
        >
          Ver os {{ post.commentsCount }} relatos
        </button>

        <form class="post-comment-form" @submit.prevent="submitComment(post)">
          <input
            :ref="(el) => setCommentRef(post.id, el)"
            v-model="commentDrafts[post.id]"
            type="text"
            placeholder="Deixe seu relato..."
          />
          <button
            type="submit"
            :disabled="!commentDrafts[post.id]?.trim()"
          >
            Publicar
          </button>
        </form>
      </article>

      <p v-if="isLoading" class="feed-loading">Desenrolando pergaminhos...</p>
    </main>

    <!-- ═══════════════════════════════════════
         SIDEBAR DIREITO — Sugestões & Perfil
         ═══════════════════════════════════════ -->
    <aside class="guild-suggestions">
      <div class="current-user-card" v-if="currentUser">
        <img :src="currentUser.profile_photo || defaultAvatar" alt="" />
        <div>
          <strong>{{ currentUser.username }}</strong>
          <span>{{ currentUser.name }}</span>
        </div>
      </div>

      <div class="suggestions-header">
        <span>Convocar aventureiros</span>
        <button @click="refreshSuggestions">Ver mais</button>
      </div>

      <ul class="suggestions-list">
        <li
          v-for="person in suggestions"
          :key="person.id"
          class="suggestion-item"
        >
          <img :src="person.profile_photo || defaultAvatar" alt="" />
          <div class="suggestion-info">
            <RouterLink :to="`/profile/${person.username}`">
              {{ person.username }}
            </RouterLink>
            <span>{{ person.mutualLabel }}</span>
          </div>
          <button
            class="follow-btn"
            :class="{ 'follow-btn--following': person.following }"
            @click="toggleFollow(person)"
          >
            {{ person.following ? 'Seguindo' : 'Recrutar' }}
          </button>
        </li>
      </ul>

      <footer class="guild-footer">
        Guildfy © {{ new Date().getFullYear() }} — forjado com ferro e código
      </footer>
    </aside>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useFeed } from './js/feed.js';

// Tudo que está na pasta public fica disponível na raiz '/' do navegador
const defaultAvatar = '/icon-profile.png';

const {
  currentUser,
  posts,
  crests,
  suggestions,
  isLoading,
  commentDrafts,
  setCommentRef,
  toggleLike,
  toggleFollow,
  submitComment,
  focusComment,
  handleCreatePost,
  handleAddCrest,
  handleOpenCrest,
  handleLogout,
  refreshSuggestions,
} = useFeed();
</script>

<style scoped>
/* ═══════════════════════════════════════════
   RESET & BASE
   ═══════════════════════════════════════════ */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
}

img {
  max-width: 100%;
  display: block;
}

/* ═══════════════════════════════════════════
   LAYOUT PRINCIPAL — 3 colunas
   ═══════════════════════════════════════════ */
.tavern-layout {
  display: flex;
  min-height: 100vh;
  background-color: #0a0a0a;
}

/* ═══════════════════════════════════════════
   SIDEBAR ESQUERDO (igual Instagram)
   ═══════════════════════════════════════════ */
.guild-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 244px;
  height: 100vh;
  border-right: 1px solid #262626;
  background-color: #0a0a0a;
  display: flex;
  flex-direction: column;
  padding: 8px 12px 20px 12px;
  z-index: 100;
}

.guild-nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 25px 12px 16px 12px;
  margin-bottom: 19px;
}

.guild-nav-logo img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.guild-nav-logo span {
  font-size: 22px;
  font-weight: 700;
  color: #f5f5f5;
  font-family: 'Georgia', serif;
  letter-spacing: -0.5px;
}

.guild-nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  color: #f5f5f5;
  font-size: 16px;
  transition: background-color 0.2s;
  text-decoration: none;
}

.nav-item:hover {
  background-color: #1a1a1a;
}

.nav-item.is-active {
  font-weight: 600;
}

.nav-item.is-active .nav-icon {
  filter: brightness(1.3);
}

.nav-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.nav-item--btn {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.nav-item--logout {
  margin-top: auto;
  width: 100%;
  text-align: left;
}

/* ═══════════════════════════════════════════
   FEED CENTRAL
   ═══════════════════════════════════════════ */
.guild-feed {
  margin-left: 244px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0 40px 0;
  max-width: calc(100% - 244px - 320px);
  min-width: 470px;
}

/* ═══════════════════════════════════════════
   BRASÕES (Stories)
   ═══════════════════════════════════════════ */
.crest-rail {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  margin-bottom: 24px;
  width: 470px;
  overflow-x: auto;
  scrollbar-width: none;
}

.crest-rail::-webkit-scrollbar {
  display: none;
}

.crest-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  min-width: 72px;
}

.crest-ring {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(
    45deg,
    #f09433,
    #e6683c,
    #dc2743,
    #cc2366,
    #bc1888
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.crest-ring--empty {
  background: #262626;
  position: relative;
}

.crest-ring img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0a0a0a;
  background-color: #1a1a1a;
}

.crest-plus {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background-color: #0095f6;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0a0a0a;
}

.crest-name {
  font-size: 12px;
  color: #f5f5f5;
  max-width: 72px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.crest-item--seen .crest-ring {
  background: #262626;
}

/* ═══════════════════════════════════════════
   ESTADO VAZIO
   ═══════════════════════════════════════════ */
.feed-empty {
  text-align: center;
  padding: 60px 20px;
  color: #a8a8a8;
}

.feed-empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  opacity: 0.5;
  object-fit: contain;
}

.feed-empty h3 {
  font-size: 18px;
  color: #f5f5f5;
  margin-bottom: 8px;
  font-weight: 600;
}

.feed-empty p {
  font-size: 14px;
  color: #a8a8a8;
}

/* ═══════════════════════════════════════════
   POST CARDS
   ═══════════════════════════════════════════ */
.post-card {
  width: 470px;
  background-color: #0a0a0a;
  border-bottom: 1px solid #262626;
  margin-bottom: 20px;
  padding-bottom: 16px;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 4px;
}

.post-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.post-header-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.post-username {
  font-size: 14px;
  font-weight: 600;
  color: #f5f5f5;
}

.post-time {
  font-size: 12px;
  color: #a8a8a8;
}

.post-more {
  font-size: 20px;
  color: #f5f5f5;
  padding: 4px;
}

.post-image-wrap {
  width: 470px;
  height: 470px;
  background-color: #1a1a1a;
  border-radius: 4px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-actions {
  display: flex;
  gap: 16px;
  padding: 12px 4px 8px 4px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.action-btn img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.action-btn span {
  font-size: 24px;
  line-height: 1;
}

.action-btn--liked img {
  filter: hue-rotate(320deg) saturate(3) brightness(1.2);
}

.post-likes {
  font-size: 14px;
  font-weight: 600;
  color: #f5f5f5;
  padding: 0 4px 8px 4px;
}

.post-caption {
  font-size: 14px;
  color: #f5f5f5;
  padding: 0 4px 8px 4px;
  line-height: 1.5;
}

.post-caption .post-username {
  margin-right: 6px;
}

.post-comments-link {
  font-size: 14px;
  color: #a8a8a8;
  padding: 0 4px 12px 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.post-comment-form {
  display: flex;
  gap: 12px;
  padding: 0 4px;
  border-top: 1px solid #262626;
  padding-top: 12px;
}

.post-comment-form input {
  flex: 1;
  background: none;
  border: none;
  color: #f5f5f5;
  font-size: 14px;
  outline: none;
}

.post-comment-form input::placeholder {
  color: #a8a8a8;
}

.post-comment-form button {
  color: #0095f6;
  font-size: 14px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
}

.post-comment-form button:disabled {
  color: #0095f6;
  opacity: 0.4;
  cursor: default;
}

.feed-loading {
  text-align: center;
  padding: 40px;
  color: #a8a8a8;
  font-size: 14px;
}

/* ═══════════════════════════════════════════
   SIDEBAR DIREITO — Sugestões
   ═══════════════════════════════════════════ */
.guild-suggestions {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  padding: 36px 16px 20px 16px;
  overflow-y: auto;
}

.current-user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.current-user-card img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.current-user-card div {
  display: flex;
  flex-direction: column;
}

.current-user-card strong {
  font-size: 14px;
  color: #f5f5f5;
  font-weight: 600;
}

.current-user-card span {
  font-size: 14px;
  color: #a8a8a8;
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.suggestions-header span {
  font-size: 14px;
  color: #a8a8a8;
  font-weight: 600;
}

.suggestions-header button {
  font-size: 12px;
  color: #f5f5f5;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
}

.suggestions-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.suggestion-item img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.suggestion-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.suggestion-info a {
  font-size: 14px;
  font-weight: 600;
  color: #f5f5f5;
}

.suggestion-info span {
  font-size: 12px;
  color: #a8a8a8;
}

.follow-btn {
  font-size: 12px;
  color: #0095f6;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
}

.follow-btn--following {
  color: #a8a8a8;
}

.guild-footer {
  margin-top: 40px;
  font-size: 12px;
  color: #737373;
  line-height: 1.6;
}

/* ═══════════════════════════════════════════
   RESPONSIVO
   ═══════════════════════════════════════════ */
@media (max-width: 1264px) {
  .guild-suggestions {
    display: none;
  }

  .guild-feed {
    max-width: calc(100% - 244px);
  }
}

@media (max-width: 768px) {
  .guild-nav {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    width: 100%;
    height: auto;
    border-right: none;
    border-top: 1px solid #262626;
    flex-direction: row;
    justify-content: space-around;
    padding: 8px 0;
    z-index: 100;
  }

  .guild-nav-logo,
  .nav-item span,
  .nav-item--logout span {
    display: none;
  }

  .guild-nav-links {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    gap: 0;
  }

  .nav-item {
    padding: 8px;
  }

  .nav-item--logout {
    display: none;
  }

  .guild-feed {
    margin-left: 0;
    margin-bottom: 60px;
    max-width: 100%;
    min-width: auto;
    padding: 16px 0;
  }

  .post-card,
  .post-image-wrap,
  .crest-rail {
    width: 100%;
    max-width: 470px;
  }
}
</style>
'''

with open('/mnt/agents/output/FeedView.vue', 'w', encoding='utf-8') as f:
    f.write(vue_content)

print("Arquivo Vue salvo com sucesso!")
print(f"Total de linhas: {len(vue_content.splitlines())}")
