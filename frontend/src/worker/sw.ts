import { precacheAndRoute, createHandlerBoundToURL, matchPrecache } from 'workbox-precaching';

import { registerRoute, NavigationRoute, setCatchHandler } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope;

// @ts-expect-error - lib type issue, skipWaiting existiert zur Laufzeit
// Sofortige Kontrolle übernehmen (kein Warten auf alte SW)
self.skipWaiting();
clientsClaim();

/**
 * Precache aller Build-Artefakte (Vite/Vue App Shell)
 */
precacheAndRoute(self.__WB_MANIFEST);

/**
 * Fallback für Navigation (Vue App Routing).
 *
 * Verhalten:
 * - Wenn eine Route im Browser aufgerufen wird,
 *   wird immer index.html zurückgegeben
 *   (damit Vue Router die Seite übernehmen kann)
 *
 * - Ausgenommen:
 *   - /auth (Login / Auth Flow)
 *   - /api (Backend Requests)
 */
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/auth/, /^\/api/],
});
registerRoute(navigationRoute);

/**
 * Fallback für fehlgeschlagene Requests im Service Worker.
 */
setCatchHandler(async ({ request }) => {
  // Nur für Bilder: wenn ein Bild nicht geladen werden kann,
  // verwende ein lokales Platzhalterbild aus dem Cache
  if (request.destination === 'image') {
    const fallback = await matchPrecache('/album_cover_placeholder.png');
    if (fallback) return fallback;
  }
  return Response.error();
});

/**
 * Spotify Player State
 * wird aus dem Cache gelesen und im Hintergrund aktualisiert
 */
registerRoute(
  ({ url }) => url.origin === 'https://api.spotify.com' && url.pathname === '/v1/me/player',
  new StaleWhileRevalidate({
    cacheName: 'spotify-player',
    matchOptions: { ignoreVary: true },
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 30,
      }),
    ],
  })
);

/**
 * API Request für Verlauf
 * Netzwerk wird bevorzugt, Cache nur bei fehlender/zu langsamer Verbindung
 */
registerRoute(
  ({ url }) => url.pathname === '/api/history',

  new NetworkFirst({
    cacheName: 'user-history',
    networkTimeoutSeconds: 5,
  })
);

/**
 * Spotify Playlist Details
 * Cache wird verwendet und im Hintergrund aktualisiert
 * Einträge laufen nach Zeit und Anzahl begrenzt aus
 */
registerRoute(
  ({ url }) =>
    url.origin === 'https://api.spotify.com' && url.pathname.startsWith('/v1/playlists/'),
  new StaleWhileRevalidate({
    cacheName: 'spotify-playlists',
    matchOptions: { ignoreVary: true },
    plugins: [
      new ExpirationPlugin({
        maxEntries: 5,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

/**
 * Spotify User Playlists
 * Cache wird verwendet und im Hintergrund aktualisiert
 * Einträge bleiben bis zum Ablaufdatum im Cache
 */
registerRoute(
  ({ url }) =>
    url.origin === 'https://api.spotify.com' && url.pathname.startsWith('/v1/me/playlists'),

  new StaleWhileRevalidate({
    cacheName: 'spotify-playlists',
    matchOptions: { ignoreVary: true },
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 Woche
      }),
    ],
  })
);

/**
 * Spotify Images (Album Cover / Artwork)
 * werden aus Cache geladen und im Hintergrund aktualisiert
 * Cache speichert nur erfolgreiche Antworten (200 oder opaque)
 * Einträge werden nach Zeit und Anzahl begrenzt
 */
registerRoute(
  ({ url }) =>
    url.hostname === 'i.scdn.co' ||
    url.hostname === 'mosaic.scdn.co' ||
    /^image-cdn-\w+\.spotifycdn\.com$/.test(url.hostname),

  new StaleWhileRevalidate({
    cacheName: 'spotify-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // 0 = opaque responses!
      }),
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 Woche
      }),
    ],
  })
);
