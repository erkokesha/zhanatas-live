const CACHE='zhanatas-live-public-v10-2';
const PRE=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zhanatas-live-public-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const r=event.request,url=new URL(r.url);
 if(r.method!=='GET'||url.origin!==location.origin||/\/(?:admin\.html|api|auth)/i.test(url.pathname))return;
 if(!PRE.some(p=>url.pathname.endsWith('/'+p.replace('./',''))))return;
 event.respondWith(fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy)).catch(()=>{})}return res}).catch(()=>caches.match(r).then(m=>m||Response.error())));
});
