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
import { ref, reactive, onMounted, watch } from 'vue';
import { postService } from '../services/postService.js';
import api from '../services/api.js';

const props = defineProps({
  userId: { type: [String, Number], default: null }, // null = feed
});

const posts = ref([]);
const pagination = ref(null);
const loading = ref(false);
const page = ref(1);
const apiBaseUrl = import.meta.env.VITE_API_URL;

// Usuário logado
const currentUserId = ref(null);

// Estado de likes
const likeLoading = reactive({});

// Estado de comentários
const openComments = reactive({});
const commentsByPost = reactive({});
const commentsLoading = reactive({});
const newComment = reactive({});
const commentSubmitting = reactive({});

// Estado de edição de comentário
const editingCommentId = reactive({});
const editCommentText = reactive({});

const fetchPosts = async (reset = false) => {
  if (reset) {
    page.value = 1;
    posts.value = [];
  }

  loading.value = true;

  try {
    const response = props.userId
      ? await postService.getUserPosts(props.userId, page.value)
      : await postService.getFeed(page.value);

    posts.value.push(...response.data);
    pagination.value = {
      next_page_url: response.links?.next ?? null,
    };
  } catch (err) {
    console.error('Erro ao carregar posts:', err);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (!pagination.value?.next_page_url) return;
  page.value++;
  fetchPosts();
};

const toggleLike = async (post) => {
  if (likeLoading[post.id]) return;
  likeLoading[post.id] = true;

  // Otimista: atualiza a UI antes da resposta do servidor
  const wasLiked = post.liked_by_me;
  post.liked_by_me = !wasLiked;
  post.likes_count += wasLiked ? -1 : 1;

  try {
    const response = wasLiked
      ? await postService.unlikePost(post.id)
      : await postService.likePost(post.id);

    // Sincroniza com o valor real vindo do servidor
    post.liked_by_me = response.data.liked;
    post.likes_count = response.data.likes_count;
  } catch (err) {
    console.error('Erro ao curtir/descurtir post:', err);
    // Reverte em caso de erro
    post.liked_by_me = wasLiked;
    post.likes_count += wasLiked ? 1 : -1;
  } finally {
    likeLoading[post.id] = false;
  }
};

const toggleComments = async (post) => {
  openComments[post.id] = !openComments[post.id];

  if (openComments[post.id] && !commentsByPost[post.id]) {
    commentsLoading[post.id] = true;
    try {
      const response = await postService.getComments(post.id);
      commentsByPost[post.id] = response.data ?? response;
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
      commentsByPost[post.id] = [];
    } finally {
      commentsLoading[post.id] = false;
    }
  }
};

const submitComment = async (post) => {
  const body = newComment[post.id]?.trim();
  if (!body) return;

  commentSubmitting[post.id] = true;

  try {
    const comment = await postService.addComment(post.id, body);
    if (!commentsByPost[post.id]) commentsByPost[post.id] = [];
    commentsByPost[post.id].push(comment.data ?? comment);
    post.comments_count += 1;
    newComment[post.id] = '';
  } catch (err) {
    console.error('Erro ao comentar:', err);
  } finally {
    commentSubmitting[post.id] = false;
  }
};

const startEditComment = (comment) => {
  editingCommentId[comment.id] = true;
  editCommentText[comment.id] = comment.body;
};

const cancelEditComment = (comment) => {
  editingCommentId[comment.id] = false;
};

const saveComment = async (comment) => {
  const content = editCommentText[comment.id]?.trim();
  if (!content) return;

  try {
    const response = await postService.updateComment(comment.id, content);
    const updated = response.data ?? response;
    comment.body = updated.body;
    editingCommentId[comment.id] = false;
  } catch (err) {
    console.error('Erro ao editar comentário:', err);
  }
};

const removeComment = async (post, comment) => {
  try {
    await postService.deleteComment(comment.id);
    commentsByPost[post.id] = commentsByPost[post.id].filter((c) => c.id !== comment.id);
    post.comments_count -= 1;
  } catch (err) {
    console.error('Erro ao apagar comentário:', err);
  }
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

watch(() => props.userId, () => fetchPosts(true), { immediate: false });

onMounted(async () => {
  try {
    const me = await api.get('/auth/me');
    currentUserId.value = me.data.id;
  } catch (err) {
    console.error('Erro ao carregar usuário atual:', err);
  }
  fetchPosts(true);
});

defineExpose({ refresh: () => fetchPosts(true) });
</script>

<style scoped>
.post-list {
  max-width: 600px;
  margin: 0 auto;
}

.post-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e1e8ed;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.post-body {
  flex: 1;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.date {
  color: #657786;
  font-size: 0.85rem;
}

.post-image {
  max-width: 100%;
  border-radius: 12px;
  margin-top: 8px;
}

.post-actions {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.like-btn,
.comment-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #657786;
  display: flex;
  align-items: center;
  gap: 4px;
}

.like-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.like-btn--liked {
  color: #e0245e;
  font-weight: 600;
}

.comments-section {
  margin-top: 12px;
  border-top: 1px solid #e1e8ed;
  padding-top: 10px;
}

.comments-loading,
.comments-empty {
  color: #657786;
  font-size: 0.85rem;
  padding: 4px 0;
}

.comments-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.comment-item {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.comment-item strong {
  margin-right: 6px;
}

.comment-owner-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.comment-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  color: #657786;
  padding: 0 4px;
}

.comment-edit-input {
  flex: 1;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.85rem;
}

.comment-form {
  display: flex;
  gap: 8px;
}

.comment-form input {
  flex: 1;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.9rem;
}

.comment-form button {
  background: #1da1f2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.85rem;
}

.comment-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.load-more {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  background: #1da1f2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.load-more:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty,
.loading {
  text-align: center;
  padding: 40px;
  color: #657786;
}
</style>