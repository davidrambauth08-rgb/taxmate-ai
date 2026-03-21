var CACHE='taxmate-ai-v4';
var ASSETS=['/taxmate-ai/','/taxmate-ai/index.html','/taxmate-ai/manifest.json','/taxmate-ai/icon-192.png','/taxmate-ai/icon-512.png'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(names){
    return Promise.all(names.filter(function(n){return n!==CACHE;}).map(function(n){return caches.delete(n);}));
  }));
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  e.respondWith(
    fetch(e.request).then(function(r){
      if(r&&r.status===200){
        var rc=r.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,rc);});
      }
      return r;
    }).catch(function(){return caches.match(e.request);})
  );
});
