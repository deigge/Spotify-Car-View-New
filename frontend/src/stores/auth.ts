import { defineStore } from 'pinia'

const base_url = 'https://api.spotify.com/v1/'

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
      let res = await fetch(base_url + url, {
        headers: { 'Authorization': 'Bearer ' + this.accessToken }
      })

      if (res.status === 401) {
        await this.fetchToken()
        res = await fetch(base_url + url, {
          headers: { 'Authorization': 'Bearer ' + this.accessToken }
        })
      }

      return res.json();
    },

    async spotifyRequest(method: 'PUT' | 'POST', url: string, body?: object) {
    const doRequest = () => fetch(base_url + url, {
        method,
        headers: {
            'Authorization': 'Bearer ' + this.accessToken,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    });

    let res = await doRequest();

    if (res.status === 401) {
        await this.fetchToken()
        res = await doRequest();
    }

    return res.status !== 204 ? res.json() : null;
    },

    async spotifyPut(url: string, body?: object) {
      return this.spotifyRequest('PUT', url, body);
    },

    async spotifyPost(url: string, body?: object) {
      return this.spotifyRequest('POST', url, body);
    }
  }
})
