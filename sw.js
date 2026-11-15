const CACHE='qia.pbz.offline.9f4c2a81e7b35d60';
const FILES=["./", "app.en.js", "app.zh.js", "bootstrap.js", "data.en.js", "data.zh.js", "images/icon-1024.png", "images/icon-180.png", "images/icon-192.png", "images/icon-512.png", "images/icon.png", "images/map.webp", "images/maps/crimson-forest.webp", "images/maps/mandate-encampment.webp", "images/maps/meigu-lake.webp", "images/maps/mount-soulrend.webp", "images/maps/mountain-of-imprisonment.webp", "images/maps/pangzhen.webp", "images/maps/village-of-lu.webp", "images/maps/weeping-creek-valley.webp", "images/support/alipay.png", "images/support/cashapp.png", "images/support/paypal.png", "images/support/wechat.png", "index.html", "manifest.webmanifest", "style.css", "support.css", "support.js"];
const URLS=new Set(FILES.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await Promise.all(FILES.map(async p=>{
  const url=new URL(p,self.registration.scope);const response=await fetch(url,{cache:'reload',credentials:'same-origin'});
  if(!response.ok||new URL(response.url).origin!==url.origin)throw Error('Offline resource unavailable');
  const type=response.headers.get('content-type')||'';
  if(/\.js$/.test(url.pathname)&&!type.includes('javascript'))throw Error('Unexpected script response');
  if(p==='./'&&!(await response.clone().text()).includes('src="bootstrap.js"'))throw Error('Authentication is required');
  await cache.put(url,response);
 }));await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('qia.pbz.offline.')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!URLS.has(event.request.url))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);return (await cache.match(event.request))||fetch(event.request);})());
});
