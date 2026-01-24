import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

// Dashboard
export interface DashboardStats {
  stats: {
    projects: number
    articles: number
    contacts: number
    users: number
  }
  recentContacts: Contact[]
  recentProjects: Project[]
}

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/stats/dashboard')
      return data
    },
  })
}

// Projects
export interface Project {
  _id: string
  title: string
  slug: string
  category: string
  description: string
  fullDescription?: string
  image?: string
  gallery?: string[]
  status: 'active' | 'completed' | 'upcoming'
  isPublished: boolean
  order: number
  createdAt: string
}

export const useAdminProjects = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['admin-projects', page, limit],
    queryFn: async () => {
      const { data } = await api.get('/projects/admin/all', {
        params: { page, limit },
      })
      return data
    },
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const { data } = await api.post('/projects', project)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...project }: Partial<Project> & { id: string }) => {
      const { data } = await api.put(`/projects/${id}`, project)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/projects/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
    },
  })
}

// Articles
export interface Article {
  _id: string
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  image?: string
  readTime?: string
  isPublished: boolean
  views: number
  createdAt: string
}

export const useAdminArticles = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['admin-articles', page, limit],
    queryFn: async () => {
      const { data } = await api.get('/articles/admin/all', {
        params: { page, limit },
      })
      return data
    },
  })
}

export const useCreateArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (article: Partial<Article>) => {
      const { data } = await api.post('/articles', article)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })
}

export const useUpdateArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...article }: Partial<Article> & { id: string }) => {
      const { data } = await api.put(`/articles/${id}`, article)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })
}

export const useDeleteArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/articles/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })
}

// Contacts
export interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: string
}

export const useAdminContacts = (page = 1, limit = 10, status?: string) => {
  return useQuery({
    queryKey: ['admin-contacts', page, limit, status],
    queryFn: async () => {
      const { data } = await api.get('/contact', {
        params: { page, limit, status },
      })
      return data
    },
  })
}

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/contact/${id}`, { status })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/contact/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
    },
  })
}

// Users
export interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'user'
  telegramId?: number
  isActive: boolean
  createdAt: string
}

export const useAdminUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['admin-users', page, limit],
    queryFn: async () => {
      const { data } = await api.get('/users', {
        params: { page, limit },
      })
      return data
    },
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { data } = await api.put(`/users/${id}/role`, { role })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export const useToggleUserActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await api.put(`/users/${id}/status`, { isActive })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}
