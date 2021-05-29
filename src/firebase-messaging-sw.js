importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js")

var firebaseConfig = {
    apiKey: "AIzaSyAUj7DWC0s0qt3_cwYvXf5fcvcJbnP9DuA",
    authDomain: "job-portal-8aa59.firebaseapp.com",
    projectId: "job-portal-8aa59",
    storageBucket: "job-portal-8aa59.appspot.com",
    messagingSenderId: "593914624373",
    appId: "1:593914624373:web:7bc7ac934dfa34b74ffb3c",
    measurementId: "G-95NCG2QDWL"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    // self.registration.showNotification(notificationTitle,
    //   notificationOptions);
});

const cacheName = 'edby-job-poratl-vc4u2654ck-v1';

const appShellFiles = [
  "./index.html",
  "./front/pages/index.html",
  './resources/edby-logo.png',
  './resources/edby-logo.jpg',
  "./front/css/front.css",
  "./front/css/front.css.map",
  "./dashboard/css/dashboard.css",
  "./dashboard/css/dashboard.css.map",
  "./dashboard/css/bootstrap/bootstrap-grid.css",
  "./dashboard/css/bootstrap/bootstrap-grid.css.map",
  "./dashboard/css/bootstrap/bootstrap-reboot.css",
  "./dashboard/css/bootstrap/bootstrap-reboot.css.map",
  "./dashboard/css/bootstrap/bootstrap.css",
  "./dashboard/css/bootstrap/bootstrap.css.map",
  "./vendor/@fortawesome/fontawesome-free/css/all.min.css",
  "./dashboard/assets/vendor/nucleo/css/nucleo.css",
  "./vendor/prismjs/themes/prism.css",
  "./dashboard/assets/js/config.js",
  // "./dashboard/assets/js/haveAcess.js",
  // "./dashboard/assets/js/havenotAccess.js",
  "./dashboard/assets/js/dashboard.js",
  "./front/assets/js/jobSearch.js",
  "./dashboard/assets/js/userDashboard.js",
  "./dashboard/assets/js/profile-card.js",
  "./front/assets/js/teacher-card.js",
  "./dashboard/pages/dashboards/dashboard.html",
  "./dashboard/pages/examples/login.html",
  "./dashboard/pages/examples/register.html",
  "./dashboard/pages/examples/admin-jobs.html",
  "./dashboard/pages/examples/blog-detail.html",
  "./dashboard/pages/examples/forgotpassword.html",
  "./dashboard/pages/examples/postJob.html",
  "./dashboard/pages/examples/preference.html",
  "./dashboard/pages/examples/profile-card.html",

];


const gamesImages = [];
// for (let i = 0; i < games.length; i++) {
//   gamesImages.push(`data/img/${games[i].slug}.jpg`);
// }
const contentToCache = appShellFiles//.concat(gamesImages);

self.addEventListener('install', (e) => {
  // console.log('[Service Worker] Install');
  e.waitUntil(self.skipWaiting());
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    // console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});



////works
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName,{ ignoreSearch: true }).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        if(/\.jpg$|\.png$|\.svg|\.js$|\.css$|\.html$|\.woff2$|launcher=pwa$|\.js\?v=.*$|js\?id=.*$/.test(event.request.url)){
          // console.log('Used Cached')
          
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          return response||fetchPromise;
        }else{
          // console.log('Made Request',event.request.url)
          return fetch(event.request).then(function(new_response) {
            cache.put(event.request, new_response.clone());
            return new_response;
          }).catch((e)=>{
            return response;
          })  
        }
      });
    })
  );
});

/**
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName,{ ignoreSearch: true }).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        if(/\.jpg$|\.png$|\.svg|\.js$|\.css$|\.html$|\.woff2$|launcher=pwa$|\.js\?v=.*$|js\?id=.*$/.test(event.request.url)){
          // console.log('Used Cached')
          return response || fetch(event.request).then(function(new_response) {
            cache.put(event.request, new_response.clone());
            return new_response;
          }) 
        }else{
          // console.log('Made Request',event.request.url)
          return fetch(event.request).then(function(new_response) {
            cache.put(event.request, new_response.clone());
            return new_response;
          }).catch((e)=>{
            return response;
          })  
        }
      });
    })
  );
});
 * 
 */

// if (/\.jpg$|.png$/.test(event.request.url)) {                             

  //   var supportsWebp = false;
  //   if (event.request.headers.has('accept')) {                              
  //     supportsWebp = event.request.headers
  //       .get('accept')
  //       .includes('webp');
  //   }

  //   if (supportsWebp) {                                                     
  //      var req = event.request.clone();

  //     var returnUrl = req.url.substr(0, req.url.lastIndexOf(".")) + ".webp";

  //     event.respondWith(
  //       fetch(returnUrl, {
  //         mode: 'no-cors'
  //       })
  //     );
  //   }
  // }