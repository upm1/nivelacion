;
//asignar un nombre y versión al cache
const CACHE_NAME = 'v2_Registros',
  urlsToCache = [
    './',
    'index.html',
    'cart_items.html',
    'style.css',
    'main.js',
    'script.js',
    'manifest.json',
    'https://unpkg.com/dexie@latest/dist/dexie.js',
    'cart.js',
    'cartUI.js',
    'connection.js',
    'products.js',
    'cake.jpg',
    'chocolate.jpg',
    'dulce.jpg',
    'sanwich.jpg'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})


self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
        
          return res
        }
        return fetch(e.request)
      })
  )
})
