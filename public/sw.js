const CACHE__NAME = 'v0';

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE__NAME)
			.then(function (cache) {
				return cache.addAll(['/index.html', '/looks.css', '/logic.js', '/favicon.png', '/img/notfound.png']);
			})
	);
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys()
			.then(function (keyList) {
				return Promise.all(keyList.map(function (key) {
					if (key !== CACHE__NAME) {
						console.log('Removing old cache.', key);
						return caches.delete(key);
					}
				}));
			})
	);
	return self.clients.claim(); // return could be omitted
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		fetch(event.request)
			.then(function (res) {
				return caches.open(CACHE__NAME)
					.then(function (cache) {
						cache.put(event.request.url, res.clone());
						return res;
					})
			})
			.catch(function (err) {
				console.error(err);
				return caches.match(event.request)
					.then(function (res) {
						return res ? res : caches.match('/img/notfound.png')
					});
			})
	);
});

// self.addEventListener('fetch', function (event) {
// 	event.respondWith(
// 		caches.match(event.request)
// 			.then(function (cacheResponse) {
// 				if (cacheResponse !== undefined) return cacheResponse;
// 				return fetch(event.request)
// 					.then(function (networkResponse) {
// 						const clonedResponse = networkResponse.clone();
// 						caches.open('v0')
// 							.then(function (cache) {
// 								cache.put(event.request, clonedResponse);
// 							});
// 						return networkResponse;
// 					}, function (error) {
// 						console.error(error);
// 						return caches.match('/img/notfound.png');
// 					});
// 			})
// 	);
// });
// Need cache first request network and update cache if hit
// Network First affects load time then if request drops cache is loaded quickly