import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    tokenExpiresAt: null as number | null
  }),

  actions: {
    async fetchToken() {
      const res = await fetch('/auth/token', {
        credentials: 'include'
      })

      if (!res.ok) return false

      const data = await res.json()
      this.accessToken = data.accessToken
      this.tokenExpiresAt = Date.now() + (data.expiresIn - 60) * 1000
      return true
    },

    async spotifyFetch(url: string) {
      let res = await fetch(url, {
        headers: { 'Authorization': 'Bearer ' + this.accessToken }
      })

      if (res.status === 401) {
        await this.fetchToken()
        res = await fetch(url, {
          headers: { 'Authorization': 'Bearer ' + this.accessToken }
        })
      }

      return res.json()
    }
  }
})
