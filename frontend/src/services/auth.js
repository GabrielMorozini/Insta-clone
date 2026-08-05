import api from './api'

export async function login(email, password) {
  const response = await api.post('/login', { email, password })
  localStorage.setItem('token', response.data.token)
  return response.data
}

export async function logout() {
  await api.post('/logout')
  localStorage.removeItem('token')
}

export async function register(data) {
  const response = await api.post('/register', data)
  return response.data
}