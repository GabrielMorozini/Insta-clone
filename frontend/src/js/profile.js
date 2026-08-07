import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// Configura a URL do seu backend FrankenPHP (rodando na porta 8000 de acordo com os logs)
axios.defaults.baseURL = 'http://localhost:8000'

const route = useRoute()

const loading = ref(true)
const error = ref(false)

const user = reactive({
  username: '',
  fullName: '',
  avatar: '',
  bio: '',
  website: '',
  postsCount: 0,
  followers: 0,
  following: 0,
})

const isFollowing = ref(false)
const activeTab = ref('posts')
const highlights = ref([])
const posts = ref([])

const tabs = [
  { name: 'posts', icon: 'M4 4h16v16H4V4zm2 2v12h12V6H6z' },
  { name: 'reels', icon: 'M4 4h16v16H4V4zm5 3v10l8-5-8-5z' },
  { name: 'tagged', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
]

async function fetchProfile() {
  loading.value = true
  error.value = false

  try {
    // Fallback para o ID 1 se a rota estiver vazia
    const userId = route.params.id || 1

    // 1. Busca dados do usuário
    const userRes = await axios.get(`/api/users/${userId}`)
    const data = userRes.data

    Object.assign(user, {
      username: data.username,
      fullName: data.name,
      avatar: data.avatar_url,
      bio: data.bio,
      website: data.website,
      postsCount: data.posts_count,
      followers: data.followers_count,
      following: data.following_count,
    })

    isFollowing.value = data.is_following

    // 2. Busca os posts de forma segura
    const postsRes = await axios.get(`/api/users/${userId}/posts`)
    const postsData = postsRes.data
    
    // Tratamento para garantir que postsData seja uma lista válida
    let postsList = []
    if (Array.isArray(postsData)) {
      postsList = postsData
    } else if (postsData && Array.isArray(postsData.posts)) {
      postsList = postsData.posts
    }

    posts.value = postsList.map((p) => {
      return {
        id: p.id,
        image: p.image_url,
        isMultiple: p.media_count > 1
      }
    })

    highlights.value = data.highlights ?? []
  } catch (err) {
    console.error("Erro detalhado na requisição:")
    console.dir(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

async function toggleFollow() {
  const previous = isFollowing.value
  isFollowing.value = !isFollowing.value
  user.followers += isFollowing.value ? 1 : -1

  try {
    const userId = route.params.id || 1
    if (isFollowing.value) {
      await axios.post(`/api/users/${userId}/follow`)
    } else {
      await axios.delete(`/api/users/${userId}/follow`)
    }
  } catch (err) {
    isFollowing.value = previous
    user.followers += previous ? 1 : -1
    console.error(err)
  }
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k'
  return n
}

onMounted(fetchProfile)