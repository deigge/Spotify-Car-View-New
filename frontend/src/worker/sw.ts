import { precacheAndRoute } from 'workbox-precaching';

import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

// Pflicht: App Dateien cachen
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.origin === 'https://api.spotify.com' && url.pathname.includes('/me/playlists'),

  new StaleWhileRevalidate({
    cacheName: 'spotify-playlists',

    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 Woche
      }),
    ],
  })
);
