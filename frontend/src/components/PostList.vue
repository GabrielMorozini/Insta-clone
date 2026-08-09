<template>
  <div class="post-list">
    <div v-if="loading && posts.length === 0" class="loading">
      Carregando posts...
    </div>

    <div v-for="post in posts" :key="post.id" class="post-card">
      <img
        :src="post.user?.avatar || '/default-avatar.png'"
        class="avatar"
        alt="avatar"
      />
      <div class="post-body">
        <div class="post-header">
          <strong>{{ post.user?.name }}</strong>
          <span class="date">{{ formatDate(post.created_at) }}</span>
        </div>
        <p>{{ post.content }}</p>
        <img
          v-if="post.image"
          :src="`${apiBaseUrl}/storage/${post.image}`"
          class="post-image"
          alt="post image"
        />
      </div>
    </div>

    <button
      v-if="pagination?.next_page_url"
      @click="loadMore"
      :disabled="loading"
      class="load-more"
    >
      {{ loading ? 'Carregando...' : 'Carregar mais' }}
    </button>

    <div v-if="!loading && posts.length === 0" class="empty">
      Nenhum post ainda.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../services/api.js';

const props = defineProps({
  userId: { type: [String, Number], default: null }, // null = feed
});

const posts = ref([]);
const pagination = ref(null);
const loading = ref(false);
const page = ref(1);
const apiBaseUrl = import.meta.env.VITE_API_URL;

const fetchPosts = async (reset = false) => {
  if (reset) {
    page.value = 1;
    posts.value = [];
  }

  loading.value = true;

  try {
    const { data } = props.userId
      ? await postService.getUserPosts(props.userId, page.value)
      : await postService.getFeed(page.value);

    posts.value.push(...data.data);
    pagination.value = {
      current_page: data.current_page,
      next_page_url: data.next_page_url,
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

const formatDate = (date) =>
  new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

// Recarrega se mudar de usuário (navegação entre perfis)
watch(() => props.userId, () => fetchPosts(true), { immediate: false });

onMounted(() => fetchPosts(true));

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