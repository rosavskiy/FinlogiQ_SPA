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
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
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
      startImpersonation: (user, token) => {
        const currentState = get()
        set({
          originalUser: currentState.user,
          originalToken: currentState.token,
          user,
          token,
          isImpersonating: true,
        })
      },
      stopImpersonation: () => {
        const currentState = get()
        set({
          user: currentState.originalUser,
          token: currentState.originalToken,
          originalUser: null,
          originalToken: null,
          isImpersonating: false,
        })
      },
    }),
    {
      name: 'finlogiq-auth',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        originalUser: state.originalUser,
        originalToken: state.originalToken,
        isImpersonating: state.isImpersonating,
      }),
    }
  )
)
