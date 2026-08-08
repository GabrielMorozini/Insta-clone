<template>
  <div class="explore-search">
    <div class="explore-search__input-wrapper">
      <img src="/icon-search.png" alt="" class="explore-search__icon" />
      <input
        v-model="query"
        type="text"
        class="explore-search__input"
        placeholder="Buscar aventureiros pelo nome..."
        @focus="isFocused = true"
      />
    </div>

    <div v-if="isFocused && query.length > 0" class="explore-search__results">
      <p v-if="isLoading" class="explore-search__status">Buscando na taverna...</p>

      <p v-else-if="!isLoading && results.length === 0" class="explore-search__status">
        Nenhum aventureiro encontrado.
      </p>

      <RouterLink
        v-for="user in results"
        :key="user.id"
        :to="`/profile/${user.username}`"
        class="explore-search__user"
        @click="handleSelectUser"
      >
        <img
          :src="user.avatar_url || '/default-avatar.png'"
          :alt="user.username"
          class="explore-search__avatar"
        />
        <div class="explore-search__user-info">
          <span class="explore-search__username">{{ user.username }}</span>
          <span v-if="user.name" class="explore-search__name">{{ user.name }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useUserSearch } from '../js/useUsersSearch.js'

const { query, results, isLoading, search, clear } = useUserSearch()
const isFocused = ref(false)

const emit = defineEmits(['select-user'])

let debounceTimer = null
watch(query, (newQuery) => {
  clearTimeout(debounceTimer)
  if (!newQuery) {
    clear()
    return
  }
  debounceTimer = setTimeout(() => {
    search(newQuery)
  }, 350)
})

function handleSelectUser() {
  isFocused.value = false
  query.value = ''
  clear()
  emit('select-user')
}

function handleClickOutside(e) {
  if (!e.target.closest('.explore-search')) {
    isFocused.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(debounceTimer)
})
</script>

<style scoped src="../css/explore.css"></style>