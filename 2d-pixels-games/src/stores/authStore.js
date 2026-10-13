import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../service/authService'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (username, password) => {
        const { token, user } = await authService.login(username, password)
        set({ token, user })
        return user
      },
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'pixel-games-auth' },
  ),
)
