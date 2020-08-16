import { setCacheNameDetails, skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import CONFIG from '@/global/config';

skipWaiting();
clientsClaim();

setCacheNameDetails(CONFIG.CACHE_NAME);
precacheAndRoute(self.__WB_MANIFEST, {
    ignoreUrlParametersMatching: [/.*/]
});

registerRoute(
  ({url}) => url.origin,
  new StaleWhileRevalidate()
);

registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        plugins: [
            new CacheableResponsePlugin({
              statuses: [0, 200],
            })
          ]
    })
);

self.addEventListener('push', (event) => {
  const title = 'Dokter Rasa Push Notification';
  const options = {
    body: event.data.text()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});