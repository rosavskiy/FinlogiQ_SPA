import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  avatar?: string
  telegramId?: number
  status?: 'pending' | 'active' | 'blocked'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  // Impersonation support
  originalUser: User | null
  originalToken: string | null
  isImpersonating: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  // Impersonation methods
  startImpersonation: (user: User, token: string) => void
  stopImpersonation: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      originalUser: null,
      originalToken: null,
      isImpersonating: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        originalUser: null,
        originalToken: null,
        isImpersonating: false,
      }),
      setLoading: (isLoading) => set({ isLoading }),
      startImpersonation: (user, token) => set((state) => ({
        originalUser: state.user,
        originalToken: state.token,
        user,
        token,
        isAuthenticated: true,
        isImpersonating: true,
      })),
      stopImpersonation: () => set((state) => ({
        user: state.originalUser,
        token: state.originalToken,
        isAuthenticated: !!(state.originalUser && state.originalToken),
        originalUser: null,
        originalToken: null,
        isImpersonating: false,
      })),
    }),
    {
      name: 'finlogiq-auth',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        originalUser: state.originalUser,
        originalToken: state.originalToken,
        isImpersonating: state.isImpersonating,
      }),
    }
  )
)
