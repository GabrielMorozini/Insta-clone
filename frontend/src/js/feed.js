import { ref, onMounted } from 'vue'
import api from '../services/api'

export function useFeed() {
  const posts = ref([])
  const suggestions = ref([])
  const currentUser = ref(null)
  const isLoading = ref(true)
  const errorMessage = ref('')

  async function loadFeed() {
    const [feedResult, suggestionsResult, meResult] = await Promise.allSettled([
      api.get('/feed'),
      api.get('/users/suggestions'),
      api.get('/auth/me'),
    ])

    if (feedResult.status === 'fulfilled') {
      posts.value = feedResult.value.data.data ?? feedResult.value.data
    } else {
      console.error('Erro ao carregar feed:', feedResult.reason)
    }

    if (suggestionsResult.status === 'fulfilled') {
      suggestions.value = suggestionsResult.value.data.data ?? suggestionsResult.value.data
    } else {
      console.error('Erro ao carregar sugestões:', suggestionsResult.reason)
    }

    if (meResult.status === 'fulfilled') {
      currentUser.value = meResult.value.data.data ?? meResult.value.data
    } else {
      console.error('Erro ao carregar usuário atual:', meResult.reason)
    }

    isLoading.value = false
  }

  async function follow(userId) {
    try {
      await api.post(`/users/${userId}/follow`)
      suggestions.value = suggestions.value.filter((u) => u.id !== userId)
    } catch (err) {
      console.error(err)
    }
  }

  onMounted(loadFeed)

  return { posts, suggestions, currentUser, isLoading, errorMessage, follow }
}