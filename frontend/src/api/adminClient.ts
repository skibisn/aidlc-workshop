import axios from 'axios'

const adminClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

adminClient.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default adminClient
