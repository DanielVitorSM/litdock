import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userName: (state) => state.user?.user_metadata?.name || '',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password
      })

      if (error) {
        this.loading = false
        this.error = error.message
        throw new Error(error.message)
      }

      this.user = data.user
      this.loading = false
    },

    async register(name: string, email: string, password: string) {
      this.loading = true
      this.error = null

      const { data, error } = await supabase.auth.signUp({
        options: { data: { name } },
        email: email.toLowerCase(),
        password
      })

      if (error) {
        this.error = error.message
        this.loading = false
        throw new Error(error.message)
      }

      this.user = data.user
      this.loading = false
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
    },

    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    }
  }
})
