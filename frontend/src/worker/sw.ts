import { precacheAndRoute } from 'workbox-precaching';

import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

const SPOTIFY_IMAGE_HOSTS = ['i.scdn.co', 'mosaic.scdn.co', 'image-cdn-ak.spotifycdn.com'];

// Pflicht: App Dateien cachen
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) =>
    url.origin === 'https://api.spotify.com' && url.pathname.startsWith('/v1/me/playlists'),

  new CacheFirst({
    cacheName: 'spotify-playlists',

    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 Woche
      }),
    ],
  })
);

registerRoute(
  ({ url }) => SPOTIFY_IMAGE_HOSTS.includes(url.hostname),

  new CacheFirst({
    cacheName: 'spotify-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);
