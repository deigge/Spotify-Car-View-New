import { precacheAndRoute, createHandlerBoundToURL, matchPrecache } from 'workbox-precaching';

import { registerRoute, NavigationRoute, setCatchHandler } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope;

// @ts-expect-error - lib type issue, skipWaiting existiert zur Laufzeit
self.skipWaiting();
clientsClaim();

// Pflicht: App Dateien cachen
precacheAndRoute(self.__WB_MANIFEST);

const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/auth/, /^\/api/],
});
registerRoute(navigationRoute);

setCatchHandler(async ({ request }) => {
  if (request.destination === 'image') {
    const fallback = await matchPrecache('/img/album_cover_placeholder.png');
    if (fallback) return fallback;
  }
  return Response.error();
});

registerRoute(
  ({ url }) => url.pathname === '/api/history',

  new NetworkFirst({
    cacheName: 'user-history',
    networkTimeoutSeconds: 5,
  })
);

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
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 Woche
      }),
    ],
  })
);
