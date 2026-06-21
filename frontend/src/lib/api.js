import axios from 'axios'

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin + '/api/v1' : '/api/v1') })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((response) => response, async (error) => {
  const original = error.config
  if (error.response?.status === 401 && !original?._retry && localStorage.getItem('refresh_token')) {
    original._retry = true
    try {
      const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refresh_token: localStorage.getItem('refresh_token') })
      setSession(data)
      original.headers.Authorization = `Bearer ${data.access_token}`
      return api(original)
    } catch { clearSession() }
  }
  return Promise.reject(error)
})

export function setSession(data) {
  localStorage.setItem('access_token', data.access_token)
  localStorage.setItem('refresh_token', data.refresh_token)
  localStorage.setItem('user', JSON.stringify(data.user))
}

export function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

export const errorMessage = (error) => error.response?.data?.detail || 'Something went wrong. Please try again.'

