import { ref, reactive, onMounted, watch } from 'vue';
import { postService } from '../services/postService.js';
import api from '../services/api.js';

export function usePostList(props) {
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

  return {
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
    refresh: () => fetchPosts(true),
  };
}