import { defineStore } from 'pinia';

const base_url = 'https://api.spotify.com/v1/';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    tokenExpiresAt: null as number | null,
  }),

  actions: {
    async fetchToken(): Promise<'ok' | 'offline' | 'unauthorized'> {
      try {
        const res = await fetch('/auth/token', { credentials: 'include' });
        if (!res.ok) {
          localStorage.removeItem('wasLoggedIn');
          return 'unauthorized';
        }
        const data = await res.json();
        this.accessToken = data.accessToken;
        this.tokenExpiresAt = Date.now() + (data.expiresIn - 60) * 1000;
        localStorage.setItem('wasLoggedIn', 'true');
        return 'ok';
      } catch {
        return 'offline';
      }
    },

    async spotifyFetch(url: string) {
      try {
        let res = await fetch(base_url + url, {
          headers: { Authorization: 'Bearer ' + this.accessToken },
        });
        if (res.status === 401) {
          await this.fetchToken();
          res = await fetch(base_url + url, {
            headers: { Authorization: 'Bearer ' + this.accessToken },
          });
        }
        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }
        return { ok: res.ok, status: res.status, data };
      } catch (e) {
        console.error('spotifyFetch failed:', url, e);
        return null;
      }
    },

    async spotifyRequest(method: 'PUT' | 'POST' | 'DELETE', url: string, body?: object) {
      const doRequest = () =>
        fetch(base_url + url, {
          method,
          headers: {
            Authorization: 'Bearer ' + this.accessToken,
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        });
      let res = await doRequest();
      if (res.status === 401) {
        await this.fetchToken();
        res = await doRequest();
      }

      const text = await res.text();
      const data = (() => {
        try {
          return text ? JSON.parse(text) : null;
        } catch {
          return null;
        }
      })();
      return { ok: res.ok, status: res.status, data };
    },

    async spotifyPut(url: string, body?: object) {
      return this.spotifyRequest('PUT', url, body);
    },

    async spotifyPost(url: string, body?: object) {
      return this.spotifyRequest('POST', url, body);
    },

    async spotifyDelete(url: string, body?: object) {
      return this.spotifyRequest('DELETE', url, body);
    },
  },
});
