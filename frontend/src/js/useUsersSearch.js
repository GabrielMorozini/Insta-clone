import { ref } from 'vue'
import api from '../services/api.js'

export function useUserSearch() {
  const query = ref('')
  const results = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function search(term) {
    if (!term) {
      results.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await api.get('/api/users/search', {
        params: { q: term },
      })
      results.value = response.data.data ?? response.data
    } catch (err) {
      error.value = err
      results.value = []
    } finally {
      isLoading.value = false
    }
  }

  function clear() {
    results.value = []
  }

  return { query, results, isLoading, error, search, clear }
}