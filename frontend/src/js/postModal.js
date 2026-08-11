import { ref, watch } from 'vue';
import { postService } from '../../services/postService.js';

export function usePostModal(props, emit) {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const post = ref(null);
  const loading = ref(false);
  const editing = ref(false);
  const editCaption = ref('');
  const saving = ref(false);
  const editError = ref('');

  const fetchPost = async () => {
    if (!props.postId) return;
    loading.value = true;
    post.value = null;
    try {
      const response = await postService.getPost(props.postId);
      post.value = response.data ?? response;
    } catch (err) {
      console.error('Erro ao carregar post:', err);
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => [props.modelValue, props.postId],
    ([open]) => {
      editing.value = false;
      editError.value = '';
      if (open) fetchPost();
    }
  );

  const close = () => emit('update:modelValue', false);

  const startEdit = () => {
    editCaption.value = post.value.caption;
    editing.value = true;
    editError.value = '';
  };

  const cancelEdit = () => {
    editing.value = false;
  };

  const saveEdit = async () => {
    saving.value = true;
    editError.value = '';
    try {
      const response = await postService.updatePost(props.postId, {
        caption: editCaption.value,
      });
      const updated = response.data ?? response;
      post.value = updated;
      editing.value = false;
      emit('updated', updated);
    } catch (err) {
      console.error('Erro ao editar post:', err);
      editError.value = 'Não foi possível salvar. Tente novamente.';
    } finally {
      saving.value = false;
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja apagar este post?')) return;
    try {
      await postService.deletePost(props.postId);
      emit('deleted', props.postId);
      close();
    } catch (err) {
      console.error('Erro ao apagar post:', err);
      alert('Não foi possível apagar o post.');
    }
  };

  return {
    apiBaseUrl,
    post,
    loading,
    editing,
    editCaption,
    saving,
    editError,
    close,
    startEdit,
    cancelEdit,
    saveEdit,
    handleDelete,
  };
}