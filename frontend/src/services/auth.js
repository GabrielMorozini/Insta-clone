import api from './api'
export async function login(login, password) {
  const response = await api.post('/auth/login', { login, password })
  localStorage.setItem('token', response.data.access_token)
  return response.data
}

export async function logout() {
  await api.post('/auth/logout')
  localStorage.removeItem('token')
}

export async function register(data) {
  const response = await api.post('/auth/register', data)
  localStorage.setItem('token', response.data.access_token)
  return response.data
}