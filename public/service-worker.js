/* The service worker is the first code that runs in the application, even before index.html or any other JavaScript file. As long as the browser supports service workers, the service worker will run, regardless of whether or not the user is connected to the internet. This means that if you were to update your application code, the service worker will still load the old files. */

const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// which items are we going to cache?
const FILES_TO_CACHE = [
    "./index.html",
    "./js/idb.js",
    "./js/index.js",
    "./css/styles.css",
    "./icons/icon-512x512.png",
    "./icons/icon-384x384.png",
    "./icons/icon-192x192.png",
    "./icons/icon-152x152.png",
    "./icons/icon-144x144.png",
    "./icons/icon-128x128.png",
    "./icons/icon-96x96.png",
    "./icons/icon-72x72.png"
  ];

self.addEventListener('install', function (e) {
    //  tell the browser to wait until the work is complete before terminating the service worker
    e.waitUntil(
        // find the specific cache by name
      caches.open(CACHE_NAME).then(function (cache) {
        console.log('installing cache : ' + CACHE_NAME)
        // add every file in the FILES_TO_CACHE array to the cache
        return cache.addAll(FILES_TO_CACHE)
      })
    )
  })

self.addEventListener('activate', function (e) {
    e.waitUntil(
        // .keys() returns an array of all cache names, which we're calling keyList. keyList is a parameter that contains all cache names under <username>.github.io
      caches.keys().then(function (keyList) {
        let cacheKeeplist = keyList.filter(function (key) {
          return key.indexOf(APP_PREFIX);
        });

    cacheKeeplist.push(CACHE_NAME);

    //Remember that we set up CACHE_NAME as a global constant to help keep track of which cache to use. Finish the routine with the return statement shown in the following sample:

    return Promise.all(keyList.map(function (key, i) {
            if (cacheKeeplist.indexOf(key) === -1) {
                console.log('deleting cache : ' + keyList[i] );
                return caches.delete(keyList[i]);
            }
        })
    );
    })
   );
});

// tell the app how to retrive info from the cache

self.addEventListener('fetch', function (e) {
    // listen for the fetch event, log the URL of the requested resource, and then begin to define how we will respond to the request.
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
              console.log('responding with cache : ' + e.request.url)
              return request
            } else {
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
            
            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
          })
    )
  })