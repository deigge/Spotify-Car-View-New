import { defineStore } from 'pinia';

const base_url = 'https://api.spotify.com/v1/';

/**
 * Pinia Store für Authentication + Spotify API Requests.
 *
 * Verantwortlichkeiten:
 * - Token Management
 * - automatische Token-Erneuerung
 * - zentrale Spotify API Requests
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    tokenExpiresAt: null as number | null,
  }),

  actions: {
    /**
     * Holt ein neues Access Token vom Backend.
     *
     * Rückgabewerte:
     * - ok → Token gültig erhalten
     * - offline → Netzwerkfehler
     * - unauthorized → Login nicht mehr gültig
     */
    async fetchToken(): Promise<'ok' | 'offline' | 'unauthorized'> {
      try {
        const res = await fetch('/auth/token', { credentials: 'include' });
        if (!res.ok) {
          localStorage.removeItem('wasLoggedIn');
          return 'unauthorized';
        }
        const data = await res.json();
        this.accessToken = data.accessToken;
        // Token Ablaufzeit etwas früher setzen, um Expiry-Race zu vermeiden
        this.tokenExpiresAt = Date.now() + (data.expiresIn - 60) * 1000;
        localStorage.setItem('wasLoggedIn', 'true');
        return 'ok';
      } catch {
        return 'offline';
      }
    },

    /**
     * GET Request an Spotify API mit automatischem Token Retry bei 401.
     */
    async spotifyFetch(url: string) {
      try {
        let res = await fetch(base_url + url, {
          headers: { Authorization: 'Bearer ' + this.accessToken },
        });
        // Token abgelaufen → erneuern und Request wiederholen
        if (res.status === 401) {
          await this.fetchToken();
          res = await fetch(base_url + url, {
            headers: { Authorization: 'Bearer ' + this.accessToken },
          });
        }

        const text = await res.text();
        let data = null;

        // sichere JSON-Parsing Logik (Spotify kann auch leere Antworten liefern)
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

    /**
     * Generischer Spotify Request (PUT / POST / DELETE)
     * mit automatischem Token Refresh bei 401.
     */
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

      // Token abgelaufen → erneuern und retry
      if (res.status === 401) {
        await this.fetchToken();
        res = await doRequest();
      }

      const text = await res.text();

      // sichere JSON Verarbeitung (Spotify antwortet oft ohne Body)
      const data = (() => {
        try {
          return text ? JSON.parse(text) : null;
        } catch {
          return null;
        }
      })();

      return { ok: res.ok, status: res.status, data };
    },

    /**
     * Spotify PUT Request Wrapper
     */
    async spotifyPut(url: string, body?: object) {
      return this.spotifyRequest('PUT', url, body);
    },

    /**
     * Spotify POST Request Wrapper
     */
    async spotifyPost(url: string, body?: object) {
      return this.spotifyRequest('POST', url, body);
    },

    /**
     * Spotify DELETE Request Wrapper
     */
    async spotifyDelete(url: string, body?: object) {
      return this.spotifyRequest('DELETE', url, body);
    },
  },
});
