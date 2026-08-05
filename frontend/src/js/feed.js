import { ref, onMounted } from 'vue'
import api from '../services/api'

export function useFeed() {
  const posts = ref([])
  const suggestions = ref([])
  const currentUser = ref(null)
  const isLoading = ref(true)
  const errorMessage = ref('')

  async function loadFeed() {
    try {
      const [feedRes, suggestionsRes, meRes] = await Promise.all([
        api.get('/feed'),
        api.get('/users/suggestions'),
        api.get('/auth/me'),
      ])
      posts.value = feedRes.data.data ?? feedRes.data
      suggestions.value = suggestionsRes.data.data ?? suggestionsRes.data
      currentUser.value = meRes.data.data ?? meRes.data
    } catch (err) {
      errorMessage.value = 'Não foi possível carregar o feed agora.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
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