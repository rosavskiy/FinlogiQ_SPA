import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  telegramAuth: (initData: string) =>
    api.post('/auth/telegram', { initData }),
  
  me: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
}

// Users API
export const usersApi = {
  getAll: (page = 1, limit = 10) =>
    api.get('/users', { params: { page, limit } }),
  
  getById: (id: string) =>
    api.get(`/users/${id}`),
  
  update: (id: string, data: { name?: string; email?: string }) =>
    api.put(`/users/${id}`, data),
  
  changePassword: (id: string, data: { currentPassword: string; newPassword: string }) =>
    api.put(`/users/${id}/password`, data),
  
  updateAvatar: (id: string, avatar: string) =>
    api.put(`/users/${id}/avatar`, { avatar }),
  
  updateNotifications: (id: string, data: { email?: boolean; push?: boolean; marketing?: boolean }) =>
    api.put(`/users/${id}/notifications`, data),
  
  delete: (id: string) =>
    api.delete(`/users/${id}`),
  
  updateRole: (id: string, role: 'user' | 'admin') =>
    api.put(`/users/${id}/role`, { role }),
  
  updateStatus: (id: string, status: 'pending' | 'active' | 'blocked') =>
    api.put(`/users/${id}/status`, { status }),
  
  impersonate: (id: string) =>
    api.post(`/users/${id}/impersonate`),
}

// Projects API
export const projectsApi = {
  getAll: (page = 1, limit = 10, category?: string) =>
    api.get('/projects', { params: { page, limit, category } }),
  
  getAllAdmin: (page = 1, limit = 10) =>
    api.get('/projects/admin/all', { params: { page, limit } }),
  
  getBySlug: (slug: string) =>
    api.get(`/projects/slug/${slug}`),
  
  getById: (id: string) =>
    api.get(`/projects/${id}`),
  
  create: (data: any) =>
    api.post('/projects', data),
  
  update: (id: string, data: any) =>
    api.put(`/projects/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/projects/${id}`),
}

// Articles API
export const articlesApi = {
  getAll: (page = 1, limit = 10, category?: string) =>
    api.get('/articles', { params: { page, limit, category } }),
  
  getAllAdmin: (page = 1, limit = 10) =>
    api.get('/articles/admin/all', { params: { page, limit } }),
  
  getCategories: () =>
    api.get('/articles/categories'),
  
  getBySlug: (slug: string) =>
    api.get(`/articles/slug/${slug}`),
  
  getById: (id: string) =>
    api.get(`/articles/${id}`),
  
  create: (data: any) =>
    api.post('/articles', data),
  
  update: (id: string, data: any) =>
    api.put(`/articles/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/articles/${id}`),
}

// Contact API
export const contactApi = {
  submit: (data: { name: string; email: string; phone?: string; message: string }) =>
    api.post('/contact', data),
  
  getAll: (page = 1, limit = 10, status?: string) =>
    api.get('/contact', { params: { page, limit, status } }),
  
  getUnreadCount: () =>
    api.get('/contact/unread'),
  
  getById: (id: string) =>
    api.get(`/contact/${id}`),
  
  updateStatus: (id: string, status: 'new' | 'read' | 'replied') =>
    api.put(`/contact/${id}`, { status }),
  
  delete: (id: string) =>
    api.delete(`/contact/${id}`),
}

// Stats API (Dashboard)
export const statsApi = {
  getDashboard: () =>
    api.get('/stats/dashboard'),
}

export default api
