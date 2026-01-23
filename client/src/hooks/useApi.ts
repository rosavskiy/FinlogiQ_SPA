import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, usersApi, projectsApi, articlesApi, contactApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useTelegram } from '../context/TelegramContext'

// Auth Hooks
export const useLogin = () => {
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, token } = response.data
      login(user, token)
    },
  })
}

export const useRegister = () => {
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { user, token } = response.data
      login(user, token)
    },
  })
}

export const useTelegramAuth = () => {
  const { login } = useAuthStore()
  const { webApp } = useTelegram()

  return useMutation({
    mutationFn: () => {
      if (!webApp?.initData) {
        throw new Error('No Telegram init data')
      }
      return authApi.telegramAuth(webApp.initData)
    },
    onSuccess: (response) => {
      const { user, token } = response.data
      login(user, token)
    },
  })
}

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.me,
    enabled: isAuthenticated,
  })
}

// Projects Hooks
export const useProjects = (page = 1, limit = 10, category?: string) => {
  return useQuery({
    queryKey: ['projects', page, limit, category],
    queryFn: () => projectsApi.getAll(page, limit, category),
  })
}

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectsApi.getBySlug(slug),
    enabled: !!slug,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// Articles Hooks
export const useArticles = (page = 1, limit = 10, category?: string) => {
  return useQuery({
    queryKey: ['articles', page, limit, category],
    queryFn: () => articlesApi.getAll(page, limit, category),
  })
}

export const useArticleCategories = () => {
  return useQuery({
    queryKey: ['articleCategories'],
    queryFn: articlesApi.getCategories,
  })
}

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => articlesApi.getBySlug(slug),
    enabled: !!slug,
  })
}

export const useCreateArticle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: articlesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export const useUpdateArticle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      articlesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export const useDeleteArticle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: articlesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

// Contact Hooks
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: contactApi.submit,
  })
}

export const useContactMessages = (page = 1, limit = 10, status?: string) => {
  return useQuery({
    queryKey: ['contacts', page, limit, status],
    queryFn: () => contactApi.getAll(page, limit, status),
  })
}

export const useUnreadContactCount = () => {
  return useQuery({
    queryKey: ['unreadContacts'],
    queryFn: contactApi.getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'new' | 'read' | 'replied' }) =>
      contactApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['unreadContacts'] })
    },
  })
}

export const useDeleteContact = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: contactApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['unreadContacts'] })
    },
  })
}
