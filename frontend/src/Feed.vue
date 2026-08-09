
<template>
  <div class="tavern-layout">
    <Navbar />
    <main class="guild-feed">
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

       <div class="feed">
          <h2>Feed</h2>
          <!-- Componente de criar post que você já tem -->
          <CreatePost @post-created="onPostCreated" />
          <PostList ref="postListRef" />
       </div>

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
import Navbar from '@/components/Sidebar.vue'
import PostList from '@/components/PostList.vue';

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
  handleAddCrest,
  handleOpenCrest,
  refreshSuggestions,
} = useFeed();

const postListRef = ref(null);

const onPostCreated = () => {
  postListRef.value?.refresh(); // Recarrega o feed
};

</script>

<style scoped src="./css/feed.css"></style>