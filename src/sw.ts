import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

// The self object is the service worker itself
declare let self: ServiceWorkerGlobalScope

// Pre-cache all the assets injected by the plugin
precacheAndRoute(self.__WB_MANIFEST)

// Cache API calls
registerRoute(
  ({ url }) => url.origin === 'https://api.yourapi.com',
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      // ... you can add plugins for expiration, etc.
    ]
  })
)