<template>
  <div class="post-list">
    <div v-if="loading && posts.length === 0" class="loading">
      Carregando posts...
    </div>

    <div v-for="post in posts" :key="post.id" class="post-card">
      <img :src="post.user?.profile_photo || '/default-avatar.png'" class="avatar" alt="avatar" />
      <div class="post-body">
        <div class="post-header">
          <strong>{{ post.user?.name }}</strong>
          <span class="date">{{ formatDate(post.created_at) }}</span>
        </div>
        <p>{{ post.caption }}</p>
        <img v-if="post.image_url" :src="`${apiBaseUrl}${post.image_url}`" class="post-image" alt="post image" />

        <div class="post-actions">
          <button
            class="like-btn"
            :class="{ 'like-btn--liked': post.liked_by_me }"
            :disabled="likeLoading[post.id]"
            @click="toggleLike(post)"
          >
            {{ post.liked_by_me ? '❤️' : '🤍' }} {{ post.likes_count }}
          </button>

          <button class="comment-toggle-btn" @click="toggleComments(post)">
            💬 {{ post.comments_count }}
          </button>
        </div>

        <div v-if="openComments[post.id]" class="comments-section">
          <div v-if="commentsLoading[post.id]" class="comments-loading">
            Carregando comentários...
          </div>

          <ul v-else class="comments-list">
            <li v-for="comment in commentsByPost[post.id]" :key="comment.id" class="comment-item">
              <template v-if="editingCommentId[comment.id]">
                <input
                  v-model="editCommentText[comment.id]"
                  type="text"
                  class="comment-edit-input"
                  @keyup.enter="saveComment(comment)"
                />
                <button class="comment-action-btn" @click="saveComment(comment)">Salvar</button>
                <button class="comment-action-btn" @click="cancelEditComment(comment)">Cancelar</button>
              </template>

              <template v-else>
                <strong>{{ comment.user?.username || comment.user?.name }}</strong>
                <span>{{ comment.body }}</span>

                <span v-if="comment.user?.id === currentUserId" class="comment-owner-actions">
                  <button class="comment-action-btn" @click="startEditComment(comment)">✏️</button>
                  <button class="comment-action-btn" @click="removeComment(post, comment)">🗑️</button>
                </span>
              </template>
            </li>
            <li v-if="commentsByPost[post.id]?.length === 0" class="comments-empty">
              Nenhum comentário ainda.
            </li>
          </ul>

          <form class="comment-form" @submit.prevent="submitComment(post)">
            <input
              v-model="newComment[post.id]"
              type="text"
              placeholder="Escreva um comentário..."
              :disabled="commentSubmitting[post.id]"
            />
            <button type="submit" :disabled="!newComment[post.id]?.trim() || commentSubmitting[post.id]">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>

    <button v-if="pagination?.next_page_url" @click="loadMore" :disabled="loading" class="load-more">
      {{ loading ? 'Carregando...' : 'Carregar mais' }}
    </button>

    <div v-if="!loading && posts.length === 0" class="empty">
      Nenhum post ainda.
    </div>
  </div>
</template>

<script setup>
import { usePostList } from '@/js/postList.js';

const props = defineProps({
  userId: { type: [String, Number], default: null }, // null = feed
});

const {
  posts,
  pagination,
  loading,
  apiBaseUrl,
  currentUserId,
  likeLoading,
  openComments,
  commentsByPost,
  commentsLoading,
  newComment,
  commentSubmitting,
  editingCommentId,
  editCommentText,
  loadMore,
  toggleLike,
  toggleComments,
  submitComment,
  startEditComment,
  cancelEditComment,
  saveComment,
  removeComment,
  formatDate,
  refresh,
} = usePostList(props);

defineExpose({ refresh });
</script>

<style scoped src="@/css/postList.css"></style>