var appVersion='v1.02';

//files to cache

var files=[
  './',
  './index.html',
  './css/all.css',
   './css/main.css',
   './css/bootstrap.min.css',
  './js/app.js',
  './js/bootstrap.bundle.min.js',
  './js/jquery-3.3.1.min.js',
  './webfonts/fa-brands-400.eot',
  './webfonts/fa-brands-400.svg',
  './webfonts/fa-brands-400.ttf',
  './webfonts/fa-brands-400.woff',
  './webfonts/fa-brands-400.woff2',
  './webfonts/fa-regular-400.eot',
  './webfonts/fa-regular-400.svg',
  './webfonts/fa-regular-400.ttf',
  './webfonts/fa-regular-400.woff',
  './webfonts/fa-regular-400.woff2',
  './webfonts/fa-solid-900.eot',
  './webfonts/fa-solid-900.svg',
  './webfonts/fa-solid-900.ttf',
  './webfonts/fa-solid-900.woff',
  './webfonts/fa-solid-900.woff2'
]

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(appVersion)
    .then(cache=> {
      return cache.addAll(files)
      .catch(err=>{
        console.error('error adding files to cache',err);
      })
    })
  )

  console.info('sw installed');
  self.skipWaiting();
})


// activate

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
    .then(cacheNames=>{
      return Promise.all(
        cacheNames.map(cache=>{
          if(cache!==appVersion){
            console.info('deleting old cache',cache);
            return caches.delete(cache);
          }
        })
      )
    })
  )
  return self.clients.claim();

})



//fetch

self.addEventListener('fetch',event=>{
  console.info('sw fetch',event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(res=>{
      return res || fetch(event.request);

    })
  )
})
